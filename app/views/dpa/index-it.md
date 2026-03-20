# Accordo sul Trattamento dei Dati {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Accordo sul trattamento dei dati di Forward Email" class="rounded-lg" />


## Indice {#table-of-contents}

* [Termini Chiave](#key-terms)
* [Modifiche all'Accordo](#changes-to-the-agreement)
* [1. Rapporti tra Titolare e Subtitolare del Trattamento](#1-processor-and-subprocessor-relationships)
  * [1. Fornitore come Titolare del Trattamento](#1-provider-as-processor)
  * [2. Fornitore come Subtitolare del Trattamento](#2-provider-as-subprocessor)
* [2. Trattamento](#2-processing)
  * [1. Dettagli del Trattamento](#1-processing-details)
  * [2. Istruzioni per il Trattamento](#2-processing-instructions)
  * [3. Trattamento da parte del Fornitore](#3-processing-by-provider)
  * [4. Trattamento da parte del Cliente](#4-customer-processing)
  * [5. Consenso al Trattamento](#5-consent-to-processing)
  * [6. Subtitolari del Trattamento](#6-subprocessors)
* [3. Trasferimenti Limitati](#3-restricted-transfers)
  * [1. Autorizzazione](#1-authorization)
  * [2. Trasferimenti fuori dall'EEA](#2-ex-eea-transfers)
  * [3. Trasferimenti fuori dal Regno Unito](#3-ex-uk-transfers)
  * [4. Altri Trasferimenti Internazionali](#4-other-international-transfers)
* [4. Risposta agli Incidenti di Sicurezza](#4-security-incident-response)
* [5. Audit e Rapporti](#5-audit--reports)
  * [1. Diritti di Audit](#1-audit-rights)
  * [2. Rapporti di Sicurezza](#2-security-reports)
  * [3. Due Diligence sulla Sicurezza](#3-security-due-diligence)
* [6. Coordinamento e Cooperazione](#6-coordination--cooperation)
  * [1. Risposta alle Richieste](#1-response-to-inquiries)
  * [2. DPIA e DTIA](#2-dpias-and-dtias)
* [7. Cancellazione dei Dati Personali del Cliente](#7-deletion-of-customer-personal-data)
  * [1. Cancellazione da parte del Cliente](#1-deletion-by-customer)
  * [2. Cancellazione alla Scadenza del DPA](#2-deletion-at-dpa-expiration)
* [8. Limitazione di Responsabilità](#8-limitation-of-liability)
  * [1. Limiti di Responsabilità e Rinuncia ai Danni](#1-liability-caps-and-damages-waiver)
  * [2. Reclami di Parti Correlate](#2-related-party-claims)
  * [3. Eccezioni](#3-exceptions)
* [9. Conflitti tra Documenti](#9-conflicts-between-documents)
* [10. Durata dell'Accordo](#10-term-of-agreement)
* [11. Legge Applicabile e Foro Competente](#11-governing-law-and-chosen-courts)
* [12. Rapporto con il Fornitore di Servizi](#12-service-provider-relationship)
* [13. Definizioni](#13-definitions)
* [Crediti](#credits)


## Termini Chiave {#key-terms}

| Termine                                    | Valore                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Accordo</strong>                   | Questo DPA integra i [Termini di Servizio](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                                |
| <strong>Subtitolari Approvati</strong>     | [Cloudflare](https://cloudflare.com) (USA; fornitore DNS, networking e sicurezza), [DataPacket](https://www.datapacket.com/) (USA/UK; fornitore hosting), [Digital Ocean](https://digitalocean.com) (USA; fornitore hosting), [GitHub](https://github.com) (USA; hosting codice sorgente, CI/CD e gestione progetti), [Vultr](https://www.vultr.com) (USA; fornitore hosting), [Stripe](https://stripe.com) (USA; processore di pagamenti), [PayPal](https://paypal.com) (USA; processore di pagamenti) |
| <strong>Contatto Sicurezza Fornitore</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Politica di Sicurezza</strong>     | Visualizza la [nostra Politica di Sicurezza su GitHub](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                           |
| <strong>Stato Governativo</strong>         | Lo Stato del Delaware, Stati Uniti                                                                                                                                                                                                                                                                                                                                                                                                                                               |
## Modifiche all'Accordo {#changes-to-the-agreement}

Questo documento è un derivato dei [Termini Standard DPA di Common Paper (Versione 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) e sono state apportate le seguenti modifiche:

1. [Legge Applicabile e Tribunali Scelti](#11-governing-law-and-chosen-courts) è stata inclusa come sezione qui sotto con lo `Stato Governante` identificato sopra.
2. [Rapporto con il Fornitore di Servizi](#12-service-provider-relationship) è stata inclusa come sezione qui sotto.


## 1. Rapporti tra Titolare del trattamento e Subincaricato {#1-processor-and-subprocessor-relationships}

### 1. Fornitore come Titolare del trattamento {#1-provider-as-processor}

Nelle situazioni in cui il <strong>Cliente</strong> è un Titolare del trattamento dei Dati Personali del Cliente, il <strong>Fornitore</strong> sarà considerato un Titolare del trattamento che tratta i Dati Personali per conto del <strong>Cliente</strong>.

### 2. Fornitore come Subincaricato {#2-provider-as-subprocessor}

Nelle situazioni in cui il <strong>Cliente</strong> è un Titolare del trattamento dei Dati Personali del Cliente, il <strong>Fornitore</strong> sarà considerato un Subincaricato dei Dati Personali del Cliente.


## 2. Trattamento {#2-processing}

### 1. Dettagli del Trattamento {#1-processing-details}

L'Allegato I(B) nella Copertina descrive l'oggetto, la natura, lo scopo e la durata di questo Trattamento, così come le <strong>Categorie di Dati Personali</strong> raccolti e le <strong>Categorie di Interessati</strong>.

### 2. Istruzioni per il Trattamento {#2-processing-instructions}

Il <strong>Cliente</strong> istruisce il <strong>Fornitore</strong> a trattare i Dati Personali del Cliente: (a) per fornire e mantenere il Servizio; (b) come ulteriormente specificato tramite l'uso del Servizio da parte del <strong>Cliente</strong>; (c) come documentato nell'<strong>Accordo</strong>; e (d) come documentato in qualsiasi altra istruzione scritta fornita dal <strong>Cliente</strong> e riconosciuta dal <strong>Fornitore</strong> riguardo al Trattamento dei Dati Personali del Cliente ai sensi di questo DPA. Il <strong>Fornitore</strong> si atterrà a queste istruzioni salvo sia vietato dalle Leggi Applicabili. Il <strong>Fornitore</strong> informerà immediatamente il <strong>Cliente</strong> se non è in grado di seguire le istruzioni di Trattamento. Il <strong>Cliente</strong> ha fornito e fornirà solo istruzioni conformi alle Leggi Applicabili.

### 3. Trattamento da parte del Fornitore {#3-processing-by-provider}

Il <strong>Fornitore</strong> tratterà i Dati Personali del Cliente solo in conformità con questo DPA, inclusi i dettagli nella Copertina. Se il <strong>Fornitore</strong> aggiorna il Servizio per aggiornare prodotti, funzionalità o caratteristiche esistenti o includerne di nuove, il <strong>Fornitore</strong> potrà modificare le <strong>Categorie di Interessati</strong>, le <strong>Categorie di Dati Personali</strong>, i <strong>Dati di Categoria Speciale</strong>, le <strong>Restrizioni o Garanzie sui Dati di Categoria Speciale</strong>, la <strong>Frequenza di Trasferimento</strong>, la <strong>Natura e Scopo del Trattamento</strong> e la <strong>Durata del Trattamento</strong> secondo necessità per riflettere gli aggiornamenti, notificando al <strong>Cliente</strong> le modifiche e gli aggiornamenti.

### 4. Trattamento da parte del Cliente {#4-customer-processing}

Quando il <strong>Cliente</strong> è un Titolare del trattamento e il <strong>Fornitore</strong> è un Subincaricato, il <strong>Cliente</strong> si conformerà a tutte le Leggi Applicabili che si applicano al Trattamento dei Dati Personali del Cliente da parte del <strong>Cliente</strong>. L'accordo del <strong>Cliente</strong> con il proprio Titolare del trattamento richiederà analogamente al <strong>Cliente</strong> di conformarsi a tutte le Leggi Applicabili che si applicano al <strong>Cliente</strong> come Titolare del trattamento. Inoltre, il <strong>Cliente</strong> si conformerà ai requisiti per i Subincaricati previsti nell'accordo del <strong>Cliente</strong> con il proprio Titolare del trattamento.

### 5. Consenso al Trattamento {#5-consent-to-processing}

Il <strong>Cliente</strong> ha rispettato e continuerà a rispettare tutte le Leggi sulla Protezione dei Dati Applicabili riguardanti la fornitura dei Dati Personali del Cliente al <strong>Fornitore</strong> e/o al Servizio, inclusa la comunicazione di tutte le informazioni, l'ottenimento di tutti i consensi, la fornitura di adeguate scelte e l'implementazione delle garanzie rilevanti richieste dalle Leggi sulla Protezione dei Dati Applicabili.
### 6. Subprocessori {#6-subprocessors}

a. <strong>Fornitore</strong> non fornirà, trasferirà o consegnerà alcun Dato Personale del Cliente a un Subprocessore a meno che il <strong>Cliente</strong> non abbia approvato il Subprocessore. L'elenco attuale dei <strong>Subprocessori Approvati</strong> include le identità dei Subprocessori, il loro paese di ubicazione e le attività di trattamento previste. Il <strong>Fornitore</strong> informerà il <strong>Cliente</strong> almeno 10 giorni lavorativi prima e per iscritto di qualsiasi modifica prevista ai <strong>Subprocessori Approvati</strong>, sia per aggiunta che per sostituzione di un Subprocessore, consentendo al <strong>Cliente</strong> di avere tempo sufficiente per opporsi alle modifiche prima che il <strong>Fornitore</strong> inizi a utilizzare il/i nuovo/i Subprocessore/i. Il <strong>Fornitore</strong> fornirà al <strong>Cliente</strong> le informazioni necessarie per permettere al <strong>Cliente</strong> di esercitare il diritto di opporsi alla modifica dei <strong>Subprocessori Approvati</strong>. Il <strong>Cliente</strong> ha 30 giorni dalla notifica di una modifica ai <strong>Subprocessori Approvati</strong> per opporsi, altrimenti si riterrà che il <strong>Cliente</strong> accetti le modifiche. Se il <strong>Cliente</strong> si oppone alla modifica entro 30 giorni dalla notifica, <strong>Cliente</strong> e <strong>Fornitore</strong> collaboreranno in buona fede per risolvere l'obiezione o la preoccupazione del <strong>Cliente</strong>.

b. Quando ingaggia un Subprocessore, il <strong>Fornitore</strong> stipulerà un accordo scritto con il Subprocessore che garantisca che il Subprocessore acceda e utilizzi i Dati Personali del Cliente (i) solo nella misura necessaria per eseguire gli obblighi a lui subappaltati, e (ii) in conformità con i termini del <strong>Contratto</strong>.

c. Se il GDPR si applica al trattamento dei Dati Personali del Cliente, (i) gli obblighi di protezione dei dati descritti in questo DPA (come previsto dall'Articolo 28(3) del GDPR, se applicabile) si applicano anche al Subprocessore, e (ii) l'accordo del <strong>Fornitore</strong> con il Subprocessore incorporerà tali obblighi, inclusi i dettagli su come il <strong>Fornitore</strong> e il suo Subprocessore coordineranno le risposte a richieste o domande riguardanti il trattamento dei Dati Personali del Cliente. Inoltre, il <strong>Fornitore</strong> condividerà, su richiesta del <strong>Cliente</strong>, una copia dei suoi accordi (inclusi eventuali emendamenti) con i suoi Subprocessori. Nella misura necessaria a proteggere segreti commerciali o altre informazioni riservate, inclusi i dati personali, il <strong>Fornitore</strong> potrà oscurare il testo del suo accordo con il Subprocessore prima di condividere una copia.

d. Il <strong>Fornitore</strong> rimane pienamente responsabile per tutti gli obblighi subappaltati ai suoi Subprocessori, inclusi gli atti e le omissioni dei suoi Subprocessori nel trattamento dei Dati Personali del Cliente. Il <strong>Fornitore</strong> notificherà al Cliente qualsiasi inadempienza da parte dei suoi Subprocessori nel soddisfare un obbligo materiale relativo ai Dati Personali del Cliente ai sensi dell'accordo tra <strong>Fornitore</strong> e il Subprocessore.


## 3. Trasferimenti Limitati {#3-restricted-transfers}

### 1. Autorizzazione {#1-authorization}

Il <strong>Cliente</strong> accetta che il <strong>Fornitore</strong> possa trasferire i Dati Personali del Cliente al di fuori dello SEE, del Regno Unito o di altro territorio geografico rilevante, se necessario per fornire il Servizio. Se il <strong>Fornitore</strong> trasferisce i Dati Personali del Cliente in un territorio per il quale la Commissione Europea o altra autorità di controllo rilevante non ha emesso una decisione di adeguatezza, il <strong>Fornitore</strong> implementerà adeguate garanzie per il trasferimento dei Dati Personali del Cliente in quel territorio in conformità con le Leggi Applicabili sulla Protezione dei Dati.

### 2. Trasferimenti Extra-SEE {#2-ex-eea-transfers}

Il <strong>Cliente</strong> e il <strong>Fornitore</strong> concordano che se il GDPR protegge il trasferimento dei Dati Personali del Cliente, il trasferimento avviene dal <strong>Cliente</strong> all'interno dello SEE al <strong>Fornitore</strong> al di fuori dello SEE, e il trasferimento non è regolato da una decisione di adeguatezza della Commissione Europea, allora con la sottoscrizione di questo DPA, il <strong>Cliente</strong> e il <strong>Fornitore</strong> si considerano aver firmato le SCC SEE e i loro Allegati, che sono incorporati per riferimento. Qualsiasi trasferimento di questo tipo è effettuato ai sensi delle SCC SEE, che sono completate come segue:
a. Il Modulo Due (Titolare del trattamento a Responsabile del trattamento) delle SCC SEE si applica quando il <strong>Cliente</strong> è un Titolare del trattamento e il <strong>Fornitore</strong> tratta i Dati Personali del Cliente per conto del <strong>Cliente</strong> in qualità di Responsabile del trattamento.

b. Il Modulo Tre (Responsabile del trattamento a Sub-responsabile) delle SCC SEE si applica quando il <strong>Cliente</strong> è un Responsabile del trattamento e il <strong>Fornitore</strong> tratta i Dati Personali del Cliente per conto del <strong>Cliente</strong> in qualità di Sub-responsabile.

c. Per ogni modulo, si applica quanto segue (quando pertinente):

1. La clausola opzionale di docking nella Clausola 7 non si applica;

2. Nella Clausola 9, si applica l’Opzione 2 (autorizzazione scritta generale), e il periodo minimo di preavviso per le modifiche al Sub-responsabile è di 10 giorni lavorativi;

3. Nella Clausola 11, il testo opzionale non si applica;

4. Tutte le parentesi quadre nella Clausola 13 sono rimosse;

5. Nella Clausola 17 (Opzione 1), le SCC SEE saranno regolate dalle leggi del <strong>Paese Membro Governante</strong>;

6. Nella Clausola 18(b), le controversie saranno risolte nei tribunali del <strong>Paese Membro Governante</strong>; e

7. La Copertina di questo DPA contiene le informazioni richieste negli Allegati I, II e III delle SCC SEE.

### 3. Trasferimenti ex-UK {#3-ex-uk-transfers}

<strong>Cliente</strong> e <strong>Fornitore</strong> concordano che se il GDPR del Regno Unito protegge il trasferimento dei Dati Personali del Cliente, il trasferimento avviene dal <strong>Cliente</strong> all’interno del Regno Unito al <strong>Fornitore</strong> al di fuori del Regno Unito, e il trasferimento non è regolato da una decisione di adeguatezza adottata dal Segretario di Stato del Regno Unito, allora con la sottoscrizione di questo DPA, il <strong>Cliente</strong> e il <strong>Fornitore</strong> sono considerati aver firmato l’Addendum UK e i suoi Allegati, che sono incorporati per riferimento. Qualsiasi trasferimento di questo tipo è effettuato ai sensi dell’Addendum UK, che è completato come segue:

a. La Sezione 3.2 di questo DPA contiene le informazioni richieste nella Tabella 2 dell’Addendum UK.

b. La Tabella 4 dell’Addendum UK è modificata come segue: Nessuna delle parti può terminare l’Addendum UK come previsto nella Sezione 19 dell’Addendum UK; nella misura in cui l’ICO emetta un Addendum Approvato rivisto ai sensi della Sezione ‎18 dell’Addendum UK, le parti collaboreranno in buona fede per rivedere di conseguenza questo DPA.

c. La Copertina contiene le informazioni richieste dagli Allegati 1A, 1B, II e III dell’Addendum UK.

### 4. Altri Trasferimenti Internazionali {#4-other-international-transfers}

Per i trasferimenti di Dati Personali in cui si applica la legge svizzera (e non la legge di alcuno Stato membro SEE o del Regno Unito) alla natura internazionale del trasferimento, i riferimenti al GDPR nella Clausola 4 delle SCC SEE sono, nella misura legalmente richiesta, modificati per riferirsi invece alla Legge federale svizzera sulla protezione dei dati o al suo successore, e il concetto di autorità di controllo includerà il Commissario federale svizzero per la protezione dei dati e la trasparenza.


## 4. Risposta agli Incidenti di Sicurezza {#4-security-incident-response}

1. Non appena viene a conoscenza di un Incidente di Sicurezza, il <strong>Fornitore</strong>: (a) notificherà il <strong>Cliente</strong> senza ingiustificato ritardo quando possibile, ma non oltre 72 ore dal momento in cui viene a conoscenza dell’Incidente di Sicurezza; (b) fornirà tempestivamente informazioni sull’Incidente di Sicurezza man mano che diventano note o come ragionevolmente richiesto dal <strong>Cliente</strong>; e (c) prenderà prontamente misure ragionevoli per contenere e indagare sull’Incidente di Sicurezza. La notifica o la risposta del <strong>Fornitore</strong> a un Incidente di Sicurezza come richiesto da questo DPA non sarà interpretata come un’ammissione da parte del <strong>Fornitore</strong> di alcuna colpa o responsabilità per l’Incidente di Sicurezza.


## 5. Audit e Rapporti {#5-audit--reports}

### 1. Diritti di Audit {#1-audit-rights}

Il <strong>Fornitore</strong> fornirà al <strong>Cliente</strong> tutte le informazioni ragionevolmente necessarie per dimostrare la conformità a questo DPA e consentirà e contribuirà agli audit, comprese le ispezioni da parte del <strong>Cliente</strong>, per valutare la conformità del <strong>Fornitore</strong> a questo DPA. Tuttavia, il <strong>Fornitore</strong> può limitare l’accesso ai dati o alle informazioni se l’accesso del <strong>Cliente</strong> alle informazioni comprometterebbe negativamente i diritti di proprietà intellettuale, gli obblighi di riservatezza o altri obblighi del <strong>Fornitore</strong> ai sensi delle Leggi Applicabili. Il <strong>Cliente</strong> riconosce e accetta che eserciterà i propri diritti di audit ai sensi di questo DPA e di qualsiasi diritto di audit concesso dalle Leggi sulla Protezione dei Dati Applicabili solo istruendo il <strong>Fornitore</strong> a conformarsi ai requisiti di rendicontazione e due diligence di seguito. Il <strong>Fornitore</strong> manterrà i registri della propria conformità a questo DPA per 3 anni dopo la cessazione del DPA.
### 2. Rapporti sulla Sicurezza {#2-security-reports}

<strong>Cliente</strong> riconosce che il <strong>Fornitore</strong> è regolarmente sottoposto a verifiche conformi agli standard definiti nella <strong>Politica di Sicurezza</strong> da parte di revisori indipendenti terzi. Su richiesta scritta, il <strong>Fornitore</strong> fornirà al <strong>Cliente</strong>, in modo confidenziale, una copia riassuntiva del proprio Rapporto attualmente in vigore affinché il <strong>Cliente</strong> possa verificare la conformità del <strong>Fornitore</strong> agli standard definiti nella <strong>Politica di Sicurezza</strong>.

### 3. Due Diligence sulla Sicurezza {#3-security-due-diligence}

Oltre al Rapporto, il <strong>Fornitore</strong> risponderà a richieste ragionevoli di informazioni fatte dal <strong>Cliente</strong> per confermare la conformità del <strong>Fornitore</strong> al presente DPA, incluse risposte a questionari su sicurezza delle informazioni, due diligence e audit, o fornendo ulteriori informazioni sul proprio programma di sicurezza delle informazioni. Tutte tali richieste devono essere fatte per iscritto e indirizzate al <strong>Contatto per la Sicurezza del Fornitore</strong> e possono essere effettuate solo una volta all’anno.


## 6. Coordinamento e Cooperazione {#6-coordination--cooperation}

### 1. Risposta alle Richieste {#1-response-to-inquiries}

Se il <strong>Fornitore</strong> riceve qualsiasi richiesta o domanda da parte di terzi riguardo al Trattamento dei Dati Personali del Cliente, il <strong>Fornitore</strong> notificherà al <strong>Cliente</strong> la richiesta e non risponderà senza il previo consenso del <strong>Cliente</strong>. Esempi di tali richieste includono un ordine giudiziario, amministrativo o di un’agenzia regolatoria riguardante i Dati Personali del Cliente, ove la notifica al <strong>Cliente</strong> non sia vietata dalla Legge Applicabile, o una richiesta da parte di un interessato. Se consentito dalla Legge Applicabile, il <strong>Fornitore</strong> seguirà le istruzioni ragionevoli del <strong>Cliente</strong> riguardo a tali richieste, inclusa la fornitura di aggiornamenti sullo stato e altre informazioni ragionevolmente richieste dal <strong>Cliente</strong>. Se un interessato presenta una richiesta valida ai sensi delle Leggi Applicabili sulla Protezione dei Dati per cancellare o rinunciare alla comunicazione da parte del <strong>Cliente</strong> dei Dati Personali al <strong>Fornitore</strong>, il <strong>Fornitore</strong> assisterà il <strong>Cliente</strong> nell’adempimento della richiesta secondo la Legge Applicabile sulla Protezione dei Dati. Il <strong>Fornitore</strong> collaborerà e fornirà assistenza ragionevole al <strong>Cliente</strong>, a spese del <strong>Cliente</strong>, in qualsiasi risposta legale o altra azione procedurale intrapresa dal <strong>Cliente</strong> in risposta a una richiesta di terzi riguardante il Trattamento da parte del <strong>Fornitore</strong> dei Dati Personali del Cliente ai sensi del presente DPA.

### 2. DPIA e DTIA {#2-dpias-and-dtias}

Se richiesto dalle Leggi Applicabili sulla Protezione dei Dati, il <strong>Fornitore</strong> assisterà ragionevolmente il <strong>Cliente</strong> nello svolgimento di qualsiasi valutazione d’impatto sulla protezione dei dati o valutazione d’impatto sul trasferimento dei dati obbligatoria e nelle consultazioni con le autorità competenti per la protezione dei dati, tenendo conto della natura del Trattamento e dei Dati Personali del Cliente.


## 7. Cancellazione dei Dati Personali del Cliente {#7-deletion-of-customer-personal-data}

### 1. Cancellazione da parte del Cliente {#1-deletion-by-customer}

Il <strong>Fornitore</strong> consentirà al <strong>Cliente</strong> di cancellare i Dati Personali del Cliente in modo coerente con le funzionalità dei Servizi. Il <strong>Fornitore</strong> si conformerà a questa istruzione non appena ragionevolmente possibile, salvo che la conservazione ulteriore dei Dati Personali del Cliente sia richiesta dalla Legge Applicabile.

### 2. Cancellazione alla Scadenza del DPA {#2-deletion-at-dpa-expiration}

a. Dopo la scadenza del DPA, il <strong>Fornitore</strong> restituirà o cancellerà i Dati Personali del Cliente su istruzione del <strong>Cliente</strong>, salvo che la conservazione ulteriore dei Dati Personali del Cliente sia richiesta o autorizzata dalla Legge Applicabile. Se la restituzione o la distruzione risultano impraticabili o vietate dalle Leggi Applicabili, il <strong>Fornitore</strong> farà ragionevoli sforzi per prevenire ulteriori Trattamenti dei Dati Personali del Cliente e continuerà a proteggere i Dati Personali del Cliente rimasti in suo possesso, custodia o controllo. Ad esempio, le Leggi Applicabili possono richiedere al <strong>Fornitore</strong> di continuare a ospitare o trattare i Dati Personali del Cliente.
b. Se <strong>Cliente</strong> e <strong>Fornitore</strong> hanno inserito le SCC SEE o l'Addendum UK come parte di questo DPA, <strong>Fornitore</strong> fornirà a <strong>Cliente</strong> la certificazione di cancellazione dei Dati Personali descritta nella Clausola 8.1(d) e nella Clausola 8.5 delle SCC SEE solo se <strong>Cliente</strong> ne fa richiesta.


## 8. Limitazione di Responsabilità {#8-limitation-of-liability}

### 1. Limiti di Responsabilità e Rinuncia ai Danni {#1-liability-caps-and-damages-waiver}

**Nella massima misura consentita dalle Leggi sulla Protezione dei Dati Applicabili, la responsabilità cumulativa totale di ciascuna parte nei confronti dell'altra derivante da o correlata a questo DPA sarà soggetta alle rinunce, esclusioni e limitazioni di responsabilità indicate nel <strong>Contratto</strong>.**

### 2. Reclami da Parti Correlate {#2-related-party-claims}

**Eventuali reclami presentati contro <strong>Fornitore</strong> o le sue Affiliate derivanti da o correlati a questo DPA possono essere avanzati solo dall'entità <strong>Cliente</strong> che è parte del <strong>Contratto</strong>.**

### 3. Eccezioni {#3-exceptions}

1. Questo DPA non limita alcuna responsabilità nei confronti di un individuo riguardo ai diritti di protezione dei dati personali dell'individuo ai sensi delle Leggi sulla Protezione dei Dati Applicabili. Inoltre, questo DPA non limita alcuna responsabilità tra le parti per violazioni delle SCC SEE o dell'Addendum UK.


## 9. Conflitti tra Documenti {#9-conflicts-between-documents}

1. Questo DPA fa parte e integra il Contratto. In caso di incongruenza tra questo DPA, il <strong>Contratto</strong> o qualsiasi loro parte, prevarrà la parte elencata prima rispetto a quella elencata dopo per tale incongruenza: (1) le SCC SEE o l'Addendum UK, (2) questo DPA, e poi (3) il <strong>Contratto</strong>.


## 10. Durata del Contratto {#10-term-of-agreement}

Questo DPA avrà inizio quando <strong>Fornitore</strong> e <strong>Cliente</strong> concordano una Copertina per il DPA e firmano o accettano elettronicamente il <strong>Contratto</strong> e continuerà fino alla scadenza o risoluzione del <strong>Contratto</strong>. Tuttavia, <strong>Fornitore</strong> e <strong>Cliente</strong> rimarranno ciascuno soggetti agli obblighi di questo DPA e alle Leggi sulla Protezione dei Dati Applicabili fino a quando <strong>Cliente</strong> non cesserà di trasferire Dati Personali del Cliente a <strong>Fornitore</strong> e <strong>Fornitore</strong> non cesserà di Trattare i Dati Personali del Cliente.


## 11. Legge Applicabile e Foro Competente {#11-governing-law-and-chosen-courts}

Nonostante le clausole sulla legge applicabile o simili del <strong>Contratto</strong>, tutte le interpretazioni e controversie relative a questo DPA saranno regolate dalle leggi dello <strong>Stato Governante</strong> senza riguardo alle sue disposizioni sui conflitti di legge. Inoltre, e nonostante la selezione del foro, la giurisdizione o clausole simili del <strong>Contratto</strong>, le parti concordano di portare qualsiasi causa legale, azione o procedimento relativo a questo DPA presso, e ciascuna parte si sottomette irrevocabilmente alla giurisdizione esclusiva, dei tribunali dello <strong>Stato Governante</strong>.


## 12. Rapporto di Fornitore di Servizi {#12-service-provider-relationship}

Nella misura in cui si applica il California Consumer Privacy Act, Cal. Civ. Code § 1798.100 e ss. ("CCPA"), le parti riconoscono e concordano che <strong>Fornitore</strong> è un fornitore di servizi e riceve Dati Personali da <strong>Cliente</strong> per fornire il Servizio come concordato nel <strong>Contratto</strong>, il quale costituisce uno scopo commerciale. <strong>Fornitore</strong> non venderà alcun Dato Personale fornito da <strong>Cliente</strong> ai sensi del <strong>Contratto</strong>. Inoltre, <strong>Fornitore</strong> non tratterrà, utilizzerà o divulgherà alcun Dato Personale fornito da <strong>Cliente</strong> ai sensi del <strong>Contratto</strong> se non nella misura necessaria per fornire il Servizio per <strong>Cliente</strong>, come indicato nel <strong>Contratto</strong>, o come consentito dalle Leggi sulla Protezione dei Dati Applicabili. <strong>Fornitore</strong> certifica di comprendere le restrizioni di questo paragrafo.
## 13. Definizioni {#13-definitions}

1. **"Leggi Applicabili"** indica le leggi, regole, regolamenti, ordini giudiziari e altri requisiti vincolanti di un'autorità governativa rilevante che si applicano o regolano una parte.

2. **"Leggi Applicabili sulla Protezione dei Dati"** indica le Leggi Applicabili che regolano come il Servizio può trattare o utilizzare le informazioni personali, i dati personali, le informazioni identificabili personalmente o altro termine simile di un individuo.

3. **"Titolare del trattamento"** avrà il significato/i dato/i nelle Leggi Applicabili sulla Protezione dei Dati per la società che determina lo scopo e l'estensione del Trattamento dei Dati Personali.

4. **"Pagina di Copertina"** indica un documento firmato o accettato elettronicamente dalle parti che incorpora questi Termini Standard DPA e identifica <strong>Fornitore</strong>, <strong>Cliente</strong>, e l'oggetto e i dettagli del trattamento dei dati.

5. **"Dati Personali del Cliente"** indica i Dati Personali che il <strong>Cliente</strong> carica o fornisce al <strong>Fornitore</strong> come parte del Servizio e che sono regolati da questo DPA.

6. **"DPA"** indica questi Termini Standard DPA, la Pagina di Copertina tra <strong>Fornitore</strong> e <strong>Cliente</strong>, e le politiche e i documenti richiamati o allegati alla Pagina di Copertina.

7. **"Clausole Contrattuali Standard SEE"** indica le clausole contrattuali standard allegate alla Decisione di esecuzione 2021/914 della Commissione Europea del 4 giugno 2021 sulle clausole contrattuali standard per il trasferimento di dati personali verso paesi terzi ai sensi del Regolamento (UE) 2016/679 del Parlamento Europeo e del Consiglio Europeo.

8. **"Spazio Economico Europeo"** o **"SEE"** indica gli stati membri dell'Unione Europea, Norvegia, Islanda e Liechtenstein.

9. **"GDPR"** indica il Regolamento dell'Unione Europea 2016/679 come attuato dalla legge locale nella nazione membro SEE rilevante.

10. **"Dati Personali"** avrà il significato/i dato/i nelle Leggi Applicabili sulla Protezione dei Dati per informazioni personali, dati personali o altro termine simile.

11. **"Trattamento"** o **"Trattare"** avrà il significato/i dato/i nelle Leggi Applicabili sulla Protezione dei Dati per qualsiasi uso di, o esecuzione di un'operazione informatica su, Dati Personali, inclusi metodi automatici.

12. **"Responsabile del trattamento"** avrà il significato/i dato/i nelle Leggi Applicabili sulla Protezione dei Dati per la società che Tratta i Dati Personali per conto del Titolare del trattamento.

13. **"Rapporto"** indica i rapporti di audit preparati da un'altra società secondo gli standard definiti nella Politica di Sicurezza per conto del Fornitore.

14. **"Trasferimento Limitato"** indica (a) quando si applica il GDPR, un trasferimento di dati personali dal SEE a un paese al di fuori del SEE che non è soggetto a una decisione di adeguatezza della Commissione Europea; e (b) quando si applica il GDPR del Regno Unito, un trasferimento di dati personali dal Regno Unito a qualsiasi altro paese che non è soggetto a regolamenti di adeguatezza adottati ai sensi della Sezione 17A del Data Protection Act 2018 del Regno Unito.

15. **"Incidente di Sicurezza"** indica una Violazione dei Dati Personali come definita nell'Articolo 4 del GDPR.

16. **"Servizio"** indica il prodotto e/o i servizi descritti nel <strong>Contratto</strong>.

17. **"Dati di Categoria Speciale"** avrà il significato dato nell'Articolo 9 del GDPR.

18. **"Sub-responsabile"** avrà il significato/i dato/i nelle Leggi Applicabili sulla Protezione dei Dati per una società che, con l'approvazione e accettazione del Titolare del trattamento, assiste il Responsabile del trattamento nel Trattamento dei Dati Personali per conto del Titolare del trattamento.

19. **"GDPR del Regno Unito"** indica il Regolamento dell'Unione Europea 2016/679 come attuato dalla sezione 3 del European Union (Withdrawal) Act del 2018 nel Regno Unito.

20. **"Addendum UK"** indica l'addendum per il trasferimento internazionale dei dati alle Clausole Contrattuali Standard SEE emesso dal Commissario per l'Informazione per le Parti che effettuano Trasferimenti Limitati ai sensi della Sezione 119A(1) del Data Protection Act 2018.


## Crediti {#credits}

Questo documento è una derivazione dei [Termini Standard DPA Common Paper (Versione 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) ed è concesso in licenza sotto [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
