# Il disastro API di PayPal durato 11 anni: come abbiamo trovato soluzioni alternative mentre loro ignoravano gli sviluppatori {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" classe="arrotondato-lg" />

<p class="lead mt-3">In Forward Email, abbiamo a che fare con le API non funzionanti di PayPal da oltre un decennio. Quella che era iniziata come una piccola frustrazione si è trasformata in un disastro totale che ci ha costretti a sviluppare soluzioni alternative, bloccare i loro modelli di phishing e, infine, interrompere tutti i pagamenti PayPal durante una migrazione critica del conto.</p>
<p class="lead mt-3">Questa è la storia di 11 anni in cui PayPal ha ignorato le esigenze di base degli sviluppatori, mentre noi abbiamo provato di tutto per far funzionare la loro piattaforma.</p>

## Indice {#table-of-contents}

* [Il pezzo mancante: nessun modo per elencare gli abbonamenti](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: il problema emerge](#2014-2017-the-problem-emerges)
* [2020: forniamo loro un feedback esteso](#2020-we-give-them-extensive-feedback)
  * [L'elenco di feedback di 27 elementi](#the-27-item-feedback-list)
  * [Le squadre si sono coinvolte, le promesse sono state fatte](#teams-got-involved-promises-were-made)
  * [Il risultato? Niente.](#the-result-nothing)
* [L'esodo dei dirigenti: come PayPal ha perso ogni memoria istituzionale](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nuova leadership, stessi problemi](#2025-new-leadership-same-problems)
  * [Il nuovo CEO si impegna](#the-new-ceo-gets-involved)
  * [La risposta di Michelle Gill](#michelle-gills-response)
  * [La nostra risposta: niente più riunioni](#our-response-no-more-meetings)
  * [La risposta iper-ingegneristica di Marty Brodbeck](#marty-brodbecks-overengineering-response)
  * [La contraddizione del "CRUD semplice"](#the-simple-crud-contradiction)
  * [La disconnessione diventa chiara](#the-disconnect-becomes-clear)
* [Anni di segnalazioni di bug ignorate](#years-of-bug-reports-they-ignored)
  * [2016: primi reclami su UI/UX](#2016-early-uiux-complaints)
  * [2021: Segnalazione di bug nella posta elettronica aziendale](#2021-business-email-bug-report)
  * [2021: suggerimenti per migliorare l'interfaccia utente](#2021-ui-improvement-suggestions)
  * [2021: Errori nell'ambiente sandbox](#2021-sandbox-environment-failures)
  * [2021: Sistema di segnalazione completamente in panne](#2021-reports-system-completely-broken)
  * [2022: funzionalità API principale mancante (di nuovo)](#2022-core-api-feature-missing-again)
* [L'incubo dell'esperienza dello sviluppatore](#the-developer-experience-nightmare)
  * [Interfaccia utente non funzionante](#broken-user-interface)
  * [Problemi SDK](#sdk-problems)
  * [Violazioni della politica sulla sicurezza dei contenuti](#content-security-policy-violations)
  * [Caos della documentazione](#documentation-chaos)
  * [Vulnerabilità di sicurezza](#security-vulnerabilities)
  * [Disastro nella gestione delle sessioni](#session-management-disaster)
* [Luglio 2025: la goccia che ha fatto traboccare il vaso](#july-2025-the-final-straw)
* [Perché non possiamo semplicemente abbandonare PayPal](#why-we-cant-just-drop-paypal)
* [La soluzione alternativa della comunità](#the-community-workaround)
* [Blocco dei modelli PayPal a causa del phishing](#blocking-paypal-templates-due-to-phishing)
  * [Il vero problema: i modelli di PayPal sembrano truffe](#the-real-problem-paypals-templates-look-like-scams)
  * [La nostra implementazione](#our-implementation)
  * [Perché abbiamo dovuto bloccare PayPal](#why-we-had-to-block-paypal)
  * [La portata del problema](#the-scale-of-the-problem)
  * [L'ironia](#the-irony)
  * [Impatto nel mondo reale: nuove truffe PayPal](#real-world-impact-novel-paypal-scams)
* [Il processo KYC inverso di PayPal](#paypals-backwards-kyc-process)
  * [Come dovrebbe funzionare](#how-it-should-work)
  * [Come funziona realmente PayPal](#how-paypal-actually-works)
  * [L'impatto nel mondo reale](#the-real-world-impact)
  * [Il disastro della migrazione degli account del luglio 2025](#the-july-2025-account-migration-disaster)
  * [Perché questo è importante](#why-this-matters)
* [Come ogni altro processore di pagamento lo fa correttamente](#how-every-other-payment-processor-does-it-right)
  * [Banda](#stripe)
  * [Pagaia](#paddle)
  * [Commercio Coinbase](#coinbase-commerce)
  * [Piazza](#square)
  * [Lo standard del settore](#the-industry-standard)
  * [Cosa offrono gli altri processori rispetto a PayPal](#what-other-processors-provide-vs-paypal)
* [La sistematica insabbiatura di PayPal: mettere a tacere 6 milioni di voci](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [La grande cancellazione](#the-great-erasure)
  * [Il salvataggio di terze parti](#the-third-party-rescue)
* [Il disastro del bug di cattura durato 11 anni: 1.899 dollari e il conto alla rovescia è ancora in corso](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Perdita di $ 1.899 per Forward Email](#forward-emails-1899-loss)
  * [Il rapporto originale del 2013: oltre 11 anni di negligenza](#the-2013-original-report-11-years-of-negligence)
  * [Ammissione del 2016: PayPal rompe il suo stesso SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [L'escalation del 2024: ancora in crisi](#the-2024-escalation-still-broken)
  * [Il disastro dell'affidabilità del webhook](#the-webhook-reliability-disaster)
  * [Il modello di negligenza sistematica](#the-pattern-of-systematic-negligence)
  * [Il requisito non documentato](#the-undocumented-requirement)
* [Il modello più ampio di inganno di PayPal](#paypals-broader-pattern-of-deception)
  * [Azione del Dipartimento dei servizi finanziari di New York](#the-new-york-department-of-financial-services-action)
  * [La causa Honey: riscrivere i link di affiliazione](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Il costo della negligenza di PayPal](#the-cost-of-paypals-negligence)
  * [La menzogna della documentazione](#the-documentation-lie)
* [Cosa significa questo per gli sviluppatori](#what-this-means-for-developers)

## Il pezzo mancante: nessun modo per elencare gli abbonamenti {#the-missing-piece-no-way-to-list-subscriptions}

Ecco la cosa che ci lascia sbalorditi: PayPal offre la fatturazione tramite abbonamento dal 2014, ma non ha mai fornito ai commercianti un modo per elencare i propri abbonamenti.

Pensaci un attimo. Puoi creare abbonamenti, puoi annullarli se hai l'ID, ma non puoi ottenere un elenco di tutti gli abbonamenti attivi per il tuo account. È come avere un database senza istruzione SELECT.

Ne abbiamo bisogno per le operazioni aziendali di base:

* Assistenza clienti (quando qualcuno invia un'e-mail per chiedere informazioni sul proprio abbonamento)
* Reporting finanziario e riconciliazione
* Gestione automatizzata della fatturazione
* Conformità e auditing

Ma PayPal? Semplicemente... non l'hanno mai costruito.

## 2014-2017: Il problema emerge {#2014-2017-the-problem-emerges}

Il problema dell'elenco degli abbonamenti è apparso per la prima volta nei forum della community di PayPal nel 2017. Gli sviluppatori si ponevano la domanda ovvia: "Come posso ottenere un elenco di tutti i miei abbonamenti?"

La risposta di PayPal? I grilli.

I membri della comunità hanno iniziato a innervosirsi:

> "Omissione molto strana se un commerciante non riesce a elencare tutti i contratti attivi. Se l'ID del contratto viene perso, significa che solo l'utente può annullare o sospendere un contratto." - leafspider

> "+1. Sono passati quasi 3 anni." - laudukang (il che significa che il problema esiste dal 2014)

Il [post originale della community](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) del 2017 mostra gli sviluppatori che imploravano questa funzionalità di base. PayPal ha risposto archiviando il repository in cui gli utenti segnalavano il problema.

## 2020: Forniamo loro un feedback completo {#2020-we-give-them-extensive-feedback}

Nell'ottobre 2020, PayPal ci ha contattato per una sessione di feedback formale. Non si è trattato di una semplice chiacchierata: hanno organizzato una chiamata di 45 minuti su Microsoft Teams con 8 dirigenti PayPal, tra cui Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze e altri.

### Elenco di feedback di 27 elementi {#the-27-item-feedback-list}

Eravamo preparati. Dopo 6 ore di tentativi di integrazione con le loro API, avevamo individuato 27 problemi specifici. Mark Stuart del team PayPal Checkout ha dichiarato:

> Ciao Nick, grazie per aver condiviso con tutti oggi! Credo che questo sarà il catalizzatore per ottenere ulteriore supporto e investimenti per il nostro team, per risolvere questi problemi. È stato difficile ricevere un feedback così ricco come quello che ci hai lasciato finora.

Il feedback non era teorico, ma derivava da tentativi di integrazione reali:

1. **Generazione del token di accesso non funzionante**:

> La generazione del token di accesso non funziona. Inoltre, dovrebbero esserci più esempi oltre a quelli cURL.

2. **Nessuna interfaccia utente web per la creazione di abbonamenti**:

> Come diavolo si possono creare abbonamenti senza dover usare cURL? Non sembra esserci un'interfaccia web per farlo (come Stripe).

Mark Stuart ha trovato particolarmente preoccupante il problema del token di accesso:

> In genere non sentiamo parlare di problemi relativi alla generazione di token di accesso.

### I team si sono coinvolti, le promesse sono state fatte {#teams-got-involved-promises-were-made}

Man mano che scoprivamo nuovi problemi, PayPal aggiungeva altri team alla conversazione. Darshan Raju del team UI di gestione degli abbonamenti si è unito al gruppo e ha detto:

> Riconosci il divario. Lo monitoreremo e lo risolveremo. Grazie ancora per il tuo feedback!

La sessione è stata descritta come volta a:

> resoconto sincero della tua esperienza

A:

> rendere PayPal ciò che dovrebbe essere per gli sviluppatori.

### Il risultato? Niente. {#the-result-nothing}

Nonostante la sessione di feedback formale, l'ampio elenco di 27 elementi, il coinvolgimento di più team e le promesse di:

> traccia e indirizza

problemi, non è stato risolto assolutamente nulla.

## L'esodo dei dirigenti: come PayPal ha perso ogni memoria istituzionale {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Ed ecco dove la cosa diventa davvero interessante. Ogni singola persona che ha ricevuto il nostro feedback del 2020 ha abbandonato PayPal:

**Cambiamenti nella leadership:**

* [Dan Schulman (CEO per 9 anni) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (settembre 2023)
* [Sri Shivananda (CTO che ha organizzato il feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (gennaio 2024)

**I leader tecnici che hanno fatto promesse e poi se ne sono andati:**

* **Mark Stuart** (il feedback promesso sarebbe stato un "catalizzatore") → [Ora su Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (veterano di PayPal con 18 anni di esperienza) → [Amministratore delegato di MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Pensionato](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (uno degli ultimi rimasti) → [Appena partito per il Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (gennaio 2025)

PayPal è diventata una porta girevole in cui i dirigenti raccolgono il feedback degli sviluppatori, fanno promesse e poi se ne vanno per aziende migliori come JPMorgan, Ripple e altre aziende fintech.

Questo spiega perché la risposta al problema di GitHub del 2025 sembrava completamente scollegata dal nostro feedback del 2020: letteralmente tutti coloro che hanno ricevuto quel feedback hanno abbandonato PayPal.

## 2025: Nuova leadership, stessi problemi {#2025-new-leadership-same-problems}

Facciamo un salto al 2025, e riemerge esattamente lo stesso schema. Dopo anni di silenzio, la nuova dirigenza di PayPal si fa avanti di nuovo.

### Il nuovo CEO si impegna {#the-new-ceo-gets-involved}

Il 30 giugno 2025, abbiamo contattato direttamente il nuovo CEO di PayPal, Alex Chriss. La sua risposta è stata breve:

> Ciao Nick, grazie per averci contattato e per il feedback. Michelle (in copia per conoscenza) è pronta con il suo team a interagire e a lavorare insieme a te su questo argomento. Grazie -A

### Risposta di Michelle Gill {#michelle-gills-response}

Michelle Gill, vicepresidente esecutivo e direttore generale per le piccole imprese e i servizi finanziari, ha risposto:

> Grazie mille Nick, hai spostato Alex in Ccn. Stiamo indagando sulla questione dal tuo precedente post. Ti chiameremo prima della fine della settimana. Puoi per favore inviarmi i tuoi recapiti così che uno dei miei colleghi possa contattarti? Michelle

### La nostra risposta: niente più riunioni {#our-response-no-more-meetings}

Abbiamo rifiutato un altro incontro, spiegando la nostra frustrazione:

> Grazie. Tuttavia, non credo che rispondere a una chiamata possa servire a qualcosa. Ecco perché... In passato ho partecipato a una chiamata e non è andata da nessuna parte. Ho sprecato più di 2 ore del mio tempo a parlare con tutto il team e i dirigenti e non si è concluso nulla... Un sacco di email avanti e indietro. Assolutamente nulla. Il feedback non ha portato a nulla. Ci ho provato per anni, a farmi ascoltare, ma poi non è servito a nulla.

### La risposta iperprogettuale di Marty Brodbeck {#marty-brodbecks-overengineering-response}

Poi Marty Brodbeck, responsabile dell'ingegneria dei consumatori presso PayPal, mi ha contattato:

> Ciao Nick, sono Marty Brodbeck. Sono a capo di tutto il reparto consumer engineering di PayPal e ho guidato lo sviluppo delle API per l'azienda. Possiamo parlare del problema che stai affrontando e di come possiamo aiutarti?

Quando gli abbiamo spiegato la semplice necessità di un endpoint per l'elenco degli abbonamenti, la sua risposta ha rivelato esattamente il problema:

> Grazie Nick, stiamo creando un'API di sottoscrizione singola con SDK completo (supporta la gestione completa degli errori, il monitoraggio delle sottoscrizioni basato sugli eventi, un uptime robusto) in cui anche la fatturazione è suddivisa come API separata a cui i commercianti possono ricorrere anziché dover orchestrare più endpoint per ottenere un'unica risposta.

Questo è esattamente l'approccio sbagliato. Non abbiamo bisogno di mesi di architettura complessa. Ci serve un semplice endpoint REST che elenchi le sottoscrizioni, qualcosa che avrebbe dovuto esistere fin dal 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### La contraddizione "CRUD semplice" {#the-simple-crud-contradiction}

Quando abbiamo fatto notare che si trattava di una funzionalità CRUD di base che avrebbe dovuto esistere fin dal 2014, la risposta di Marty è stata rivelatrice:

> Le semplici operazioni Crud fanno parte dell'API principale, amico mio, quindi non ci vorranno mesi di sviluppo

L'SDK di PayPal TypeScript, che attualmente supporta solo tre endpoint dopo mesi di sviluppo, insieme alla sua cronologia storica, dimostra chiaramente che progetti di questo tipo richiedono più di qualche mese per essere completati.

Questa risposta dimostra che non capisce la sua API. Se "le semplici operazioni CRUD fanno parte dell'API principale", allora dov'è l'endpoint dell'elenco delle sottoscrizioni? Abbiamo risposto:

> Se "le semplici operazioni CRUD fanno parte dell'API principale", allora dov'è l'endpoint per l'elenco degli abbonamenti? Gli sviluppatori richiedono questa "semplice operazione CRUD" dal 2014. Sono passati 11 anni. Tutti gli altri processori di pagamento hanno questa funzionalità di base fin dal primo giorno.

### La disconnessione diventa chiara {#the-disconnect-becomes-clear}

Gli scambi del 2025 con Alex Chriss, Michelle Gill e Marty Brodbeck mostrano la stessa disfunzione organizzativa:

1. **La nuova dirigenza non è a conoscenza delle precedenti sessioni di feedback**
2. **Propongono le stesse soluzioni sovradimensionate**
3. **Non comprendono i limiti delle proprie API**
4. **Vogliono più riunioni invece di limitarsi a risolvere il problema**

Questo schema spiega perché i team di PayPal nel 2025 sembrano completamente disconnessi dall'ampio feedback fornito nel 2020: le persone che hanno ricevuto quel feedback non ci sono più e la nuova dirigenza sta ripetendo gli stessi errori.

## Anni di segnalazioni di bug ignorate {#years-of-bug-reports-they-ignored}

Non ci siamo limitati a lamentarci delle funzionalità mancanti. Abbiamo segnalato attivamente i bug e cercato di contribuire al miglioramento. Ecco una cronologia completa dei problemi che abbiamo documentato:

### 2016: Primi reclami su UI/UX {#2016-early-uiux-complaints}

Già nel 2016, avevamo contattato pubblicamente i vertici di PayPal, tra cui Dan Schulman, per problemi di interfaccia e di usabilità. Questo accadeva 9 anni fa, e gli stessi problemi di UI/UX persistono ancora oggi.

### 2021: Segnalazione bug e-mail aziendale {#2021-business-email-bug-report}

A marzo 2021, abbiamo segnalato che il sistema di posta elettronica aziendale di PayPal inviava notifiche di annullamento errate. Il modello di email presentava variabili visualizzate in modo errato, mostrando messaggi confusi ai clienti.

Mark Stuart ha riconosciuto il problema:

> Grazie Nick! Trasferimento in CCN. @Prasy, il tuo team è responsabile di questa email o sai chi lo è? La dicitura "Niftylettuce, LLC, non ti addebiteremo più nulla" mi porta a credere che ci sia un equivoco tra il destinatario e il contenuto dell'email.

**Risultato**: Hanno effettivamente risolto questo problema! Mark Stuart ha confermato:

> Ho appena saputo dal team delle notifiche che il modello email è stato corretto e implementato. Grazie per averci contattato per segnalarlo. Grazie!

Ciò dimostra che POSSONO risolvere le cose quando vogliono, semplicemente scelgono di non farlo nella maggior parte dei casi.

### 2021: Suggerimenti per migliorare l'interfaccia utente {#2021-ui-improvement-suggestions}

A febbraio 2021, abbiamo fornito un feedback dettagliato sull'interfaccia utente della dashboard, in particolare sulla sezione "Attività recenti PayPal":

> Credo che la dashboard di paypal.com, in particolare la sezione "Attività recenti PayPal", debba essere migliorata. Non credo che si debba mostrare la riga di stato "Creato" per il pagamento ricorrente di $0: aggiunge solo un sacco di righe extra e non si riesce a vedere facilmente a colpo d'occhio quanto reddito si sta generando nel giorno/negli ultimi giorni.

Mark Stuart lo ha inoltrato al team dei prodotti di consumo:

> Grazie! Non sono sicuro di quale team sia responsabile dell'Attività, ma l'ho inoltrato al responsabile dei prodotti di consumo per trovare il team giusto. Un pagamento ricorrente di $0,00 sembra un bug. Probabilmente dovrebbe essere filtrato.

**Risultato**: Mai risolto. L'interfaccia utente mostra ancora queste inutili voci $0.

### 2021: Errori nell'ambiente sandbox {#2021-sandbox-environment-failures}

A novembre 2021 abbiamo segnalato problemi critici con l'ambiente sandbox di PayPal:

* Le chiavi API segrete del sandbox sono state modificate e disabilitate in modo casuale
* Tutti gli account di test del sandbox sono stati eliminati senza preavviso
* Messaggi di errore durante il tentativo di visualizzare i dettagli dell'account del sandbox
* Errori di caricamento intermittenti

> Per qualche motivo, la mia chiave API segreta del sandbox è stata modificata e disabilitata. Inoltre, tutti i miei vecchi account di test del sandbox sono stati eliminati.

> A volte si caricano, a volte no. È incredibilmente frustrante.

**Risultato**: Nessuna risposta, nessuna soluzione. Gli sviluppatori riscontrano ancora problemi di affidabilità nella sandbox.

### 2021: Segnala un sistema completamente danneggiato {#2021-reports-system-completely-broken}

A maggio 2021, abbiamo segnalato che il sistema di download dei report sulle transazioni di PayPal era completamente inutilizzabile:

> Sembra che la segnalazione dei download non funzioni al momento e non l'abbia fatto per tutto il giorno. Probabilmente dovresti ricevere una notifica via email se non funziona.

Abbiamo anche segnalato il disastro della gestione delle sessioni:

> Inoltre, se rimani inattivo mentre sei connesso a PayPal per circa 5 minuti, verrai disconnesso. Quindi, quando aggiorni di nuovo il pulsante accanto al report di cui vuoi controllare lo stato (dopo aver aspettato un'eternità), è una seccatura dover effettuare nuovamente l'accesso.

Mark Stuart ha riconosciuto il problema del timeout della sessione:

> Ricordo che in passato mi avevi segnalato che la tua sessione scadeva spesso e interrompeva il tuo flusso di sviluppo mentre passavi dall'IDE a developer.paypal.com o alla dashboard del commerciante; al ritorno venivi nuovamente disconnesso.

**Risultato**: I timeout di sessione sono ancora di 60 secondi. Il sistema di report continua a presentare problemi ricorrenti.

### 2022: Funzionalità API principale mancante (di nuovo) {#2022-core-api-feature-missing-again}

A gennaio 2022, abbiamo nuovamente segnalato il problema relativo all'elenco degli abbonamenti, questa volta con ancora più dettagli sull'errata documentazione:

> Non esiste un GET che elenca tutti gli abbonamenti (in precedenza denominati accordi di fatturazione)

Abbiamo scoperto che la loro documentazione ufficiale era completamente inaccurata:

> Anche la documentazione API è totalmente imprecisa. Abbiamo pensato di trovare una soluzione alternativa scaricando un elenco hard-coded di ID di abbonamento. Ma non funziona nemmeno!

> Dalla documentazione ufficiale qui... Dice che puoi farlo... Ed ecco il punto: non c'è nessun campo "ID abbonamento" da spuntare.

Christina Monti di PayPal ha risposto:

> Ci scusiamo per le frustrazioni causate dall'errore in questi passaggi, risolveremo il problema questa settimana.

Sri Shivananda (CTO) ci ha ringraziato:

Grazie per il tuo continuo aiuto nel migliorarci. Lo apprezzo molto.

**Risultato**: la documentazione non è mai stata corretta. L'endpoint per l'elenco degli abbonamenti non è mai stato creato.

## L'incubo dell'esperienza dello sviluppatore {#the-developer-experience-nightmare}

Lavorare con le API di PayPal è come tornare indietro nel tempo di 10 anni. Ecco i problemi tecnici che abbiamo documentato:

### Interfaccia utente non funzionante {#broken-user-interface}

La dashboard degli sviluppatori di PayPal è un disastro. Ecco cosa affrontiamo quotidianamente:

<figure>
<figcaption><div class="alert alert-danger small text-center">
L'interfaccia utente di PayPal è così difettosa che non è nemmeno possibile ignorare le notifiche
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Il tuo browser non supporta il tag video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
La dashboard per sviluppatori ti fa letteralmente trascinare un cursore e poi ti disconnette dopo 60 secondi.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Il tuo browser non supporta il tag video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Altri problemi di interfaccia utente nell'interfaccia per sviluppatori di PayPal che mostrano flussi di lavoro interrotti
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Il tuo browser non supporta il tag video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
L'interfaccia di gestione degli abbonamenti: l'interfaccia è così scadente che abbiamo dovuto affidarci al codice per generare prodotti e piani di abbonamento.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Una vista dell'interfaccia di abbonamento non funzionante con funzionalità mancanti (non è possibile creare facilmente prodotti/piani/abbonamenti e non sembra esserci alcun modo per eliminare prodotti o piani una volta creati nell'interfaccia utente)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Messaggi di errore tipici di PayPal: criptici e inutili
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problemi con l'SDK {#sdk-problems}

* Non è possibile gestire sia i pagamenti una tantum che gli abbonamenti senza ricorrere a soluzioni alternative complesse che prevedono lo scambio e il rendering dei pulsanti durante il ricaricamento dell'SDK con tag script.
* L'SDK JavaScript viola le convenzioni di base (nomi delle classi in minuscolo, nessun controllo delle istanze).
* I messaggi di errore non indicano quali campi mancano.
* Tipi di dati incoerenti (richiedono importi in formato stringa anziché numeri).

### Violazioni della politica sulla sicurezza dei contenuti {#content-security-policy-violations}

Il loro SDK richiede unsafe-inline e unsafe-eval nel tuo CSP, **costringendoti a compromettere la sicurezza del tuo sito**.

### Documentazione Chaos {#documentation-chaos}

Lo stesso Mark Stuart ha ammesso:

> Concordo sul fatto che ci sia una quantità assurda di API legacy e nuove. È davvero difficile trovare ciò che cercavamo (anche per noi che lavoriamo qui).

### Vulnerabilità di sicurezza {#security-vulnerabilities}

**L'implementazione della 2FA di PayPal è al contrario**. Anche con le app TOTP abilitate, la verifica tramite SMS è forzata, rendendo gli account vulnerabili agli attacchi di scambio SIM. Se hai abilitato TOTP, dovresti usare esclusivamente quello. Il metodo di ripiego dovrebbe essere l'email, non l'SMS.

### Disastro di gestione della sessione {#session-management-disaster}

**La loro dashboard per sviluppatori ti disconnette dopo 60 secondi di inattività**. Prova a fare qualsiasi cosa produttiva e ti ritrovi costantemente a ripetere: login → captcha → autenticazione a due fattori → logout → ripeti. Usi una VPN? Buona fortuna.

## Luglio 2025: La goccia che ha fatto traboccare il vaso {#july-2025-the-final-straw}

Dopo 11 anni di problemi simili, il punto di svolta è arrivato durante una migrazione di routine del nostro account. Dovevamo passare a un nuovo account PayPal che corrispondesse al nome della nostra azienda, "Forward Email LLC", per una contabilità più pulita.

Ciò che avrebbe dovuto essere semplice si è trasformato in un completo disastro:

* I test iniziali hanno dimostrato che tutto funzionava correttamente
* Ore dopo, PayPal ha improvvisamente bloccato tutti i pagamenti degli abbonamenti senza preavviso
* I clienti non riuscivano a pagare, creando confusione e difficoltà di supporto
* L'assistenza PayPal ha fornito risposte contraddittorie, sostenendo che gli account erano stati verificati
* Siamo stati costretti a sospendere completamente i pagamenti PayPal

<figure>
<figcaption><div class="alert alert-danger small text-center">
L'errore che i clienti hanno visualizzato quando hanno provato a pagare: nessuna spiegazione, nessun log, niente
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
L'assistenza PayPal sosteneva che tutto andava bene, mentre i pagamenti erano completamente bloccati. Il messaggio finale mostra che affermano di aver "ripristinato alcune funzionalità", ma continuano a chiedere ulteriori informazioni non specificate - classico esempio di supporto PayPal
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Il processo di verifica dell'identità che presumibilmente non ha "risolto" nulla
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Messaggio vago e ancora nessuna soluzione. Nessuna informazione, avviso o altro in merito alle informazioni aggiuntive richieste. L'assistenza clienti non risponde.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Perché non possiamo semplicemente abbandonare PayPal {#why-we-cant-just-drop-paypal}

Nonostante tutti questi problemi, non possiamo abbandonare completamente PayPal perché alcuni clienti lo utilizzano solo come metodo di pagamento. Come ha affermato un cliente sul nostro [pagina di stato](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal è la mia unica opzione di pagamento

**Siamo costretti a supportare una piattaforma non funzionante perché PayPal ha creato un monopolio sui pagamenti per determinati utenti.**

## La soluzione alternativa della community {#the-community-workaround}

Poiché PayPal non fornisce funzionalità di base per la gestione degli abbonamenti, la community di sviluppatori ha sviluppato delle soluzioni alternative. Abbiamo creato uno script che aiuta a gestire gli abbonamenti PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Questo script fa riferimento a un [gist della comunità](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) dove gli sviluppatori condividono soluzioni. Gli utenti sono in realtà [ringraziandoci](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) per aver fornito ciò che PayPal avrebbe dovuto realizzare anni fa.

## Blocco dei modelli PayPal a causa di phishing {#blocking-paypal-templates-due-to-phishing}

I problemi vanno oltre le API. I modelli email di PayPal sono progettati così male che abbiamo dovuto implementare filtri specifici nel nostro servizio email perché sono indistinguibili dai tentativi di phishing.

### Il vero problema: i modelli di PayPal sembrano truffe {#the-real-problem-paypals-templates-look-like-scams}

Riceviamo regolarmente segnalazioni di email PayPal che sembrano esattamente tentativi di phishing. Ecco un esempio concreto tratto dalle nostre segnalazioni di abuso:

**Oggetto:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Questa email è stata inoltrata a `abuse@microsoft.com` perché sembrava un tentativo di phishing. Il problema? In realtà proveniva dall'ambiente sandbox di PayPal, ma il design del loro modello è così scadente che attiva i sistemi di rilevamento del phishing.

### La nostra implementazione {#our-implementation}

Puoi vedere il nostro filtro specifico per PayPal implementato nel nostro [codice di filtraggio della posta elettronica](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Perché abbiamo dovuto bloccare PayPal {#why-we-had-to-block-paypal}

Abbiamo implementato questa soluzione perché PayPal si è rifiutata di risolvere i problemi di spam/phishing/frode di massa, nonostante le nostre ripetute segnalazioni ai loro team anti-abuso. Le tipologie di email specifiche che blocchiamo includono:

* **RT000238** - Notifiche di fatture sospette
* **PPC001017** - Conferme di pagamento problematiche
* **RT000542** - Tentativi di hacking dei messaggi regalo

### La portata del problema {#the-scale-of-the-problem}

I nostri registri di filtraggio antispam mostrano l'enorme volume di spam relativo alle fatture PayPal che elaboriamo quotidianamente. Esempi di argomenti bloccati includono:

* "Fattura dal team di fatturazione PayPal: - Questo addebito verrà addebitato automaticamente sul tuo conto. Contattaci immediatamente al numero \[TELEFONO]"
* "Fattura da \[NOME AZIENDA] (\[ID ORDINE])"
* Diverse varianti con numeri di telefono diversi e ID ordine falsi

Queste email provengono spesso da host `outlook.com`, ma sembrano provenire dai sistemi legittimi di PayPal, il che le rende particolarmente pericolose. Le email superano l'autenticazione SPF, DKIM e DMARC perché vengono inviate tramite l'infrastruttura effettiva di PayPal.

I nostri registri tecnici mostrano che queste email di spam contengono intestazioni PayPal legittime:

* `X-Email-Type-Id: RT000238` (lo stesso ID che blocchiamo)
* `From: "service@paypal.com" <service@paypal.com>`
* Firme DKIM valide da `paypal.com`
* Record SPF corretti che mostrano i server di posta di PayPal

Ciò crea una situazione impossibile: le email legittime di PayPal e lo spam presentano caratteristiche tecniche identiche.

### L'ironia {#the-irony}

PayPal, un'azienda che dovrebbe essere in prima linea nella lotta contro le frodi finanziarie, utilizza modelli di email così mal progettati da attivare i sistemi anti-phishing. Siamo costretti a bloccare le email legittime di PayPal perché sono indistinguibili dalle truffe.

Ciò è documentato nella ricerca sulla sicurezza: [Attenzione alla frode del nuovo indirizzo PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/), che mostra come i sistemi di PayPal vengono sfruttati per frodi.

### Impatto nel mondo reale: nuove truffe PayPal {#real-world-impact-novel-paypal-scams}

Il problema non si limita a un design scadente. Il sistema di fatturazione di PayPal è così facilmente sfruttabile che i truffatori ne abusano regolarmente per inviare fatture fraudolente dall'aspetto legittimo. Il ricercatore di sicurezza Gavin Anderegg ha documentato [Una nuova truffa PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), dove i truffatori inviano fatture PayPal autentiche che superano tutti i controlli di autenticazione:

> "Analizzando la fonte, l'email sembrava provenire effettivamente da PayPal (SPF, DKIM e DMARC sono stati tutti superati). Il pulsante rimandava anche a quello che sembrava un URL PayPal legittimo... Ci ho messo un secondo a capire che si trattava di un'email legittima. Mi era appena stata inviata una "fattura" casuale da un truffatore."

<figure>
<figcaption><div class="alert alert-danger small text-center">
Screenshot che mostra diverse fatture PayPal fraudolente che inondano la posta in arrivo, tutte apparentemente legittime perché provengono effettivamente dai sistemi di PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Il ricercatore ha osservato:

> "Sembra anche una funzionalità comoda che PayPal dovrebbe prendere in considerazione per il blocco. Ho subito pensato che si trattasse di una qualche forma di truffa e mi interessavano solo i dettagli tecnici. Sembra fin troppo facile da mettere in atto e temo che altri possano caderci."

Questo illustra perfettamente il problema: i sistemi legittimi di PayPal sono progettati così male che favoriscono le frodi e, allo stesso tempo, rendono sospette le comunicazioni legittime.

A peggiorare le cose, ciò ha influito sulla nostra capacità di recapito con Yahoo, provocando reclami da parte dei clienti e ore di test meticolosi e verifiche di pattern.

## Processo KYC inverso di PayPal {#paypals-backwards-kyc-process}

Uno degli aspetti più frustranti della piattaforma PayPal è il suo approccio retrogrado alla conformità e alle procedure Know Your Customer (KYC). A differenza di qualsiasi altro processore di pagamenti, PayPal consente agli sviluppatori di integrare le proprie API e iniziare a ricevere i pagamenti in produzione prima di completare la verifica.

### Come dovrebbe funzionare {#how-it-should-work}

Ogni processore di pagamento legittimo segue questa sequenza logica:

1. **Completa prima la verifica KYC**
2. **Approva l'account del commerciante**
3. **Fornisci l'accesso all'API di produzione**
4. **Consenti l'incasso dei pagamenti**

In questo modo si proteggono sia l'elaboratore dei pagamenti sia il commerciante, garantendo la conformità prima che venga effettuato qualsiasi scambio di denaro.

### Come funziona effettivamente PayPal {#how-paypal-actually-works}

Il processo di PayPal è completamente al contrario:

1. **Fornire immediatamente l'accesso all'API di produzione**
2. **Consentire l'incasso dei pagamenti per ore o giorni**
3. **Bloccare improvvisamente i pagamenti senza preavviso**
4. **Richiedere la documentazione KYC dopo che i clienti sono già stati interessati**
5. **Non fornire alcuna notifica al commerciante**
6. **Consentire ai clienti di scoprire il problema e segnalarlo**

### L'impatto nel mondo reale {#the-real-world-impact}

Questo processo a ritroso crea disastri per le aziende:

* **I clienti non riescono a completare gli acquisti** durante i periodi di punta
* **Nessun preavviso** che la verifica è necessaria
* **Nessuna notifica via email** quando i pagamenti vengono bloccati
* **I commercianti vengono a conoscenza dei problemi grazie ai clienti confusi**
* **Perdita di fatturato** durante i periodi critici per l'attività
* **Danno alla fiducia dei clienti** quando i pagamenti falliscono misteriosamente

### Il disastro della migrazione dell'account di luglio 2025 {#the-july-2025-account-migration-disaster}

Questo stesso scenario si è verificato durante la nostra migrazione di routine del conto a luglio 2025. Inizialmente PayPal ha consentito il funzionamento dei pagamenti, poi li ha improvvisamente bloccati senza alcuna notifica. Abbiamo scoperto il problema solo quando i clienti hanno iniziato a segnalare di non poter pagare.

Quando abbiamo contattato l'assistenza, abbiamo ricevuto risposte contraddittorie sulla documentazione necessaria, senza una tempistica chiara per la risoluzione. Questo ci ha costretti a sospendere completamente i pagamenti tramite PayPal, confondendo i clienti che non avevano altre opzioni di pagamento.

### Perché questo è importante {#why-this-matters}

L'approccio di PayPal alla conformità dimostra una profonda incomprensione del funzionamento delle aziende. Un'adeguata verifica della conformità (KYC) dovrebbe avvenire **prima** dell'integrazione in produzione, non dopo che i clienti hanno già tentato di pagare. La mancanza di comunicazione proattiva in caso di problemi dimostra la mancanza di attenzione di PayPal rispetto alle esigenze dei commercianti.

Questo processo a ritroso è sintomatico dei più ampi problemi organizzativi di PayPal: danno priorità ai processi interni rispetto all'esperienza dei commercianti e dei clienti, provocando disastri operativi che allontanano le aziende dalla loro piattaforma.

## Come ogni altro processore di pagamento lo fa correttamente {#how-every-other-payment-processor-does-it-right}

La funzionalità di elenco abbonamenti che PayPal si rifiuta di implementare è standard nel settore da oltre un decennio. Ecco come altri processori di pagamento gestiscono questo requisito di base:

### Striscia {#stripe}

Stripe offre l'elenco degli abbonamenti fin dal lancio della sua API. La documentazione mostra chiaramente come recuperare tutti gli abbonamenti per un cliente o un account commerciante. Questa è considerata una funzionalità CRUD di base.

### Pagaia {#paddle}

Paddle fornisce API complete per la gestione degli abbonamenti, inclusi elenchi, filtri e impaginazione. L'azienda comprende l'importanza per i commercianti di visualizzare i propri flussi di entrate ricorrenti.

### Coinbase Commerce {#coinbase-commerce}

Anche i processori di pagamento in criptovaluta come Coinbase Commerce offrono una gestione degli abbonamenti migliore di PayPal.

### Quadrato {#square}

L'API di Square include l'elenco degli abbonamenti come funzionalità fondamentale, non come un ripensamento.

### Lo standard del settore {#the-industry-standard}

Ogni moderno processore di pagamento fornisce:

* Elenca tutti gli abbonamenti
* Filtra per stato, data, cliente
* Impaginazione per dataset di grandi dimensioni
* Notifiche webhook per le modifiche agli abbonamenti
* Documentazione completa con esempi pratici

### Cosa offrono gli altri processori rispetto a PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Elenca tutti gli abbonamenti:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Filtra per cliente:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtra per stato:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Cosa ottieni realmente:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**Endpoint disponibili di PayPal:**

* `POST /v1/billing/subscriptions` - Crea un abbonamento
* `GET /v1/billing/subscriptions/{id}` - Ottieni UN abbonamento (se conosci l'ID)
* `PATCH /v1/billing/subscriptions/{id}` - Aggiorna un abbonamento
* `POST /v1/billing/subscriptions/{id}/cancel` - Annulla abbonamento
* `POST /v1/billing/subscriptions/{id}/suspend` - Sospendi abbonamento

**Cosa manca da PayPal:**

* ❌ Nessun `GET /v1/billing/subscriptions` (elenca tutto)
* ❌ Nessuna funzionalità di ricerca
* ❌ Nessun filtro per stato, cliente, data
* ❌ Nessun supporto per l'impaginazione

PayPal è l'unico grande processore di pagamento che obbliga gli sviluppatori a tracciare manualmente gli ID degli abbonamenti nei propri database.

## La sistematica insabbiatura di PayPal: mettere a tacere 6 milioni di voci {#paypals-systematic-cover-up-silencing-6-million-voices}

In una mossa che riassume perfettamente l'approccio di PayPal alla gestione delle critiche, di recente hanno reso offline l'intero forum della loro community, mettendo di fatto a tacere oltre 6 milioni di membri e cancellando centinaia di migliaia di post che documentavano i loro fallimenti.

### La Grande Cancellazione {#the-great-erasure}

La community PayPal originale su `paypal-community.com` ospitava **6.003.558 membri** e conteneva centinaia di migliaia di post, segnalazioni di bug, reclami e discussioni sui problemi delle API di PayPal. Questo rappresentava oltre un decennio di prove documentate dei problemi sistematici di PayPal.

Il 30 giugno 2025, PayPal ha silenziosamente disattivato l'intero forum. Tutti i link `paypal-community.com` ora restituiscono errori 404. Non si è trattato di una migrazione o di un aggiornamento.

### Il salvataggio di terze parti {#the-third-party-rescue}

Fortunatamente, un servizio di terze parti all'indirizzo [ppl.lithium.com](https://ppl.lithium.com/) ha conservato parte del contenuto, permettendoci di accedere alle discussioni che PayPal ha cercato di nascondere. Tuttavia, questa conservazione da parte di terze parti è incompleta e potrebbe scomparire in qualsiasi momento.

Questo schema di occultamento delle prove non è una novità per PayPal. L'azienda ha una storia documentata di:

* Rimozione di segnalazioni di bug critici dalla vista pubblica
* Interruzione di strumenti per sviluppatori senza preavviso
* Modifica di API senza la documentazione adeguata
* Silenziamento delle discussioni della community sui loro errori

La chiusura del forum rappresenta il tentativo più sfacciato finora di nascondere i propri fallimenti sistematici al pubblico.

## Il disastro del bug di cattura durato 11 anni: 1.899 dollari e continua a crescere {#the-11-year-capture-bug-disaster-1899-and-counting}

Mentre PayPal era impegnata a organizzare sessioni di feedback e a fare promesse, il suo sistema di elaborazione dei pagamenti è rimasto sostanzialmente inutilizzato per oltre 11 anni. Le prove sono devastanti.

### Perdita di $ 1.899 per l'email di inoltro {#forward-emails-1899-loss}

Nei nostri sistemi di produzione, abbiamo rilevato 108 pagamenti PayPal per un totale di **$1.899**, persi a causa di errori di acquisizione da parte di PayPal. Questi pagamenti mostrano uno schema coerente:

* Sono stati ricevuti webhook `CHECKOUT.ORDER.APPROVED`
* L'API di acquisizione di PayPal ha restituito errori 404
* Gli ordini sono diventati inaccessibili tramite l'API di PayPal

È impossibile stabilire se ai clienti è stato addebitato un importo, poiché PayPal nasconde completamente i registri di debug dopo 14 giorni e cancella dalla dashboard tutti i dati relativi agli ID ordine che non sono stati acquisiti.

Questo rappresenta solo un'attività. **Le perdite complessive di migliaia di commercianti in oltre 11 anni ammonteranno probabilmente a milioni di dollari.**

**Lo ripetiamo ancora una volta: le perdite complessive di migliaia di commercianti in oltre 11 anni ammontano probabilmente a milioni di dollari.**

L'unica ragione per cui lo abbiamo scoperto è perché siamo incredibilmente meticolosi e basati sui dati.

### Il rapporto originale del 2013: oltre 11 anni di negligenza {#the-2013-original-report-11-years-of-negligence}

Il primo rapporto documentato di questo specifico problema appare su [Stack Overflow nel novembre 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archiviato](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Continua a ricevere l'errore 404 con l'API REST quando si esegue un'acquisizione"

L'errore segnalato nel 2013 è **identico** a quello riscontrato da Forward Email nel 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

La risposta della comunità nel 2013 è stata significativa:

> "Al momento è stato segnalato un problema con la REST API. PayPal ci sta lavorando."

**Dopo più di 11 anni, ci stanno ancora "lavorando".**

### Ammissione del 2016: PayPal rompe il proprio SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

Nel 2016, il repository GitHub di PayPal ha documentato che [fallimenti di cattura massicci](https://github.com/paypal/PayPal-PHP-SDK/issues/660) aveva interessato il suo SDK PHP ufficiale. La portata era impressionante:

> "Dal 20/9/2016, tutti i tentativi di acquisizione PayPal sono falliti con il messaggio 'INVALID_RESOURCE_ID - ID risorsa richiesta non trovato'. Tra il 19 e il 20/9 non è stato apportato alcun cambiamento all'integrazione API. **Il 100% dei tentativi di acquisizione dal 20/9 ha restituito questo errore.**"

Un commerciante ha riferito:

> "Ho avuto **oltre 1.400 tentativi di acquisizione falliti nelle ultime 24 ore**, tutti con risposta di errore INVALID_RESOURCE_ID."

La risposta iniziale di PayPal è stata quella di incolpare il commerciante e di indirizzarlo all'assistenza tecnica. Solo dopo forti pressioni hanno ammesso la colpa:

> "Ho ricevuto un aggiornamento dai nostri sviluppatori di prodotto. Hanno notato che nelle intestazioni inviate il PayPal-Request-ID viene inviato con 42 caratteri, ma **sembra che sia stata apportata una modifica recente che limita questo ID a soli 38 caratteri.**"

Questa ammissione rivela la sistematica negligenza di PayPal:

1. **Hanno apportato modifiche non documentate**
2. **Hanno violato il loro stesso SDK ufficiale**
3. **Hanno dato la colpa prima ai commercianti**
4. **Hanno ammesso la colpa solo sotto pressione**

Anche dopo aver "risolto" il problema, i commercianti hanno segnalato:

> "Ho aggiornato l'SDK alla versione 1.7.4 e **il problema persiste.**"

### L'escalation del 2024: ancora in crisi {#the-2024-escalation-still-broken}

Recenti segnalazioni provenienti dalla community PayPal protetta mostrano che il problema è in realtà peggiorato. Un [Discussione di settembre 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archiviato](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) documenta esattamente gli stessi problemi:

> "Il problema ha iniziato a manifestarsi solo circa 2 settimane fa e non riguarda tutti gli ordini. **Il problema più comune sembra essere il codice 404 in fase di acquisizione.**"

Il commerciante descrive lo stesso schema riscontrato da Forward Email:

> "Dopo aver tentato di acquisire l'ordine, PayPal restituisce un errore 404. Durante il recupero dei dettagli dell'ordine: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Da parte nostra non c'è alcuna traccia di un'acquisizione avvenuta con successo.**"

### Disastro di affidabilità del webhook {#the-webhook-reliability-disaster}

Un altro [discussione della comunità preservata](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) rivela che il sistema webhook di PayPal è fondamentalmente inaffidabile:

> "In teoria, dovrebbe avere due eventi (CHECKOUT.ORDER.APPROVED e PAYMENT.CAPTURE.COMPLETED) dall'evento Webhook. In realtà,**questi due eventi raramente vengono ricevuti immediatamente, PAYMENT.CAPTURE.COMPLETED non può essere ricevuto nella maggior parte dei casi o lo sarebbe in poche ore.**"

Per i pagamenti degli abbonamenti:

> "**'PAYMENT.SALE.COMPLETED' a volte non veniva ricevuto, o lo faceva solo dopo poche ore.**"

Le domande del commerciante rivelano la gravità dei problemi di affidabilità di PayPal:

1. **"Perché succede questo?"** - Il sistema webhook di PayPal è fondamentalmente inutilizzabile
2. **"Se lo stato dell'ordine è 'COMPLETO', posso dedurre di aver ricevuto il denaro?"** - I commercianti non si fidano delle risposte API di PayPal
3. **"Perché 'Registri eventi -> Eventi webhook' non riesce a trovare alcun registro?"** - Anche il sistema di registrazione di PayPal non funziona

### Il modello di negligenza sistematica {#the-pattern-of-systematic-negligence}

Le prove coprono un periodo di oltre 11 anni e mostrano uno schema chiaro:

* **2013**: "PayPal ci sta lavorando"
* **2016**: PayPal ammette la modifica che ha causato problemi e fornisce una correzione
* **2024**: Si verificano ancora gli stessi identici errori, che interessano Forward Email e innumerevoli altri

Non si tratta di un bug, ma di **negligenza sistematica**. PayPal è a conoscenza di questi errori critici nell'elaborazione dei pagamenti da oltre un decennio e ha costantemente:

1. **Incolpati i commercianti per i bug di PayPal**
2. **Apportati cambiamenti non documentati**
3. **Forniti correzioni inadeguate e non funzionanti**
4. **Ignorati l'impatto finanziario sulle aziende**
5. **Prove nascoste rimuovendo i forum della community**

### Il requisito non documentato {#the-undocumented-requirement}

Nella documentazione ufficiale di PayPal non si menziona in alcun modo che i commercianti debbano implementare una logica di retry per le operazioni di acquisizione. La documentazione afferma che i commercianti dovrebbero "acquisire immediatamente dopo l'approvazione", ma non menziona che la loro API restituisce casualmente errori 404 che richiedono complessi meccanismi di retry.

Ciò obbliga ogni commerciante a:

* Implementare una logica di ripetizione del backoff esponenziale
* Gestire la distribuzione incoerente dei webhook
* Creare sistemi complessi di gestione dello stato
* Monitorare manualmente le acquisizioni non riuscite

**Tutti gli altri processori di pagamento forniscono API di acquisizione affidabili che funzionano fin dal primo tentativo.**

## Il modello più ampio di inganno di PayPal {#paypals-broader-pattern-of-deception}

Il disastro del bug di acquisizione è solo un esempio dell'approccio sistematico di PayPal per ingannare i clienti e nascondere i propri fallimenti.

### Azione del Dipartimento dei servizi finanziari di New York {#the-new-york-department-of-financial-services-action}

Nel gennaio 2025, il Dipartimento dei servizi finanziari di New York ha emesso un [azione esecutiva contro PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) per pratiche ingannevoli, dimostrando che il modello di inganno di PayPal si estende ben oltre le sue API.

Questa azione normativa dimostra la volontà di PayPal di mettere in atto pratiche ingannevoli in tutti i suoi aspetti aziendali, non solo nei suoi strumenti per sviluppatori.

### La causa Honey: riscrivere i link di affiliazione {#the-honey-lawsuit-rewriting-affiliate-links}

L'acquisizione di Honey da parte di PayPal ha portato a [cause legali che sostengono che Honey riscrive i link di affiliazione](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), il furto di commissioni da parte di creatori di contenuti e influencer. Questa rappresenta un'altra forma di inganno sistematico in cui PayPal trae profitto reindirizzando entrate che dovrebbero essere destinate ad altri.

Lo schema è chiaro:

1. **Errori API**: nascondere funzionalità non funzionanti e dare la colpa ai commercianti
2. **Silenziamento della community**: rimuovere le prove dei problemi
3. **Violazioni normative**: adottare pratiche ingannevoli
4. **Furto di affiliazione**: rubare commissioni tramite manipolazione tecnica

### Il costo della negligenza di PayPal {#the-cost-of-paypals-negligence}

La perdita di 1.899 dollari di Forward Email rappresenta solo la punta dell'iceberg. Consideriamo l'impatto più ampio:

* **Commercianti individuali**: Migliaia di persone perdono centinaia o migliaia di dollari ciascuno
* **Clienti aziendali**: Potenzialmente milioni di dollari di mancati guadagni
* **Tempo di sviluppo**: Innumerevoli ore dedicate alla creazione di soluzioni alternative per le API non funzionanti di PayPal
* **Fiducia dei clienti**: Aziende che perdono clienti a causa di errori di pagamento di PayPal

Se un piccolo servizio di posta elettronica perdesse quasi 2.000 dollari e questo problema persistesse da oltre 11 anni e colpisse migliaia di commercianti, il danno finanziario complessivo ammonterebbe probabilmente a **centinaia di milioni di dollari**.

### La bugia della documentazione {#the-documentation-lie}

La documentazione ufficiale di PayPal omette sistematicamente di menzionare le limitazioni critiche e i bug che i commercianti incontreranno. Ad esempio:

* **API di acquisizione**: Nessuna menzione del fatto che gli errori 404 sono comuni e richiedono una logica di ripetizione
* **Affidabilità dei webhook**: Nessuna menzione del fatto che i webhook sono spesso ritardati di ore
* **Elenco delle sottoscrizioni**: La documentazione implica che l'elenco è possibile quando non esiste alcun endpoint
* **Timeout di sessione**: Nessuna menzione di timeout aggressivi di 60 secondi

Questa sistematica omissione di informazioni critiche costringe i commercianti a scoprire i limiti di PayPal attraverso tentativi ed errori nei sistemi di produzione, con conseguenti perdite finanziarie.

## Cosa significa questo per gli sviluppatori {#what-this-means-for-developers}

La sistematica incapacità di PayPal di soddisfare le esigenze di base degli sviluppatori, pur raccogliendo un feedback esaustivo, dimostra un problema organizzativo fondamentale. Considerano la raccolta di feedback un sostituto dell'effettiva risoluzione dei problemi.

Lo schema è chiaro:

1. Gli sviluppatori segnalano problemi
2. PayPal organizza sessioni di feedback con i dirigenti
3. Viene fornito un feedback esaustivo
4. I team riconoscono le lacune e promettono di "monitorare e risolvere"
5. Non viene implementato nulla
6. I dirigenti se ne vanno per aziende migliori
7. I nuovi team richiedono lo stesso feedback
8. Il ciclo si ripete

Nel frattempo, gli sviluppatori sono costretti a elaborare soluzioni alternative, a compromettere la sicurezza e a gestire interfacce utente non funzionanti solo per accettare pagamenti.

Se stai sviluppando un sistema di pagamento, impara dalla nostra esperienza: crea il tuo [approccio trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) con più processori, ma non aspettarti che PayPal fornisca le funzionalità di base di cui hai bisogno. Pianifica soluzioni alternative fin dal primo giorno.

> Questo post documenta la nostra esperienza di 11 anni con le API di PayPal su Forward Email. Tutti gli esempi di codice e i link provengono dai nostri sistemi di produzione effettivi. Continuiamo a supportare i pagamenti PayPal nonostante questi problemi, perché alcuni clienti non hanno altra scelta.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" classe="arrotondato-lg" />