# Datenverarbeitungsvereinbarung {#data-processing-agreement}

<!-- v1.0 von <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## Inhaltsverzeichnis {#table-of-contents}

* [Schlüsselbegriffe](#key-terms)
* [Änderungen der Vereinbarung](#changes-to-the-agreement)
* [1. Auftragsverarbeiter- und Unterauftragsverarbeiter-Beziehungen](#1-processor-and-subprocessor-relationships)
  * [1. Anbieter als Auftragsverarbeiter](#1-provider-as-processor)
  * [2. Anbieter als Unterauftragsverarbeiter](#2-provider-as-subprocessor)
* [2. Verarbeitung](#2-processing)
  * [1. Verarbeitungsdetails](#1-processing-details)
  * [2. Verarbeitungshinweise](#2-processing-instructions)
  * [3. Verarbeitung durch den Anbieter](#3-processing-by-provider)
  * [4. Kundenabwicklung](#4-customer-processing)
  * [5. Einwilligung zur Verarbeitung](#5-consent-to-processing)
  * [6. Unterauftragsverarbeiter](#6-subprocessors)
* [3. Eingeschränkte Übertragungen](#3-restricted-transfers)
  * [1. Autorisierung](#1-authorization)
  * [2. Übertragungen außerhalb des EWR](#2-ex-eea-transfers)
  * [3. Überweisungen außerhalb des Vereinigten Königreichs](#3-ex-uk-transfers)
  * [4. Andere internationale Übermittlungen](#4-other-international-transfers)
* [4. Reaktion auf Sicherheitsvorfälle](#4-security-incident-response)
* [5. Audit & Berichte](#5-audit--reports)
  * [1. Prüfungsrechte](#1-audit-rights)
  * [2. Sicherheitsberichte](#2-security-reports)
  * [3. Sicherheitsprüfung](#3-security-due-diligence)
* [6. Koordination und Zusammenarbeit](#6-coordination--cooperation)
  * [1. Beantwortung von Anfragen](#1-response-to-inquiries)
  * [2. Datenschutz-Folgenabschätzungen und Datenschutz-Folgenabschätzungen](#2-dpias-and-dtias)
* [7. Löschung personenbezogener Kundendaten](#7-deletion-of-customer-personal-data)
  * [1. Löschung durch den Kunden](#1-deletion-by-customer)
  * [2. Löschung bei Ablauf des DPA](#2-deletion-at-dpa-expiration)
* [8. Haftungsbeschränkung](#8-limitation-of-liability)
  * [1. Haftungsbegrenzungen und Schadensersatzverzicht](#1-liability-caps-and-damages-waiver)
  * [2. Ansprüche verbundener Unternehmen](#2-related-party-claims)
  * [3. Ausnahmen](#3-exceptions)
* [9. Konflikte zwischen Dokumenten](#9-conflicts-between-documents)
* [10. Vertragsdauer](#10-term-of-agreement)
* [11. Geltendes Recht und Gerichtsstand](#11-governing-law-and-chosen-courts)
* [12. Verhältnis zum Dienstanbieter](#12-service-provider-relationship)
* [13. Definitionen](#13-definitions)
* [Credits](#credits)

## Schlüsselbegriffe {#key-terms}

| Begriff | Wert |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Vereinbarung</strong> | Diese DPA ergänzt die [Terms of Service](/terms) |
| <strong>Genehmigte Unterauftragsverarbeiter</strong> | [Cloudflare](https://cloudflare.com) (USA; DNS-, Netzwerk- und Sicherheitsanbieter), [DataPacket](https://www.datapacket.com/) (USA/UK; Hosting-Anbieter), [Digital Ocean](https://digitalocean.com) (USA; Hosting-Anbieter), [Vultr](https://www.vultr.com) (USA; Hosting-Anbieter), [Stripe](https://stripe.com) (USA; Zahlungsabwickler), [PayPal](https://paypal.com) (USA; Zahlungsabwickler) |
| <strong>Sicherheitskontakt des Anbieters</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>Sicherheitsrichtlinie</strong> | [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) anzeigen |
| <strong>Regierender Staat</strong> | Der Staat Delaware, USA |

## Änderungen an der Vereinbarung {#changes-to-the-agreement}

Dieses Dokument ist eine Ableitung von [Gemeinsame Standardbedingungen für das DPA-Papier (Version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) und es wurden die folgenden Änderungen vorgenommen:

1. [Geltendes Recht und Gerichtsstand](#11-governing-law-and-chosen-courts) wurde unten als Abschnitt mit dem oben genannten `Governing State` eingefügt.
2. [Dienstanbieterbeziehung](#12-service-provider-relationship) wurde unten als Abschnitt eingefügt.

## 1. Prozessor- und Subprozessorbeziehungen {#1-processor-and-subprocessor-relationships}

### 1. Anbieter als Verarbeiter {#1-provider-as-processor}

In Situationen, in denen der <strong>Kunde</strong> ein Verantwortlicher für die personenbezogenen Daten des Kunden ist, wird der <strong>Anbieter</strong> als Verarbeiter betrachtet, der personenbezogene Daten im Auftrag des <strong>Kunden</strong> verarbeitet.

### 2. Anbieter als Unterauftragsverarbeiter {#2-provider-as-subprocessor}

In Situationen, in denen der <strong>Kunde</strong> ein Verarbeiter der personenbezogenen Daten des Kunden ist, wird der <strong>Anbieter</strong> als Unterverarbeiter der personenbezogenen Daten des Kunden betrachtet.

## 2. Verarbeitung {#2-processing}

### 1. Verarbeitungsdetails {#1-processing-details}

Anhang I(B) auf dem Deckblatt beschreibt Gegenstand, Art, Zweck und Dauer dieser Verarbeitung sowie die <strong>Kategorien der erfassten personenbezogenen Daten</strong> und die <strong>Kategorien der betroffenen Personen</strong>.

### 2. Verarbeitungsanweisungen {#2-processing-instructions}

Der <strong>Kunde</strong> weist den <strong>Anbieter</strong> an, personenbezogene Daten des Kunden zu verarbeiten: (a) um den Dienst bereitzustellen und aufrechtzuerhalten; (b) wie durch die Nutzung des Dienstes durch den <strong>Kunden</strong> näher spezifiziert; (c) wie in der <strong>Vereinbarung</strong> dokumentiert; und (d) wie in anderen schriftlichen Anweisungen des <strong>Kunden</strong> dokumentiert, die vom <strong>Anbieter</strong> zur Verarbeitung personenbezogener Daten des Kunden im Rahmen dieser DPA erteilt und bestätigt wurden. Der <strong>Anbieter</strong> wird diese Anweisungen befolgen, sofern ihm dies nicht durch geltende Gesetze untersagt ist. Der <strong>Anbieter</strong> wird den <strong>Kunden</strong> unverzüglich informieren, falls er den Verarbeitungsanweisungen nicht folgen kann. Der <strong>Kunde</strong> hat nur Anweisungen erteilt und wird dies auch weiterhin tun, wenn diese den geltenden Gesetzen entsprechen.

### 3. Verarbeitung durch Anbieter {#3-processing-by-provider}

Der <strong>Anbieter</strong> verarbeitet personenbezogene Daten des Kunden nur in Übereinstimmung mit dieser Datenverarbeitungsvereinbarung, einschließlich der Details auf dem Deckblatt. Wenn der <strong>Anbieter</strong> den Dienst aktualisiert, um bestehende Produkte, Features oder Funktionen zu aktualisieren oder neue hinzuzufügen, kann der <strong>Anbieter</strong> die <strong>Kategorien betroffener Personen</strong>, die <strong>Kategorien personenbezogener Daten</strong>, die <strong>Daten besonderer Kategorien</strong>, die <strong>Einschränkungen oder Schutzmaßnahmen für Daten besonderer Kategorien</strong>, die <strong>Häufigkeit der Übertragung</strong>, die <strong>Art und den Zweck der Verarbeitung</strong> und die <strong>Dauer der Verarbeitung</strong> nach Bedarf ändern, um die Aktualisierungen widerzuspiegeln, indem er den <strong>Kunden</strong> über die Aktualisierungen und Änderungen informiert.

### 4. Kundenabwicklung {#4-customer-processing}

Ist der Kunde Auftragsverarbeiter und der Anbieter Unterauftragsverarbeiter, verpflichtet sich der Kunde zur Einhaltung aller geltenden Gesetze, die für die Verarbeitung personenbezogener Daten des Kunden gelten. Die Vereinbarung mit dem Verantwortlichen verpflichtet den Kunden ebenfalls zur Einhaltung aller geltenden Gesetze als Auftragsverarbeiter. Darüber hinaus verpflichtet sich der Kunde zur Einhaltung der Anforderungen an Unterauftragsverarbeiter in der Vereinbarung mit dem Verantwortlichen.

### 5. Einwilligung zur Verarbeitung {#5-consent-to-processing}

Der <strong>Kunde</strong> hat alle geltenden Datenschutzgesetze hinsichtlich der Bereitstellung personenbezogener Kundendaten an den <strong>Anbieter</strong> und/oder den Dienst eingehalten und wird dies auch weiterhin tun. Dies umfasst die Vornahme aller Offenlegungen, die Einholung aller Einwilligungen, die Bereitstellung angemessener Auswahlmöglichkeiten und die Umsetzung der gemäß den geltenden Datenschutzgesetzen erforderlichen Sicherheitsvorkehrungen.

### 6. Unterprozessoren {#6-subprocessors}

a. Der <strong>Anbieter</strong> stellt keine personenbezogenen Daten des Kunden einem Unterauftragsverarbeiter zur Verfügung, überträgt sie oder händigt sie diesem aus, es sei denn, der <strong>Kunde</strong> hat den Unterauftragsverarbeiter genehmigt. Die aktuelle Liste der <strong>Genehmigten Unterauftragsverarbeiter</strong> enthält die Identität der Unterauftragsverarbeiter, ihr Sitzland und ihre voraussichtlichen Verarbeitungsaufgaben. Der <strong>Anbieter</strong> informiert den <strong>Kunden</strong> mindestens 10 Werktage im Voraus schriftlich über geplante Änderungen der <strong>Genehmigten Unterauftragsverarbeiter</strong>, sei es durch Hinzufügung oder Austausch eines Unterauftragsverarbeiters, sodass dem <strong>Kunden</strong> genügend Zeit bleibt, Einspruch gegen die Änderungen zu erheben, bevor der <strong>Anbieter</strong> den/die neuen Unterauftragsverarbeiter einsetzt. Der <strong>Anbieter</strong> stellt dem <strong>Kunden</strong> die erforderlichen Informationen zur Verfügung, damit der <strong>Kunde</strong> sein Widerspruchsrecht gegen die Änderung der <strong>Genehmigten Unterauftragsverarbeiter</strong> ausüben kann. Der Kunde hat nach Bekanntgabe einer Änderung der <strong>genehmigten Unterauftragsverarbeiter</strong> 30 Tage Zeit, Einspruch zu erheben. Andernfalls gelten die Änderungen als vom Kunden akzeptiert. Erhebt der Kunde innerhalb von 30 Tagen nach Bekanntgabe Einspruch, arbeiten Kunde und Anbieter nach Treu und Glauben zusammen, um den Einspruch oder die Bedenken des Kunden zu klären.

b. Bei der Beauftragung eines Unterauftragsverarbeiters schließt der <strong>Anbieter</strong> mit dem Unterauftragsverarbeiter eine schriftliche Vereinbarung ab, die sicherstellt, dass der Unterauftragsverarbeiter auf personenbezogene Daten des Kunden nur zugreift und diese verwendet, (i) soweit dies zur Erfüllung der ihm übertragenen Verpflichtungen erforderlich ist, und (ii) im Einklang mit den Bedingungen der <strong>Vereinbarung</strong>.

c. Wenn die DSGVO auf die Verarbeitung personenbezogener Kundendaten Anwendung findet, (i) gelten die in dieser Datenverarbeitungsvereinbarung beschriebenen Datenschutzpflichten (wie in Artikel 28(3) der DSGVO, falls anwendbar) auch für den Unterauftragsverarbeiter und (ii) wird die Vereinbarung zwischen dem <strong>Anbieter</strong> und dem Unterauftragsverarbeiter diese Pflichten beinhalten, einschließlich Einzelheiten darüber, wie sich der <strong>Anbieter</strong> und sein Unterauftragsverarbeiter abstimmen, um auf Anfragen oder Anforderungen bezüglich der Verarbeitung personenbezogener Kundendaten zu reagieren. Darüber hinaus wird der <strong>Anbieter</strong> auf Anfrage des <strong>Kunden</strong> eine Kopie seiner Vereinbarungen (einschließlich aller Änderungen) mit seinen Unterauftragsverarbeitern teilen. Soweit dies zum Schutz von Geschäftsgeheimnissen oder sonstigen vertraulichen Informationen, einschließlich personenbezogener Daten, erforderlich ist, kann der <strong>Anbieter</strong> den Text seiner Vereinbarung mit seinem Unterauftragsverarbeiter redigieren, bevor er eine Kopie weitergibt.

d. Der <strong>Anbieter</strong> bleibt voll haftbar für alle an seine Unterauftragsverarbeiter übertragenen Verpflichtungen, einschließlich der Handlungen und Unterlassungen seiner Unterauftragsverarbeiter bei der Verarbeitung personenbezogener Kundendaten. Der <strong>Anbieter</strong> wird den Kunden über jegliche Nichterfüllung wesentlicher Verpflichtungen seiner Unterauftragsverarbeiter in Bezug auf personenbezogene Kundendaten gemäß der Vereinbarung zwischen dem <strong>Anbieter</strong> und dem Unterauftragsverarbeiter informieren.

## 3. Eingeschränkte Übertragungen {#3-restricted-transfers}

### 1. Autorisierung {#1-authorization}

Der <strong>Kunde</strong> erklärt sich damit einverstanden, dass der <strong>Anbieter</strong> personenbezogene Daten des Kunden außerhalb des EWR, des Vereinigten Königreichs oder anderer relevanter geografischer Gebiete übermitteln darf, soweit dies zur Bereitstellung des Dienstes erforderlich ist. Überträgt der <strong>Anbieter</strong> personenbezogene Daten des Kunden in ein Gebiet, für das die Europäische Kommission oder eine andere relevante Aufsichtsbehörde keinen Angemessenheitsbeschluss erlassen hat, wird der <strong>Anbieter</strong> angemessene Sicherheitsvorkehrungen für die Übermittlung personenbezogener Daten des Kunden in dieses Gebiet im Einklang mit den geltenden Datenschutzgesetzen treffen.

### 2. Überweisungen außerhalb des EWR {#2-ex-eea-transfers}

<strong>Kunde</strong> und <strong>Anbieter</strong> vereinbaren, dass, sofern die DSGVO die Übermittlung personenbezogener Kundendaten schützt, die Übermittlung vom <strong>Kunden</strong> innerhalb des EWR an den <strong>Anbieter</strong> außerhalb des EWR erfolgt und die Übermittlung keinem Angemessenheitsbeschluss der Europäischen Kommission unterliegt, mit dem Abschluss dieser Datenverarbeitungsvereinbarung (DPA) die EWR-Standardvertragsklauseln und deren Anhänge als unterzeichnet gelten, die durch Verweis einbezogen werden. Jede derartige Übermittlung erfolgt gemäß den EWR-Standardvertragsklauseln, die wie folgt ausgefüllt werden:

a. Modul Zwei (Verantwortlicher gegenüber Auftragsverarbeiter) der EWR-Standardvertragsklauseln gilt, wenn der <strong>Kunde</strong> Verantwortlicher ist und der <strong>Anbieter</strong> als Auftragsverarbeiter personenbezogene Daten des Kunden für den <strong>Kunden</strong> verarbeitet.

b. Modul Drei (Auftragsverarbeiter an Unterauftragsverarbeiter) der EWR-Standardvertragsklauseln gilt, wenn der <strong>Kunde</strong> ein Auftragsverarbeiter ist und der <strong>Anbieter</strong> personenbezogene Daten des Kunden im Auftrag des <strong>Kunden</strong> als Unterauftragsverarbeiter verarbeitet.

c. Für jedes Modul gilt (sofern zutreffend):

1. Die optionale Andockklausel in Klausel 7 findet keine Anwendung;

2. In Klausel 9 gilt Option 2 (allgemeine schriftliche Genehmigung) und die Mindestfrist für die Vorankündigung von Änderungen beim Unterauftragsverarbeiter beträgt 10 Werktage;

3. In Klausel 11 findet die optionale Formulierung keine Anwendung;

4. Alle eckigen Klammern in Abschnitt 13 werden entfernt;

5. In Klausel 17 (Option 1) unterliegen die Standardvertragsklauseln des EWR den Gesetzen des <strong>maßgebenden Mitgliedstaats</strong>.

6. In Klausel 18(b) werden Streitigkeiten vor den Gerichten des <strong>Regierungsmitgliedstaats</strong> beigelegt; und

7. Das Deckblatt dieser DPA enthält die in Anhang I, Anhang II und Anhang III der EWR-Standardvertragsklauseln geforderten Informationen.

### 3. Überweisungen außerhalb des Vereinigten Königreichs {#3-ex-uk-transfers}

<strong>Kunde</strong> und <strong>Anbieter</strong> vereinbaren, dass, sofern die UK-DSGVO die Übertragung personenbezogener Kundendaten schützt, die Übertragung vom <strong>Kunden</strong> innerhalb des Vereinigten Königreichs an den <strong>Anbieter</strong> außerhalb des Vereinigten Königreichs erfolgt und die Übertragung nicht durch einen Angemessenheitsbeschluss des britischen Außenministers geregelt ist, mit dem Abschluss dieser DPA der UK-Nachtrag und seine Anhänge als unterzeichnet gelten, die durch Bezugnahme Bestandteil dieser Vereinbarung werden. Jede derartige Übertragung erfolgt gemäß dem UK-Nachtrag, der wie folgt ausgefüllt wird:

a. Abschnitt 3.2 dieser DPA enthält die in Tabelle 2 des UK-Nachtrags erforderlichen Informationen.

b. Tabelle 4 des UK-Nachtrags wird wie folgt geändert: Keine der Parteien darf den UK-Nachtrag gemäß Abschnitt 19 des UK-Nachtrags beenden. Sofern das ICO einen überarbeiteten genehmigten Nachtrag gemäß Abschnitt 18 des UK-Nachtrags herausgibt, werden die Parteien nach Treu und Glauben daran arbeiten, diese DPA entsprechend zu überarbeiten.

c. Das Deckblatt enthält die in Anhang 1A, Anhang 1B, Anhang II und Anhang III des UK-Nachtrags geforderten Informationen.

### 4. Andere internationale Überweisungen {#4-other-international-transfers}

Bei der Übermittlung personenbezogener Daten, bei der aufgrund des internationalen Charakters der Übermittlung Schweizer Recht (und nicht das Recht eines EWR-Mitgliedstaats oder des Vereinigten Königreichs) gilt, werden die Verweise auf die DSGVO in Klausel 4 der Standardvertragsklauseln für den EWR, soweit gesetzlich erforderlich, dahingehend geändert, dass sie stattdessen auf das Schweizer Bundesgesetz über den Datenschutz oder dessen Nachfolgegesetz verweisen. Der Begriff der Aufsichtsbehörde umfasst dann den Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten.

## 4. Reaktion auf Sicherheitsvorfälle {#4-security-incident-response}

1. Sobald der <strong>Anbieter</strong> von einem Sicherheitsvorfall Kenntnis erlangt, wird er: (a) den <strong>Kunden</strong> nach Möglichkeit unverzüglich, spätestens jedoch 72 Stunden nach Kenntniserlangung des Sicherheitsvorfalls, benachrichtigen; (b) zeitnah Informationen über den Sicherheitsvorfall bereitstellen, sobald dieser bekannt wird oder auf begründete Anfrage des <strong>Kunden</strong>; und (c) umgehend angemessene Schritte unternehmen, um den Sicherheitsvorfall einzudämmen und zu untersuchen. Die Benachrichtigung oder Reaktion des <strong>Anbieters</strong> über einen Sicherheitsvorfall gemäß dieser DPA gilt nicht als Eingeständnis eines Verschuldens oder einer Haftung des <strong>Anbieters</strong> für den Sicherheitsvorfall.

## 5. Audit und Berichte {#5-audit--reports}

### 1. Prüfrechte {#1-audit-rights}

Der <strong>Anbieter</strong> stellt dem <strong>Kunden</strong> alle Informationen zur Verfügung, die zum Nachweis seiner Einhaltung dieser DPA erforderlich sind, und der <strong>Anbieter</strong> ermöglicht und unterstützt Audits, darunter Inspektionen durch den <strong>Kunden</strong>, um die Einhaltung dieser DPA durch den <strong>Anbieter</strong> zu beurteilen. Der <strong>Anbieter</strong> darf jedoch den Zugriff auf Daten oder Informationen einschränken, wenn der Zugriff des <strong>Kunden</strong> auf die Informationen die geistigen Eigentumsrechte, Vertraulichkeitsverpflichtungen oder andere Verpflichtungen des <strong>Anbieters</strong> gemäß geltendem Recht beeinträchtigen würde. Der <strong>Kunde</strong> erkennt an und erklärt sich damit einverstanden, dass er seine Auditrechte gemäß dieser DPA und alle ihm durch geltendes Datenschutzrecht gewährten Auditrechte nur dann ausübt, wenn er den <strong>Anbieter</strong> anweist, die unten aufgeführten Berichts- und Sorgfaltspflichten zu erfüllen. Der <strong>Anbieter</strong> führt Aufzeichnungen über seine Einhaltung dieser DPA für drei Jahre nach Ende der DPA.

### 2. Sicherheitsberichte {#2-security-reports}

Der Kunde nimmt zur Kenntnis, dass der Anbieter regelmäßig von unabhängigen Prüfern auf die Einhaltung der in der Sicherheitsrichtlinie festgelegten Standards geprüft wird. Auf schriftliche Anfrage stellt der Anbieter dem Kunden vertraulich eine Zusammenfassung seines jeweils aktuellen Berichts zur Verfügung, damit dieser die Einhaltung der in der Sicherheitsrichtlinie festgelegten Standards durch den Anbieter überprüfen kann.

### 3. Sicherheitsprüfung {#3-security-due-diligence}

Zusätzlich zum Bericht beantwortet der <strong>Anbieter</strong> angemessene Informationsanfragen des <strong>Kunden</strong>, um die Einhaltung dieser DPA durch den <strong>Anbieter</strong> zu bestätigen. Dies umfasst Antworten auf Informationssicherheits-, Due-Diligence- und Audit-Fragebögen oder die Bereitstellung zusätzlicher Informationen zu seinem Informationssicherheitsprogramm. Alle derartigen Anfragen müssen schriftlich erfolgen und an den <strong>Sicherheitskontakt des Anbieters</strong> gerichtet werden und dürfen nur einmal jährlich gestellt werden.

## 6. Koordination und Zusammenarbeit {#6-coordination--cooperation}

### 1. Antwort auf Anfragen {#1-response-to-inquiries}

Erhält der <strong>Anbieter</strong> eine Anfrage oder Aufforderung zur Verarbeitung personenbezogener Kundendaten, benachrichtigt er den <strong>Anbieter</strong> hierüber und beantwortet diese nicht ohne dessen vorherige Zustimmung. Beispiele hierfür sind gerichtliche, behördliche oder behördliche Anordnungen zu personenbezogenen Kundendaten, sofern die Benachrichtigung des <strong>Kunden</strong> nicht durch geltendes Recht untersagt ist, oder Anfragen von betroffenen Personen. Soweit gesetzlich zulässig, befolgt der <strong>Anbieter</strong> die angemessenen Anweisungen des <strong>Kunden</strong> zu diesen Anfragen, einschließlich der Bereitstellung von Statusaktualisierungen und anderen vom <strong>Kunden</strong> in angemessener Weise angeforderten Informationen. Wenn eine betroffene Person gemäß den geltenden Datenschutzgesetzen eine gültige Anfrage zur Löschung oder zum Widerspruch gegen die Weitergabe personenbezogener Kundendaten an den <strong>Anbieter</strong> stellt, unterstützt der <strong>Anbieter</strong> den <strong>Kunden</strong> bei der Erfüllung der Anfrage gemäß den geltenden Datenschutzgesetzen. Der <strong>Anbieter</strong> kooperiert mit dem <strong>Kunden</strong> und bietet ihm auf Kosten des <strong>Kunden</strong> angemessene Unterstützung bei allen rechtlichen Antworten oder anderen Verfahrensschritten, die der <strong>Kunde</strong> als Reaktion auf eine Anfrage eines Dritten bezüglich der Verarbeitung personenbezogener Kundendaten durch den <strong>Anbieter</strong> gemäß dieser DPA unternimmt.

### 2. DPIAs und DTIAs {#2-dpias-and-dtias}

Falls gemäß den geltenden Datenschutzgesetzen erforderlich, wird der <strong>Anbieter</strong> den <strong>Kunden</strong> in angemessenem Umfang bei der Durchführung aller vorgeschriebenen Datenschutz-Folgenabschätzungen oder Datenübertragungs-Folgenabschätzungen sowie bei Konsultationen mit den zuständigen Datenschutzbehörden unterstützen und dabei die Art der Verarbeitung und der personenbezogenen Daten des Kunden berücksichtigen.

## 7. Löschung personenbezogener Kundendaten {#7-deletion-of-customer-personal-data}

### 1. Löschung durch den Kunden {#1-deletion-by-customer}

Der <strong>Anbieter</strong> ermöglicht dem <strong>Kunden</strong>, personenbezogene Kundendaten in einer Weise zu löschen, die mit der Funktionalität der Dienste vereinbar ist. Der <strong>Anbieter</strong> wird dieser Anweisung so schnell wie möglich nachkommen, es sei denn, eine weitere Speicherung personenbezogener Kundendaten ist gesetzlich vorgeschrieben.

### 2. Löschung bei Ablauf des DPA {#2-deletion-at-dpa-expiration}

a. Nach Ablauf der DPA wird der <strong>Anbieter</strong> die personenbezogenen Kundendaten auf Anweisung des <strong>Kunden</strong> zurückgeben oder löschen, es sei denn, eine weitere Speicherung der personenbezogenen Kundendaten ist gesetzlich vorgeschrieben oder zulässig. Ist die Rückgabe oder Vernichtung nicht durchführbar oder gesetzlich verboten, wird der <strong>Anbieter</strong> angemessene Anstrengungen unternehmen, um eine weitere Verarbeitung der personenbezogenen Kundendaten zu verhindern und die in seinem Besitz, seiner Obhut oder seiner Kontrolle verbleibenden personenbezogenen Kundendaten weiterhin zu schützen. Beispielsweise kann der <strong>Anbieter</strong> gesetzlich verpflichtet sein, die personenbezogenen Kundendaten weiterhin zu hosten oder zu verarbeiten.

b. Wenn <strong>Kunde</strong> und <strong>Anbieter</strong> im Rahmen dieser DPA die EWR-Standardvertragsklauseln oder den UK-Nachtrag abgeschlossen haben, stellt <strong>Anbieter</strong> dem <strong>Kunden</strong> die in Klausel 8.1(d) und Klausel 8.5 der EWR-Standardvertragsklauseln beschriebene Bescheinigung über die Löschung der personenbezogenen Daten nur dann aus, wenn <strong>Kunde</strong> danach fragt.

## 8. Haftungsbeschränkung {#8-limitation-of-liability}

### 1. Haftungsbegrenzungen und Schadensersatzverzicht {#1-liability-caps-and-damages-waiver}

**Soweit es die geltenden Datenschutzgesetze zulassen, unterliegt die gesamte kumulative Haftung jeder Partei gegenüber der anderen Partei, die sich aus dieser DPA ergibt oder damit in Zusammenhang steht, den in der <strong>Vereinbarung</strong> genannten Haftungsverzichten, -ausschlüssen und -beschränkungen.**

### 2. Ansprüche verbundener Unternehmen {#2-related-party-claims}

**Alle Ansprüche, die gegen den <strong>Anbieter</strong> oder seine verbundenen Unternehmen geltend gemacht werden und die sich aus dieser DPA ergeben oder damit in Zusammenhang stehen, können nur von der <strong>Kunden</strong>-Einheit geltend gemacht werden, die Vertragspartei der <strong>Vereinbarung</strong> ist.**

### 3. Ausnahmen {#3-exceptions}

1. Diese DPA beschränkt nicht die Haftung gegenüber einer Person hinsichtlich ihrer Datenschutzrechte gemäß den geltenden Datenschutzgesetzen. Darüber hinaus beschränkt diese DPA nicht die Haftung zwischen den Parteien für Verstöße gegen die EWR-Standardvertragsklauseln oder den UK-Nachtrag.

## 9. Konflikte zwischen Dokumenten {#9-conflicts-between-documents}

1. Diese DPA ist Bestandteil der Vereinbarung und ergänzt diese. Bei Widersprüchen zwischen dieser DPA, der <strong>Vereinbarung</strong> oder deren Teilen hat der zuvor genannte Teil Vorrang vor dem später genannten Teil: (1) die EWR-Standardvertragsklauseln oder der UK-Nachtrag, (2) diese DPA und (3) die <strong>Vereinbarung</strong>.

## 10. Vertragsdauer {#10-term-of-agreement}

Diese DPA beginnt, sobald <strong>Anbieter</strong> und <strong>Kunde</strong> einem Deckblatt für die DPA zustimmen und die <strong>Vereinbarung</strong> unterzeichnen oder elektronisch akzeptieren. Sie gilt bis zum Ablauf oder der Kündigung der <strong>Vereinbarung</strong>. <strong>Anbieter</strong> und <strong>Kunde</strong> unterliegen jedoch weiterhin den Verpflichtungen dieser DPA und den geltenden Datenschutzgesetzen, bis <strong>Kunde</strong> die Übermittlung personenbezogener Kundendaten an <strong>Anbieter</strong> einstellt und <strong>Anbieter</strong> die Verarbeitung personenbezogener Kundendaten einstellt.

## 11. Geltendes Recht und Gerichtsstand {#11-governing-law-and-chosen-courts}

Ungeachtet des geltenden Rechts oder ähnlicher Klauseln dieser <strong>Vereinbarung</strong> unterliegen sämtliche Auslegungen und Streitigkeiten im Zusammenhang mit dieser DPA den Gesetzen des <strong>Staates</strong>, unter Ausschluss der Kollisionsnormen. Darüber hinaus vereinbaren die Parteien ungeachtet der Gerichtsstandsvereinbarung, der Zuständigkeit oder ähnlicher Klauseln dieser <strong>Vereinbarung</strong>, sämtliche Rechtsstreitigkeiten, Klagen oder Verfahren im Zusammenhang mit dieser DPA vor den Gerichten des <strong>Staates</strong> zu führen, und jede Partei unterwirft sich unwiderruflich der ausschließlichen Zuständigkeit dieser Gerichte.

## 12. Dienstanbieterbeziehung {#12-service-provider-relationship}

Soweit der California Consumer Privacy Act, Cal. Civ. Code § 1798.100 ff. („CCPA“) Anwendung findet, erkennen die Parteien an und vereinbaren, dass der <strong>Anbieter</strong> ein Dienstanbieter ist und personenbezogene Daten vom <strong>Kunden</strong> erhält, um den Dienst wie in der <strong>Vereinbarung</strong> vereinbart bereitzustellen, was einen Geschäftszweck darstellt. Der <strong>Anbieter</strong> wird keine vom <strong>Kunden</strong> im Rahmen der <strong>Vereinbarung</strong> bereitgestellten personenbezogenen Daten verkaufen. Darüber hinaus wird der <strong>Anbieter</strong> keine vom <strong>Kunden</strong> im Rahmen der <strong>Vereinbarung</strong> bereitgestellten personenbezogenen Daten aufbewahren, verwenden oder offenlegen, außer wenn dies zur Bereitstellung des Dienstes für den <strong>Kunden</strong> erforderlich ist, wie in der <strong>Vereinbarung</strong> angegeben, oder wie nach geltendem Datenschutzrecht zulässig. Der <strong>Anbieter</strong> bestätigt, dass er die Beschränkungen dieses Absatzes versteht.

## 13. Definitionen {#13-definitions}

1. **„Geltende Gesetze“** bezeichnet die Gesetze, Regeln, Vorschriften, Gerichtsbeschlüsse und sonstigen verbindlichen Anforderungen einer zuständigen Regierungsbehörde, die für eine Partei gelten oder für sie gelten.

2. **„Geltende Datenschutzgesetze“** bezeichnet die geltenden Gesetze, die regeln, wie der Dienst personenbezogene Informationen, persönliche Daten, persönlich identifizierbare Informationen oder andere ähnliche Begriffe einer Person verarbeiten oder verwenden darf.

3. **„Verantwortlicher“** hat die in den geltenden Datenschutzgesetzen angegebene(n) Bedeutung(en) für das Unternehmen, das den Zweck und den Umfang der Verarbeitung personenbezogener Daten bestimmt.

4. **„Deckblatt“** bezeichnet ein von den Parteien unterzeichnetes oder elektronisch akzeptiertes Dokument, das diese DPA-Standardbedingungen enthält und den <strong>Anbieter</strong>, den <strong>Kunden</strong> sowie den Gegenstand und die Einzelheiten der Datenverarbeitung identifiziert.

5. **„Personenbezogene Daten des Kunden“** sind personenbezogene Daten, die der <strong>Kunde</strong> im Rahmen des Dienstes hochlädt oder dem <strong>Anbieter</strong> bereitstellt und die dieser Datenverarbeitungsvereinbarung unterliegen.

6. **„DPA“** bezeichnet diese DPA-Standardbedingungen, das Deckblatt zwischen <strong>Anbieter</strong> und <strong>Kunden</strong> sowie die Richtlinien und Dokumente, auf die im Deckblatt verwiesen wird oder die diesem beigefügt sind.

7. **„EWR-Standardvertragsklauseln“** bezeichnet die Standardvertragsklauseln im Anhang des Durchführungsbeschlusses 2021/914 der Europäischen Kommission vom 4. Juni 2021 über Standardvertragsklauseln für die Übermittlung personenbezogener Daten in Drittländer gemäß der Verordnung (EU) 2016/679 des Europäischen Parlaments und des Europäischen Rates.

8. **„Europäischer Wirtschaftsraum“** oder **„EWR“** bezeichnet die Mitgliedstaaten der Europäischen Union, Norwegen, Island und Liechtenstein.

9. **„DSGVO“** bezeichnet die Verordnung 2016/679 der Europäischen Union, wie sie in den jeweiligen EWR-Mitgliedsstaaten durch lokales Recht umgesetzt wird.

10. **„Personenbezogene Daten“** haben die Bedeutung(en), die in den geltenden Datenschutzgesetzen für persönliche Informationen, personenbezogene Daten oder andere ähnliche Begriffe festgelegt werden.

11. **„Verarbeitung“** oder **„Verarbeiten“** hat/haben die in den geltenden Datenschutzgesetzen angegebene(n) Bedeutung(en) für jede Verwendung oder Durchführung von Computeroperationen mit personenbezogenen Daten, auch mit automatischen Methoden.

12. **„Auftragsverarbeiter“** hat die in den geltenden Datenschutzgesetzen angegebene(n) Bedeutung(en) für das Unternehmen, das personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet.

13. **„Bericht“** bezeichnet Prüfberichte, die von einem anderen Unternehmen gemäß den in der Sicherheitsrichtlinie festgelegten Standards im Auftrag des Anbieters erstellt werden.

14. **„Eingeschränkte Übermittlung“** bedeutet (a) sofern die DSGVO gilt, eine Übermittlung personenbezogener Daten aus dem EWR in ein Land außerhalb des EWR, das keiner Angemessenheitsfeststellung der Europäischen Kommission unterliegt; und (b) sofern die UK-DSGVO gilt, eine Übermittlung personenbezogener Daten aus dem Vereinigten Königreich in ein anderes Land, das nicht den gemäß Abschnitt 17A des britischen Datenschutzgesetzes 2018 erlassenen Angemessenheitsbestimmungen unterliegt.

15. **„Sicherheitsvorfall“** bezeichnet eine Verletzung des Schutzes personenbezogener Daten gemäß der Definition in Artikel 4 der DSGVO.

16. **„Dienstleistung“** bezeichnet das in der <strong>Vereinbarung</strong> beschriebene Produkt und/oder die beschriebenen Dienstleistungen.

17. **„Daten besonderer Kategorien“** haben die in Artikel 9 der DSGVO angegebene Bedeutung.

18. **„Unterauftragsverarbeiter“** hat die in den geltenden Datenschutzgesetzen angegebene(n) Bedeutung(en) für ein Unternehmen, das mit Genehmigung und Zustimmung des Verantwortlichen den Auftragsverarbeiter bei der Verarbeitung personenbezogener Daten im Auftrag des Verantwortlichen unterstützt.

19. **„UK GDPR“** bezeichnet die Verordnung 2016/679 der Europäischen Union, wie sie im Vereinigten Königreich durch Abschnitt 3 des European Union (Withdrawal) Act des Vereinigten Königreichs von 2018 umgesetzt wird.

20. **„UK-Nachtrag“** bezeichnet den Nachtrag zum internationalen Datentransfer zu den Standardvertragsklauseln des EWR, der vom Information Commissioner für Parteien herausgegeben wird, die eingeschränkte Transfers gemäß S119A(1) Data Protection Act 2018 vornehmen.

## Guthaben {#credits}

Dieses Dokument ist eine Ableitung von [Gemeinsame Standardbedingungen für das DPA-Papier (Version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) und ist unter [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) lizenziert.