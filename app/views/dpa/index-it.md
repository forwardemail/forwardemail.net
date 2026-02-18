# Accordo sul trattamento dei dati {#data-processing-agreement}

<!-- v1.0 da <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" classe="arrotondato-lg" />

## Indice {#table-of-contents}

* [Termini chiave](#key-terms)
* [Modifiche all'accordo](#changes-to-the-agreement)
* [1. Rapporti tra responsabile del trattamento e sub-responsabile del trattamento](#1-processor-and-subprocessor-relationships)
  * [1. Fornitore come Responsabile del Trattamento](#1-provider-as-processor)
  * [2. Fornitore come sub-responsabile](#2-provider-as-subprocessor)
* [2. Elaborazione](#2-processing)
  * [1. Dettagli di elaborazione](#1-processing-details)
  * [2. Istruzioni per l'elaborazione](#2-processing-instructions)
  * [3. Elaborazione da parte del Fornitore](#3-processing-by-provider)
  * [4. Elaborazione dei dati del cliente](#4-customer-processing)
  * [5. Consenso al trattamento](#5-consent-to-processing)
  * [6. Sub-responsabili del trattamento](#6-subprocessors)
* [3. Trasferimenti limitati](#3-restricted-transfers)
  * [1. Autorizzazione](#1-authorization)
  * [2. Trasferimenti ex-SEE](#2-ex-eea-transfers)
  * [3. Trasferimenti ex-Regno Unito](#3-ex-uk-transfers)
  * [4. Altri trasferimenti internazionali](#4-other-international-transfers)
* [4. Risposta agli incidenti di sicurezza](#4-security-incident-response)
* [5. Audit e relazioni](#5-audit--reports)
  * [1. Diritti di revisione](#1-audit-rights)
  * [2. Rapporti sulla sicurezza](#2-security-reports)
  * [3. Due diligence sulla sicurezza](#3-security-due-diligence)
* [6. Coordinamento e cooperazione](#6-coordination--cooperation)
  * [1. Risposta alle richieste](#1-response-to-inquiries)
  * [2. DPIA e DTIA](#2-dpias-and-dtias)
* [7. Cancellazione dei dati personali del cliente](#7-deletion-of-customer-personal-data)
  * [1. Cancellazione da parte del cliente](#1-deletion-by-customer)
  * [2. Cancellazione alla scadenza del DPA](#2-deletion-at-dpa-expiration)
* [8. Limitazione di responsabilità](#8-limitation-of-liability)
  * [1. Limiti di responsabilità e rinuncia al risarcimento danni](#1-liability-caps-and-damages-waiver)
  * [2. Reclami tra parti correlate](#2-related-party-claims)
  * [3. Eccezioni](#3-exceptions)
* [9. Conflitti tra documenti](#9-conflicts-between-documents)
* [10. Durata dell'accordo](#10-term-of-agreement)
* [11. Legge applicabile e tribunali prescelti](#11-governing-law-and-chosen-courts)
* [12. Rapporto con il fornitore di servizi](#12-service-provider-relationship)
* [13. Definizioni](#13-definitions)
* [Crediti](#credits)

## Termini chiave {#key-terms}

| Termine | Valore |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Accordo</strong> | Il presente DPA integra il [Terms of Service](/terms) |
| <strong>Subprocessori Approvati</strong> | [Cloudflare](https://cloudflare.com) (Stati Uniti; fornitore di DNS, reti e sicurezza), [DataPacket](https://www.datapacket.com/) (Stati Uniti/Regno Unito; fornitore di hosting), [Digital Ocean](https://digitalocean.com) (Stati Uniti; fornitore di hosting), [GitHub](https://github.com) (US; source code hosting, CI/CD, and project management), [Vultr](https://www.vultr.com) (Stati Uniti; fornitore di hosting), [Stripe](https://stripe.com) (Stati Uniti; processore di pagamento), [PayPal](https://paypal.com) (Stati Uniti; processore di pagamento) |
| <strong>Contatto per la sicurezza del fornitore</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>Politica di sicurezza</strong> | Visualizza [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| <strong>Stato governante</strong> | Lo Stato del Delaware, Stati Uniti |

## Modifiche all'accordo {#changes-to-the-agreement}

Questo documento è un derivato di [Condizioni standard del DPA comune (versione 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) e sono state apportate le seguenti modifiche:

1. [Legge applicabile e tribunali scelti](#11-governing-law-and-chosen-courts) è stato incluso come sezione sottostante, insieme a `Governing State` identificato sopra.
2. [Rapporto con il fornitore di servizi](#12-service-provider-relationship) è stato incluso come sezione sottostante.

## 1. Relazioni tra processore e sub-processore {#1-processor-and-subprocessor-relationships}

### 1. Fornitore come Processore {#1-provider-as-processor}

Nei casi in cui il <strong>Cliente</strong> è titolare del trattamento dei dati personali del cliente, il <strong>Fornitore</strong> sarà considerato un responsabile del trattamento che elabora i dati personali per conto del <strong>Cliente</strong>.

### 2. Fornitore come sub-responsabile {#2-provider-as-subprocessor}

Nei casi in cui il <strong>Cliente</strong> è un Responsabile del trattamento dei dati personali del cliente, il <strong>Fornitore</strong> sarà considerato un Sub-responsabile del trattamento dei dati personali del cliente.

## 2. Elaborazione di {#2-processing}

### 1. Dettagli di elaborazione {#1-processing-details}

L'Allegato I(B) nella pagina di copertina descrive l'oggetto, la natura, lo scopo e la durata del presente Trattamento, nonché le <strong>Categorie di Dati Personali</strong> raccolti e le <strong>Categorie di Interessati</strong>.

### 2. Istruzioni di elaborazione {#2-processing-instructions}

Il Cliente incarica il Fornitore di elaborare i Dati Personali del Cliente: (a) per fornire e mantenere il Servizio; (b) come ulteriormente specificato tramite l'utilizzo del Servizio da parte del Cliente; (c) come documentato nel Contratto; e (d) come documentato in qualsiasi altra istruzione scritta fornita dal Cliente e riconosciuta dal Fornitore in merito all'elaborazione dei Dati Personali del Cliente ai sensi del presente DPA. Il Fornitore si atterrà a tali istruzioni, salvo divieto imposto dalle Leggi Applicabili. Il Fornitore informerà immediatamente il Cliente qualora non fosse in grado di seguire le istruzioni di elaborazione. Il Cliente ha fornito e fornirà solo istruzioni conformi alle Leggi Applicabili.

### 3. Elaborazione da parte del fornitore {#3-processing-by-provider}

Il Fornitore tratterà i Dati Personali del Cliente esclusivamente in conformità con il presente DPA, inclusi i dettagli riportati nella Pagina di Copertina. Qualora il Fornitore aggiorni il Servizio per aggiornare prodotti, caratteristiche o funzionalità esistenti o includerne di nuovi, il Fornitore potrà modificare le Categorie di Interessati, le Categorie di Dati Personali, i Dati di Categoria Speciale, le Limitazioni o Garanzie relative ai Dati di Categoria Speciale, la Frequenza di Trasferimento, la Natura e le Finalità del Trattamento e la Durata del Trattamento, secondo necessità, per riflettere gli aggiornamenti, notificando al Cliente gli aggiornamenti e le modifiche.

### 4. Elaborazione clienti {#4-customer-processing}

Laddove il <strong>Cliente</strong> sia un Responsabile del trattamento e il <strong>Fornitore</strong> un Sub-responsabile del trattamento, il <strong>Cliente</strong> si impegna a rispettare tutte le Leggi applicabili al Trattamento dei Dati Personali da parte del <strong>Cliente</strong>. Analogamente, il contratto del <strong>Cliente</strong> con il suo Titolare del trattamento richiederà al <strong>Cliente</strong> di rispettare tutte le Leggi applicabili al <strong>Cliente</strong> in qualità di Responsabile del trattamento. Inoltre, il <strong>Cliente</strong> si impegna a rispettare i requisiti del Sub-responsabile del trattamento previsti dal contratto del <strong>Cliente</strong> con il suo Titolare del trattamento.

### 5. Consenso al trattamento {#5-consent-to-processing}

Il <strong>Cliente</strong> ha rispettato e continuerà a rispettare tutte le Leggi sulla protezione dei dati applicabili in relazione alla fornitura dei Dati personali del cliente al <strong>Fornitore</strong> e/o al Servizio, comprese tutte le divulgazioni, l'ottenimento di tutti i consensi, la fornitura di una scelta adeguata e l'implementazione delle garanzie pertinenti richieste dalle Leggi sulla protezione dei dati applicabili.

### 6. Sub-responsabili {#6-subprocessors}

a. Il Fornitore non fornirà, trasferirà o consegnerà alcun Dato Personale del Cliente a un Sub-responsabile del trattamento a meno che il Cliente non abbia approvato il Sub-responsabile del trattamento. L'elenco attuale dei Sub-responsabili del trattamento approvati include le identità dei Sub-responsabili del trattamento, il loro Paese di residenza e le attività di Trattamento previste. Il Fornitore informerà il Cliente con almeno 10 giorni lavorativi di anticipo e per iscritto di eventuali modifiche previste ai Sub-responsabili del trattamento approvati, sia mediante l'aggiunta che la sostituzione di un Sub-responsabile del trattamento, consentendo al Cliente di avere tempo sufficiente per opporsi alle modifiche prima che il Fornitore inizi a utilizzare il/i nuovo/i Sub-responsabile/i. Il Fornitore fornirà al Cliente le informazioni necessarie per consentirgli di esercitare il proprio diritto di opposizione alla modifica dei Sub-responsabili del trattamento approvati. Il Cliente ha 30 giorni di tempo dalla notifica di una modifica ai Sub-responsabili Approvati per opporsi, in caso contrario si riterrà che abbia accettato le modifiche. Se il Cliente si oppone alla modifica entro 30 giorni dalla notifica, il Cliente e il Fornitore collaboreranno in buona fede per risolvere l'obiezione o il problema del Cliente.

b. Quando si affida un Sub-responsabile del trattamento, il <strong>Fornitore</strong> dovrà stipulare un accordo scritto con il Sub-responsabile del trattamento che garantisca che il Sub-responsabile del trattamento acceda e utilizzi i Dati personali del Cliente solo (i) nella misura necessaria per adempiere agli obblighi ad esso subappaltati e (ii) in conformità con i termini dell'<strong>Accordo</strong>.

c. Qualora il GDPR si applichi al Trattamento dei Dati Personali del Cliente, (i) gli obblighi di protezione dei dati descritti nel presente DPA (come indicato nell'Articolo 28(3) del GDPR, ove applicabile) sono imposti anche al Sub-responsabile del trattamento e (ii) l'accordo tra il Fornitore e il Sub-responsabile del trattamento includerà tali obblighi, inclusi i dettagli su come il Fornitore e il suo Sub-responsabile si coordineranno per rispondere a richieste o quesiti relativi al Trattamento dei Dati Personali del Cliente. Inoltre, il Fornitore condividerà, su richiesta del Cliente, una copia dei propri accordi (inclusi eventuali emendamenti) con i propri Sub-responsabili del trattamento. Nella misura necessaria a proteggere segreti aziendali o altre informazioni riservate, inclusi i dati personali, il Fornitore può redigere il testo dell'accordo con il proprio Sub-responsabile del trattamento prima di condividerne una copia.

d. Il <strong>Fornitore</strong> rimane pienamente responsabile di tutti gli obblighi subappaltati ai propri Sub-responsabili, inclusi gli atti e le omissioni dei propri Sub-responsabili nel Trattamento dei Dati Personali del Cliente. Il <strong>Fornitore</strong> informerà il Cliente di qualsiasi inadempimento da parte dei propri Sub-responsabili di un obbligo sostanziale relativo ai Dati Personali del Cliente ai sensi dell'accordo tra il <strong>Fornitore</strong> e il Sub-responsabile.

## 3. Trasferimenti limitati {#3-restricted-transfers}

### 1. Autorizzazione {#1-authorization}

Il Cliente accetta che il Fornitore possa trasferire i Dati Personali del Cliente al di fuori del SEE, del Regno Unito o di altri territori geografici pertinenti, se necessario per fornire il Servizio. Qualora il Fornitore trasferisca i Dati Personali del Cliente in un territorio per il quale la Commissione Europea o altra autorità di vigilanza competente non abbia emesso una decisione di adeguatezza, il Fornitore adotterà misure di sicurezza appropriate per il trasferimento dei Dati Personali del Cliente in tale territorio, in conformità con le Leggi Applicabili sulla Protezione dei Dati.

### 2. Trasferimenti ex-SEE {#2-ex-eea-transfers}

Il <strong>Cliente</strong> e il <strong>Fornitore</strong> convengono che, qualora il GDPR protegga il trasferimento dei Dati Personali del Cliente, il trasferimento avvenga dal <strong>Cliente</strong> all'interno del SEE al <strong>Fornitore</strong> al di fuori del SEE e non sia regolato da una decisione di adeguatezza della Commissione Europea, con la sottoscrizione del presente DPA, il <strong>Cliente</strong> e il <strong>Fornitore</strong> si considerano firmatari delle Condizioni Generali di Contratto (SCC) SEE e dei relativi Allegati, che sono incorporati per riferimento. Qualsiasi trasferimento di questo tipo viene effettuato ai sensi delle Condizioni Generali di Contratto (SCC) SEE, che sono completate come segue:

a. Il Modulo 2 (dal Titolare del trattamento al Responsabile del trattamento) delle Condizioni Generali di Contratto SEE si applica quando il <strong>Cliente</strong> è un Titolare del trattamento e il <strong>Fornitore</strong> elabora i Dati personali del Cliente per il <strong>Cliente</strong> in qualità di Responsabile del trattamento.

b. Il Modulo Tre (da Responsabile del trattamento a Sub-Responsabile del trattamento) delle Condizioni Generali di Contratto SEE si applica quando il <strong>Cliente</strong> è un Responsabile del trattamento e il <strong>Fornitore</strong> elabora i Dati personali del Cliente per conto del <strong>Cliente</strong> in qualità di Sub-Responsabile del trattamento.

c. Per ciascun modulo, si applica quanto segue (ove applicabile):

1. La clausola di attracco facoltativo di cui alla clausola 7 non si applica;

2. Nella clausola 9, si applica l'opzione 2 (autorizzazione scritta generale) e il periodo di tempo minimo per la notifica preventiva delle modifiche del sub-responsabile è di 10 giorni lavorativi;

3. Nella clausola 11, la formulazione facoltativa non si applica;

4. Tutte le parentesi quadre nella clausola 13 vengono rimosse;

5. Nella clausola 17 (opzione 1), le clausole contrattuali standard dello SEE saranno disciplinate dalle leggi dello <strong>Stato membro di riferimento</strong>;

6. Nella clausola 18(b), le controversie saranno risolte nei tribunali dello <strong>Stato membro governante</strong>; e

7. La pagina di copertina del presente DPA contiene le informazioni richieste nell'allegato I, nell'allegato II e nell'allegato III delle clausole contrattuali tipo del SEE.

### 3. Trasferimenti ex-Regno Unito {#3-ex-uk-transfers}

Il <strong>Cliente</strong> e il <strong>Fornitore</strong> convengono che, qualora il GDPR del Regno Unito protegga il trasferimento dei Dati Personali del Cliente, il trasferimento avvenga dal <strong>Cliente</strong> all'interno del Regno Unito al <strong>Fornitore</strong> al di fuori del Regno Unito e non sia regolato da una decisione di adeguatezza adottata dal Segretario di Stato del Regno Unito, allora, sottoscrivendo il presente DPA, il <strong>Cliente</strong> e il <strong>Fornitore</strong> si considerano firmatari dell'Addendum del Regno Unito e dei relativi Allegati, che sono incorporati per riferimento. Qualsiasi trasferimento di questo tipo viene effettuato ai sensi dell'Addendum del Regno Unito, che viene completato come segue:

a. La Sezione 3.2 del presente DPA contiene le informazioni richieste nella Tabella 2 dell'Addendum del Regno Unito.

b. La Tabella 4 dell'Addendum del Regno Unito è modificata come segue: Nessuna delle parti può porre fine all'Addendum del Regno Unito come stabilito nella Sezione 19 dell'Addendum del Regno Unito; nella misura in cui l'ICO emette un Addendum approvato rivisto ai sensi della Sezione 18 dell'Addendum del Regno Unito, le parti lavoreranno in buona fede per rivedere di conseguenza il presente DPA.

c. La pagina di copertina contiene le informazioni richieste dall'Allegato 1A, dall'Allegato 1B, dall'Allegato II e dall'Allegato III dell'Addendum del Regno Unito.

### 4. Altri trasferimenti internazionali {#4-other-international-transfers}

Per i trasferimenti di dati personali in cui la legge svizzera (e non la legge di uno degli stati membri dello SEE o del Regno Unito) si applica alla natura internazionale del trasferimento, i riferimenti al GDPR nella clausola 4 delle clausole contrattuali tipo dello SEE sono, nella misura in cui richiesto dalla legge, modificati per fare riferimento alla legge federale svizzera sulla protezione dei dati o alla sua versione successiva, e il concetto di autorità di controllo includerà l'Incaricato federale svizzero per la protezione dei dati e la trasparenza.

## 4. Risposta agli incidenti di sicurezza {#4-security-incident-response}

1. Una volta venuto a conoscenza di un Incidente di sicurezza, il <strong>Fornitore</strong> dovrà: (a) informare il <strong>Cliente</strong> senza indebito ritardo, ove possibile, ma non oltre 72 ore dal momento in cui è venuto a conoscenza dell'Incidente di sicurezza; (b) fornire tempestivamente informazioni sull'Incidente di sicurezza non appena vengono a conoscenza o su ragionevole richiesta del <strong>Cliente</strong>; e (c) adottare tempestivamente misure ragionevoli per contenere e indagare sull'Incidente di sicurezza. La notifica o la risposta del <strong>Fornitore</strong> a un Incidente di sicurezza, come richiesto dal presente DPA, non sarà interpretata come un riconoscimento da parte del <strong>Fornitore</strong> di alcuna colpa o responsabilità per l'Incidente di sicurezza.

## 5. Audit e report {#5-audit--reports}

### 1. Diritti di controllo {#1-audit-rights}

Il Fornitore fornirà al Cliente tutte le informazioni ragionevolmente necessarie per dimostrare la propria conformità al presente DPA e consentirà e contribuirà a condurre audit, incluse ispezioni da parte del Cliente, per valutare la conformità del Fornitore al presente DPA. Tuttavia, il Fornitore può limitare l'accesso ai dati o alle informazioni qualora l'accesso del Cliente alle informazioni influisca negativamente sui diritti di proprietà intellettuale, sugli obblighi di riservatezza o su altri obblighi del Fornitore ai sensi delle Leggi Applicabili. Il Cliente riconosce e accetta che eserciterà i propri diritti di audit ai sensi del presente DPA e di qualsiasi diritto di audit concesso dalle Leggi Applicabili sulla Protezione dei Dati solo incaricando il Fornitore di conformarsi ai requisiti di segnalazione e due diligence di seguito indicati. Il Fornitore conserverà la documentazione relativa alla propria conformità al presente DPA per 3 anni dalla sua cessazione.

### 2. Rapporti di sicurezza {#2-security-reports}

Il <strong>Cliente</strong> riconosce che il <strong>Fornitore</strong> viene regolarmente sottoposto a verifiche in base agli standard definiti nella <strong>Politica di Sicurezza</strong> da parte di revisori terzi indipendenti. Su richiesta scritta, il <strong>Fornitore</strong> fornirà al <strong>Cliente</strong>, in via riservata, una copia riassuntiva del suo Rapporto aggiornato in modo che il <strong>Cliente</strong> possa verificare la conformità del <strong>Fornitore</strong> agli standard definiti nella <strong>Politica di Sicurezza</strong>.

### 3. Due diligence sulla sicurezza {#3-security-due-diligence}

Oltre al Rapporto, il Fornitore risponderà a richieste di informazioni ragionevoli presentate dal Cliente per confermare la conformità del Fornitore al presente DPA, incluse le risposte ai questionari sulla sicurezza delle informazioni, sulla due diligence e sugli audit, oppure fornendo ulteriori informazioni sul proprio programma di sicurezza delle informazioni. Tutte le richieste devono essere presentate per iscritto al Referente per la Sicurezza del Fornitore e possono essere presentate solo una volta all'anno.

## 6. Coordinamento e cooperazione {#6-coordination--cooperation}

### 1. Risposta alle richieste {#1-response-to-inquiries}

Se il Fornitore riceve qualsiasi richiesta o quesito da chiunque altro in merito al Trattamento dei Dati Personali del Cliente, il Fornitore informerà il Cliente della richiesta e non risponderà alla richiesta senza il previo consenso del Cliente. Esempi di questo tipo di richieste e quesiti includono un ordine di un'agenzia giudiziaria, amministrativa o di regolamentazione relativo ai Dati Personali del Cliente, laddove la notifica al Cliente non sia vietata dalla Legge Applicabile, o una richiesta da parte di un interessato. Se consentito dalla Legge Applicabile, il Fornitore seguirà le istruzioni ragionevoli del Cliente in merito a tali richieste, incluso fornire aggiornamenti sullo stato e altre informazioni ragionevolmente richieste dal Cliente. Se un interessato presenta una richiesta valida ai sensi delle Leggi applicabili in materia di protezione dei dati per eliminare o rifiutare la comunicazione dei Dati personali del Cliente al Fornitore, il Fornitore assisterà il Cliente nell'evasione della richiesta in conformità con le Leggi applicabili in materia di protezione dei dati. Il Fornitore collaborerà con il Cliente e gli fornirà ragionevole assistenza, a spese del Cliente, in qualsiasi risposta legale o altra azione procedurale intrapresa dal Cliente in risposta a una richiesta di terzi relativa al Trattamento dei Dati personali del Cliente da parte del Fornitore ai sensi del presente DPA.

### 2. DPIA e DTIA {#2-dpias-and-dtias}

Se richiesto dalle leggi applicabili sulla protezione dei dati, il <strong>Fornitore</strong> assisterà ragionevolmente il <strong>Cliente</strong> nello svolgimento di eventuali valutazioni d'impatto sulla protezione dei dati o valutazioni d'impatto sul trasferimento dei dati e consultazioni con le autorità competenti per la protezione dei dati, tenendo in considerazione la natura del trattamento e dei dati personali del cliente.

## 7. Cancellazione dei dati personali del cliente {#7-deletion-of-customer-personal-data}

### 1. Eliminazione da parte del cliente {#1-deletion-by-customer}

Il <strong>Fornitore</strong> consentirà al <strong>Cliente</strong> di eliminare i Dati personali del Cliente in modo coerente con la funzionalità dei Servizi. Il <strong>Fornitore</strong> rispetterà questa istruzione non appena ragionevolmente possibile, salvo nei casi in cui l'ulteriore conservazione dei Dati personali del Cliente sia richiesta dalla Legge applicabile.

### 2. Eliminazione alla scadenza del DPA {#2-deletion-at-dpa-expiration}

a. Dopo la scadenza del DPA, il Fornitore restituirà o cancellerà i Dati Personali del Cliente su istruzione del Cliente, a meno che l'ulteriore conservazione dei Dati Personali del Cliente non sia richiesta o autorizzata dalla Legge Applicabile. Qualora la restituzione o la distruzione siano impraticabili o vietate dalla Legge Applicabile, il Fornitore compirà ogni ragionevole sforzo per impedire l'ulteriore Trattamento dei Dati Personali del Cliente e continuerà a proteggere i Dati Personali del Cliente rimasti in suo possesso, custodia o controllo. Ad esempio, la Legge Applicabile potrebbe richiedere al Fornitore di continuare a ospitare o trattare i Dati Personali del Cliente.

b. Se il <strong>Cliente</strong> e il <strong>Fornitore</strong> hanno sottoscritto le Condizioni Generali di Contratto (SCC) dello Spazio Economico Europeo o l'Addendum del Regno Unito come parte del presente DPA, il <strong>Fornitore</strong> fornirà al <strong>Cliente</strong> la certificazione di cancellazione dei Dati Personali descritta nella Clausola 8.1(d) e nella Clausola 8.5 delle Condizioni Generali di Contratto (SCC) dello Spazio Economico Europeo solo se il <strong>Cliente</strong> ne fa richiesta.

## 8. Limitazione di responsabilità {#8-limitation-of-liability}

### 1. Limiti di responsabilità e rinuncia al risarcimento danni {#1-liability-caps-and-damages-waiver}

**Nella misura massima consentita dalle leggi applicabili in materia di protezione dei dati, la responsabilità cumulativa totale di ciascuna parte nei confronti dell'altra parte derivante da o correlata al presente DPA sarà soggetta alle rinunce, esclusioni e limitazioni di responsabilità indicate nel <strong>Contratto</strong>.**

### 2. Reclami tra parti correlate {#2-related-party-claims}

**Qualsiasi reclamo presentato contro il <strong>Fornitore</strong> o le sue affiliate derivante da o correlato al presente DPA può essere presentato solo dall'entità <strong>Cliente</strong> che è parte del <strong>Contratto</strong>.**

### 3. Eccezioni {#3-exceptions}

1. Il presente DPA non limita alcuna responsabilità nei confronti di un individuo in merito ai suoi diritti di protezione dei dati personali ai sensi delle Leggi applicabili in materia di protezione dei dati. Inoltre, il presente DPA non limita alcuna responsabilità tra le parti per violazioni delle Condizioni Generali di Contratto (SCC) SEE o dell'Addendum del Regno Unito.

## 9. Conflitti tra documenti {#9-conflicts-between-documents}

1. Il presente DPA costituisce parte integrante e integra l'Accordo. In caso di incongruenza tra il presente DPA, l'Accordo o una qualsiasi delle loro parti, la parte indicata in precedenza prevarrà sulla parte indicata in seguito per tale incongruenza: (1) le Condizioni Generali di Contratto SEE o l'Addendum del Regno Unito, (2) il presente DPA e, in seguito, (3) l'Accordo.

## 10. Durata dell'accordo {#10-term-of-agreement}

Il presente DPA avrà inizio nel momento in cui il Fornitore e il Cliente concorderanno una pagina di copertina per il DPA e firmeranno o accetteranno elettronicamente il Contratto e continuerà fino alla scadenza o alla risoluzione del Contratto. Tuttavia, il Fornitore e il Cliente rimarranno entrambi soggetti agli obblighi previsti dal presente DPA e dalle Leggi applicabili in materia di protezione dei dati fino a quando il Cliente non cesserà di trasferire i Dati Personali al Fornitore e il Fornitore non cesserà di elaborare i Dati Personali del Cliente.

## 11. Legge applicabile e tribunali prescelti {#11-governing-law-and-chosen-courts}

Fermo restando il diritto applicabile o clausole simili del <strong>Contratto</strong>, tutte le interpretazioni e le controversie relative al presente DPA saranno regolate dalle leggi dello <strong>Stato Governante</strong>, senza riguardo alle disposizioni in materia di conflitto di leggi. Inoltre, e nonostante la scelta del foro competente, la giurisdizione o clausole simili del <strong>Contratto</strong>, le parti concordano di intentare qualsiasi azione legale, causa o procedimento relativo al presente DPA presso i tribunali dello <strong>Stato Governante</strong>, e ciascuna parte si sottomette irrevocabilmente alla giurisdizione esclusiva di tali tribunali.

## 12. Relazione con il fornitore del servizio {#12-service-provider-relationship}

Nella misura in cui si applica il California Consumer Privacy Act, Cal. Civ. Code § 1798.100 e segg. ("CCPA"), le parti riconoscono e concordano che il Fornitore è un fornitore di servizi e riceve Dati Personali dal Cliente per fornire il Servizio come concordato nel Contratto, il che costituisce uno scopo commerciale. Il Fornitore non venderà alcun Dato Personale fornito dal Cliente ai sensi del Contratto. Inoltre, il Fornitore non conserverà, utilizzerà o divulgherà alcun Dato Personale fornito dal Cliente ai sensi del Contratto, salvo quanto necessario per fornire il Servizio al Cliente, come indicato nel Contratto o come consentito dalle Leggi Applicabili sulla Protezione dei Dati. Il <strong>fornitore</strong> certifica di aver compreso le restrizioni del presente paragrafo.

## 13. Definizioni {#13-definitions}

1. **"Leggi applicabili"** indica le leggi, le norme, i regolamenti, gli ordini dei tribunali e altri requisiti vincolanti di un'autorità governativa competente che si applicano a una parte o la disciplinano.

2. **"Leggi applicabili sulla protezione dei dati"** indica le Leggi applicabili che regolano il modo in cui il Servizio può elaborare o utilizzare le informazioni personali, i dati personali, le informazioni di identificazione personale o altri termini simili di un individuo.

3. **"Titolare del trattamento"** avrà il significato attribuitogli dalle Leggi applicabili in materia di protezione dei dati per la società che determina lo scopo e l'entità del trattamento dei dati personali.

4. **"Pagina di copertina"** indica un documento firmato o accettato elettronicamente dalle parti che incorpora i presenti Termini standard del DPA e identifica il <strong>Fornitore</strong>, il <strong>Cliente</strong> e l'oggetto e i dettagli del trattamento dei dati.

5. **"Dati personali del cliente"** indica i Dati personali che il <strong>Cliente</strong> carica o fornisce al <strong>Fornitore</strong> come parte del Servizio e che sono disciplinati dal presente DPA.

6. **"DPA"** indica i presenti Termini standard DPA, la pagina di copertina tra <strong>Fornitore</strong> e <strong>Cliente</strong>, nonché le policy e i documenti a cui si fa riferimento o che sono allegati alla pagina di copertina.

7. **"SCC SEE"** indica le clausole contrattuali tipo allegate alla decisione di esecuzione 2021/914 della Commissione europea, del 4 giugno 2021, relativa alle clausole contrattuali tipo per il trasferimento di dati personali verso paesi terzi ai sensi del regolamento (UE) 2016/679 del Parlamento europeo e del Consiglio europeo.

8. **"Spazio economico europeo"** o **"SEE"** indica gli stati membri dell'Unione Europea, Norvegia, Islanda e Liechtenstein.

9. **"GDPR"** indica il Regolamento dell'Unione Europea 2016/679, come recepito dalla legge locale nel relativo paese membro dello SEE.

10. **"Dati personali"** avrà il significato attribuito nelle Leggi applicabili sulla protezione dei dati a informazioni personali, dati personali o altri termini simili.

11. **"Elaborazione"** o **"Processo"** avrà il significato attribuitogli dalle Leggi applicabili in materia di protezione dei dati per qualsiasi utilizzo o esecuzione di un'operazione informatica sui Dati personali, anche mediante metodi automatici.

12. **"Responsabile del trattamento"** avrà il significato attribuitogli dalle Leggi applicabili in materia di protezione dei dati per la società che elabora i dati personali per conto del Titolare del trattamento.

13. **"Report"** indica i report di audit predisposti da un'altra società secondo gli standard definiti nella Politica di sicurezza per conto del Fornitore.

14. **"Trasferimento limitato"** significa (a) laddove si applica il GDPR, un trasferimento di dati personali dallo SEE a un paese al di fuori dello SEE che non è soggetto a una determinazione di adeguatezza da parte della Commissione europea; e (b) laddove si applica il GDPR del Regno Unito, un trasferimento di dati personali dal Regno Unito a qualsiasi altro paese che non è soggetto a regolamenti di adeguatezza adottati ai sensi della Sezione 17A del Data Protection Act 2018 del Regno Unito.

15. **"Incidente di sicurezza"** indica una violazione dei dati personali come definita nell'articolo 4 del GDPR.

16. **"Servizio"** indica il prodotto e/o i servizi descritti nel <strong>Contratto</strong>.

17. **"Dati di categoria speciale"** avrà il significato attribuitogli nell'articolo 9 del GDPR.

18. **"Sub-responsabile del trattamento"** avrà il significato attribuitogli dalle Leggi applicabili in materia di protezione dei dati per una società che, con l'approvazione e l'accettazione del Titolare del trattamento, assiste il Responsabile del trattamento nell'elaborazione dei dati personali per conto del Titolare del trattamento.

19. **"GDPR del Regno Unito"** indica il Regolamento dell'Unione Europea 2016/679, come attuato dalla sezione 3 dell'European Union (Withdrawal) Act del Regno Unito del 2018 nel Regno Unito.

20. **"Addendum del Regno Unito"** indica l'addendum sul trasferimento internazionale di dati alle SCC SEE emesso dall'Information Commissioner per le parti che effettuano trasferimenti limitati ai sensi della sezione 119A(1) del Data Protection Act 2018.

## Crediti {#credits}

Il presente documento è derivato da [Condizioni standard del DPA comune (versione 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) ed è concesso in licenza con [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).