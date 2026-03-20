# Il disastro API di PayPal durato 11 anni: come abbiamo costruito soluzioni alternative mentre ignoravano gli sviluppatori {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Successo! PayPal ha finalmente aggiunto l'endpoint `GET /v1/billing/subscriptions`.**
>
> Dopo aver pubblicato questo post e averlo inviato via email ai dirigenti di PayPal, i loro team hanno implementato l'endpoint tanto atteso per elencare gli abbonamenti. La modifica è apparsa da qualche parte tra il [25 giugno 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) e il [9 luglio 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Tuttavia, nello stile tipico di PayPal, non ci hanno mai avvisato. Abbiamo scoperto questo aggiornamento da soli solo a dicembre 2025, mesi dopo che la funzionalità era stata rilasciata silenziosamente.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="Illustrazione del disastro API di PayPal" class="rounded-lg" />

<p class="lead mt-3">Da Forward Email, ci confrontiamo con le API difettose di PayPal da oltre un decennio. Quello che è iniziato come un fastidio minore si è trasformato in un disastro completo che ci ha costretto a costruire soluzioni alternative, bloccare i loro modelli di phishing e infine interrompere tutti i pagamenti PayPal durante una migrazione critica dell'account.</p>
<p class="lead mt-3">Questa è la storia di 11 anni in cui PayPal ha ignorato le esigenze basilari degli sviluppatori mentre noi cercavamo in ogni modo di far funzionare la loro piattaforma.</p>


## Indice {#table-of-contents}

* [Il pezzo mancante: nessun modo per elencare gli abbonamenti](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: emerge il problema](#2014-2017-the-problem-emerges)
* [2020: diamo loro un feedback dettagliato](#2020-we-give-them-extensive-feedback)
  * [La lista di feedback con 27 punti](#the-27-item-feedback-list)
  * [I team si sono coinvolti, sono state fatte promesse](#teams-got-involved-promises-were-made)
  * [Il risultato? Niente.](#the-result-nothing)
* [L'esodo dei dirigenti: come PayPal ha perso tutta la memoria istituzionale](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: nuova leadership, stessi problemi](#2025-new-leadership-same-problems)
  * [Il nuovo CEO si coinvolge](#the-new-ceo-gets-involved)
  * [La risposta di Michelle Gill](#michelle-gills-response)
  * [La nostra risposta: niente più riunioni](#our-response-no-more-meetings)
  * [La risposta di Marty Brodbeck: sovraingegnerizzazione](#marty-brodbecks-overengineering-response)
  * [La contraddizione del "CRUD semplice"](#the-simple-crud-contradiction)
  * [Il disallineamento diventa chiaro](#the-disconnect-becomes-clear)
* [Anni di segnalazioni di bug ignorate](#years-of-bug-reports-they-ignored)
  * [2016: primi reclami su UI/UX](#2016-early-uiux-complaints)
  * [2021: segnalazione bug email aziendale](#2021-business-email-bug-report)
  * [2021: suggerimenti per migliorare l'interfaccia](#2021-ui-improvement-suggestions)
  * [2021: fallimenti dell'ambiente sandbox](#2021-sandbox-environment-failures)
  * [2021: sistema di report completamente rotto](#2021-reports-system-completely-broken)
  * [2022: funzione core API mancante (di nuovo)](#2022-core-api-feature-missing-again)
* [L'incubo dell'esperienza sviluppatore](#the-developer-experience-nightmare)
  * [Interfaccia utente difettosa](#broken-user-interface)
  * [Problemi con gli SDK](#sdk-problems)
  * [Violazioni della Content Security Policy](#content-security-policy-violations)
  * [Caos nella documentazione](#documentation-chaos)
  * [Vulnerabilità di sicurezza](#security-vulnerabilities)
  * [Disastro nella gestione delle sessioni](#session-management-disaster)
* [Luglio 2025: la goccia che fa traboccare il vaso](#july-2025-the-final-straw)
* [Perché non possiamo semplicemente abbandonare PayPal](#why-we-cant-just-drop-paypal)
* [La soluzione alternativa della comunità](#the-community-workaround)
* [Bloccare i modelli PayPal a causa del phishing](#blocking-paypal-templates-due-to-phishing)
  * [Il vero problema: i modelli PayPal sembrano truffe](#the-real-problem-paypals-templates-look-like-scams)
  * [La nostra implementazione](#our-implementation)
  * [Perché abbiamo dovuto bloccare PayPal](#why-we-had-to-block-paypal)
  * [La portata del problema](#the-scale-of-the-problem)
  * [L'ironia](#the-irony)
  * [Impatto reale: nuove truffe PayPal](#real-world-impact-novel-paypal-scams)
* [Il processo KYC al contrario di PayPal](#paypals-backwards-kyc-process)
  * [Come dovrebbe funzionare](#how-it-should-work)
  * [Come funziona realmente PayPal](#how-paypal-actually-works)
  * [L'impatto reale](#the-real-world-impact)
  * [Il disastro della migrazione account di luglio 2025](#the-july-2025-account-migration-disaster)
  * [Perché è importante](#why-this-matters)
* [Come fanno bene tutti gli altri processori di pagamento](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Lo standard del settore](#the-industry-standard)
  * [Cosa offrono gli altri processori rispetto a PayPal](#what-other-processors-provide-vs-paypal)
* [La copertura sistematica di PayPal: mettere a tacere 6 milioni di voci](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [La grande cancellazione](#the-great-erasure)
  * [Il salvataggio da terze parti](#the-third-party-rescue)
* [Il disastro del bug di cattura durato 11 anni: $1.899 e oltre](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [La perdita di $1.899 di Forward Email](#forward-emails-1899-loss)
  * [La segnalazione originale del 2013: oltre 11 anni di negligenza](#the-2013-original-report-11-years-of-negligence)
  * [L'ammissione del 2016: PayPal rompe il proprio SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [L'escalation del 2024: ancora rotto](#the-2024-escalation-still-broken)
  * [Il disastro dell'affidabilità dei webhook](#the-webhook-reliability-disaster)
  * [Il modello di negligenza sistematica](#the-pattern-of-systematic-negligence)
  * [Il requisito non documentato](#the-undocumented-requirement)
* [Il più ampio schema di inganno di PayPal](#paypals-broader-pattern-of-deception)
  * [L'azione del Dipartimento dei Servizi Finanziari di New York](#the-new-york-department-of-financial-services-action)
  * [La causa Honey: riscrivere i link affiliati](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Il costo della negligenza di PayPal](#the-cost-of-paypals-negligence)
  * [La menzogna della documentazione](#the-documentation-lie)
* [Cosa significa questo per gli sviluppatori](#what-this-means-for-developers)
## Il Pezzo Mancante: Nessun Modo per Elencare gli Abbonamenti {#the-missing-piece-no-way-to-list-subscriptions}

Ecco la cosa che ci lascia senza parole: PayPal ha avuto la fatturazione degli abbonamenti dal 2014, ma non ha mai fornito un modo per i commercianti di elencare i propri abbonamenti.

Pensateci un attimo. Puoi creare abbonamenti, puoi cancellarli se hai l'ID, ma non puoi ottenere una lista di tutti gli abbonamenti attivi per il tuo account. È come avere un database senza istruzione SELECT.

Ne abbiamo bisogno per operazioni aziendali di base:

* Supporto clienti (quando qualcuno invia un'email chiedendo informazioni sul proprio abbonamento)
* Report finanziari e riconciliazione
* Gestione automatizzata della fatturazione
* Conformità e auditing

Ma PayPal? Semplicemente... non l'ha mai costruito.


## 2014-2017: Il Problema Emergere {#2014-2017-the-problem-emerges}

Il problema della lista degli abbonamenti è apparso per la prima volta nei forum della community di PayPal nel 2017. Gli sviluppatori ponevano la domanda ovvia: "Come faccio a ottenere una lista di tutti i miei abbonamenti?"

La risposta di PayPal? Silenzio.

I membri della community hanno iniziato a frustrarsi:

> "Omissione molto strana se un commerciante non può elencare tutti gli Accordi attivi. Se l'ID dell'Accordo viene perso, significa che solo l'utente può cancellare o sospendere un accordo." - leafspider

> "+1. Sono passati quasi 3 anni." - laudukang (significando che il problema esisteva da circa il 2014)

Il [post originale della community](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) del 2017 mostra sviluppatori che implorano questa funzionalità di base. La risposta di PayPal è stata archiviare il repository dove le persone segnalavano il problema.


## 2020: Forniamo un Feedback Esteso {#2020-we-give-them-extensive-feedback}

Nell'ottobre 2020, PayPal ci ha contattato per una sessione formale di feedback. Non era una chiacchierata casuale - hanno organizzato una chiamata Microsoft Teams di 45 minuti con 8 dirigenti PayPal tra cui Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze e altri.

### La Lista di Feedback di 27 Punti {#the-27-item-feedback-list}

Eravamo preparati. Dopo 6 ore di tentativi di integrazione con le loro API, avevamo compilato 27 problemi specifici. Mark Stuart del team PayPal Checkout ha detto:

> Ehi Nick, grazie per aver condiviso con tutti oggi! Penso che questo sarà il catalizzatore per ottenere più supporto e investimenti per il nostro team per andare a risolvere queste cose. È stato difficile ottenere feedback ricchi come quello che ci hai lasciato finora.

Il feedback non era teorico - proveniva da tentativi reali di integrazione:

1. **Generazione del token di accesso non funzionante**:

> La generazione del token di accesso non funziona. Inoltre, dovrebbero esserci più esempi oltre a quelli in cURL.

2. **Nessuna interfaccia web per la creazione di abbonamenti**:

> Come diavolo si possono creare abbonamenti senza doverlo fare usando cURL? Non sembra esserci un'interfaccia web per farlo (come ha Stripe)

Mark Stuart ha trovato particolarmente preoccupante il problema del token di accesso:

> Di solito non sentiamo parlare di problemi riguardanti la generazione del token di accesso.

### I Team Sono Intervenuti, Sono State Fatte Promesse {#teams-got-involved-promises-were-made}

Man mano che scoprivamo più problemi, PayPal continuava ad aggiungere altri team alla conversazione. Darshan Raju del team di gestione UI degli abbonamenti si è unito e ha detto:

> Riconosciamo la lacuna. La tracceremo e la affronteremo. Grazie ancora per il tuo feedback!

La sessione è stata descritta come una:

> passeggiata sincera attraverso la tua esperienza

per:

> fare di PayPal ciò che dovrebbe essere per gli sviluppatori.

### Il Risultato? Niente. {#the-result-nothing}

Nonostante la sessione formale di feedback, la lista estesa di 27 punti, il coinvolgimento di più team e le promesse di:

> tracciare e affrontare

i problemi, non è stato risolto assolutamente nulla.


## L'Esodo dei Dirigenti: Come PayPal Ha Perso Tutta la Memoria Istituzionale {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Ecco dove diventa davvero interessante. Ogni singola persona che ha ricevuto il nostro feedback del 2020 ha lasciato PayPal:

**Cambiamenti nella Leadership:**

* [Dan Schulman (CEO per 9 anni) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (settembre 2023)
* [Sri Shivananda (CTO che ha organizzato il feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (gennaio 2024)
**Leader Tecnici Che Hanno Fatto Promesse, Poi Se Ne Sono Andati:**

* **Mark Stuart** (ha promesso che il feedback sarebbe stato un "catalizzatore") → [Ora in Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (veterano di PayPal da 18 anni) → [CEO di MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [In pensione](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (uno degli ultimi rimasti) → [Appena andato via per Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (gennaio 2025)

PayPal è diventata una porta girevole dove i dirigenti raccolgono feedback dagli sviluppatori, fanno promesse, poi se ne vanno per aziende migliori come JPMorgan, Ripple e altre fintech.

Questo spiega perché la risposta al problema su GitHub del 2025 sembrava completamente scollegata dal nostro feedback del 2020 - letteralmente tutti coloro che avevano ricevuto quel feedback hanno lasciato PayPal.


## 2025: Nuova Leadership, Stessi Problemi {#2025-new-leadership-same-problems}

Avanti veloce al 2025, e emerge lo stesso identico schema. Dopo anni senza progressi, la nuova leadership di PayPal ricontatta di nuovo.

### Il Nuovo CEO Si Impegna {#the-new-ceo-gets-involved}

Il 30 giugno 2025, abbiamo fatto un’escalation diretta al nuovo CEO di PayPal Alex Chriss. La sua risposta è stata breve:

> Ciao Nick – Grazie per averci contattato e per il feedback. Michelle (in copia) è responsabile con il suo team per impegnarsi e lavorare su questo con te. Grazie -A

### La Risposta di Michelle Gill {#michelle-gills-response}

Michelle Gill, EVP e General Manager di Small Business and Financial Services, ha risposto:

> Grazie mille Nick, sposto Alex in copia nascosta. Stiamo esaminando la questione dal tuo post precedente. Ti chiameremo prima della fine della settimana. Puoi per favore inviarmi i tuoi contatti così uno dei miei colleghi può mettersi in contatto? Michelle

### La Nostra Risposta: Niente Altre Riunioni {#our-response-no-more-meetings}

Abbiamo rifiutato un’altra riunione, spiegando la nostra frustrazione:

> Grazie. Tuttavia non credo che fare una chiamata porterà a qualcosa. Ecco perché... In passato ho fatto una chiamata e non è servita a nulla. Ho sprecato più di 2 ore del mio tempo parlando con tutto il team e la leadership e non è stato fatto nulla... Tonnellate di email avanti e indietro. Assolutamente niente fatto. Il feedback non è andato da nessuna parte. Ho provato per anni, sono stato ascoltato, e poi non è successo nulla.

### La Risposta di Marty Brodbeck con Troppa Complessità {#marty-brodbecks-overengineering-response}

Poi Marty Brodbeck, che guida l’ingegneria consumer di PayPal, ci ha contattato:

> Ciao Nick, sono Marty Brodbeck. Guida tutta l’ingegneria consumer qui a PayPal e ho guidato lo sviluppo delle API per l’azienda. Possiamo connetterci per parlare del problema che stai affrontando e come possiamo aiutarti.

Quando abbiamo spiegato il semplice bisogno di un endpoint per elencare gli abbonamenti, la sua risposta ha rivelato il problema esatto:

> Grazie Nick, siamo in fase di creazione di un’unica API per gli abbonamenti con SDK completo (supporta gestione completa degli errori, tracciamento degli abbonamenti basato su eventi, alta affidabilità) dove la fatturazione è anche separata come API a parte per i commercianti, invece di dover orchestrare più endpoint per ottenere una singola risposta.

Questo è esattamente l’approccio sbagliato. Non abbiamo bisogno di mesi di architettura complessa. Ci serve un semplice endpoint REST che elenchi gli abbonamenti - qualcosa che avrebbe dovuto esistere dal 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### La Contraddizione del "CRUD Semplice" {#the-simple-crud-contradiction}

Quando abbiamo fatto notare che questa è una funzionalità CRUD di base che avrebbe dovuto esistere dal 2014, la risposta di Marty è stata significativa:

> Le operazioni CRUD semplici fanno parte dell’API core amico mio, quindi non ci vorranno mesi di sviluppo

L’SDK TypeScript di PayPal, che attualmente supporta solo tre endpoint dopo mesi di sviluppo, insieme alla sua timeline storica, dimostra chiaramente che progetti del genere richiedono più di qualche mese per essere completati.
Questa risposta mostra che non comprende la propria API. Se "le semplici operazioni CRUD fanno parte dell'API principale," allora dov'è l'endpoint per l'elenco delle sottoscrizioni? Abbiamo risposto:

> Se 'le semplici operazioni CRUD fanno parte dell'API principale' allora dov'è l'endpoint per l'elenco delle sottoscrizioni? Gli sviluppatori chiedono questa 'semplice operazione CRUD' dal 2014. Sono passati 11 anni. Tutti gli altri processori di pagamento hanno avuto questa funzionalità di base fin dal primo giorno.

### Il Disallineamento Diventa Chiaro {#the-disconnect-becomes-clear}

Gli scambi del 2025 con Alex Chriss, Michelle Gill e Marty Brodbeck mostrano la stessa disfunzione organizzativa:

1. **La nuova leadership non ha conoscenza delle sessioni di feedback precedenti**
2. **Propongono le stesse soluzioni sovraingegnerizzate**
3. **Non comprendono i limiti della propria API**
4. **Vogliono più riunioni invece di risolvere semplicemente il problema**

Questo schema spiega perché i team di PayPal nel 2025 sembrano completamente disconnessi dall'ampio feedback fornito nel 2020 - le persone che hanno ricevuto quel feedback non ci sono più, e la nuova leadership sta ripetendo gli stessi errori.


## Anni di Segnalazioni di Bug Ignorate {#years-of-bug-reports-they-ignored}

Non ci siamo limitati a lamentarci delle funzionalità mancanti. Abbiamo attivamente segnalato bug e cercato di aiutarli a migliorare. Ecco una cronologia completa dei problemi documentati:

### 2016: Prime Lamentele su UI/UX {#2016-early-uiux-complaints}

Già nel 2016, ci rivolgevamo pubblicamente alla leadership di PayPal, incluso Dan Schulman, riguardo problemi di interfaccia e usabilità. Sono passati 9 anni, e gli stessi problemi di UI/UX persistono ancora oggi.

### 2021: Segnalazione Bug Email Aziendale {#2021-business-email-bug-report}

Nel marzo 2021, abbiamo segnalato che il sistema email aziendale di PayPal inviava notifiche di cancellazione errate. Il modello di email aveva variabili renderizzate in modo errato, mostrando messaggi confusi ai clienti.

Mark Stuart ha riconosciuto il problema:

> Grazie Nick! Passiamo in BCC. @Prasy, il tuo team è responsabile di questa e-mail o sa chi lo è? "Niftylettuce, LLC, non ti fattureremo più" mi fa pensare che ci sia un errore su chi è destinatario e sul contenuto dell'e-mail.

**Risultato**: Hanno effettivamente risolto questo problema! Mark Stuart ha confermato:

> Ho appena sentito dal team notifiche che il modello di e-mail è stato corretto e distribuito. Apprezzo che tu abbia segnalato il problema. Grazie!

Questo dimostra che POSSONO risolvere le cose quando vogliono - semplicemente scelgono di non farlo per la maggior parte dei problemi.

### 2021: Suggerimenti per il Miglioramento della UI {#2021-ui-improvement-suggestions}

Nel febbraio 2021, abbiamo fornito feedback dettagliati sulla UI della loro dashboard, in particolare sulla sezione "Attività Recenti PayPal":

> Penso che la dashboard su paypal.com, in particolare "Attività Recenti PayPal", debba essere migliorata. Non penso che dovreste mostrare le righe di stato "Creato" per i pagamenti ricorrenti da $0 - aggiunge solo molte righe extra e non si riesce a vedere facilmente a colpo d'occhio quanto reddito si sta generando per il giorno/gli ultimi giorni.

Mark Stuart l'ha inoltrato al team prodotti consumer:

> Grazie! Non sono sicuro di quale team sia responsabile per Attività, ma l'ho inoltrato al responsabile dei prodotti consumer per trovare il team corretto. Un pagamento ricorrente da $0,00 sembra un bug. Probabilmente dovrebbe essere filtrato.

**Risultato**: Mai risolto. La UI mostra ancora queste voci inutili da $0.

### 2021: Fallimenti nell'Ambiente Sandbox {#2021-sandbox-environment-failures}

Nel novembre 2021, abbiamo segnalato problemi critici con l'ambiente sandbox di PayPal:

* Le chiavi API segrete sandbox venivano cambiate e disabilitate casualmente
* Tutti gli account di test sandbox sono stati cancellati senza preavviso
* Messaggi di errore tentando di visualizzare i dettagli degli account sandbox
* Fallimenti intermittenti nel caricamento

> Per qualche motivo la mia chiave API segreta sandbox è stata cambiata ed è stata disabilitata. Inoltre tutti i miei vecchi account di test Sandbox sono stati cancellati.

> A volte si caricano e a volte no. È incredibilmente frustrante.

**Risultato**: Nessuna risposta, nessuna correzione. Gli sviluppatori affrontano ancora problemi di affidabilità della sandbox.

### 2021: Sistema di Report Completamente Rotto {#2021-reports-system-completely-broken}
A maggio 2021, abbiamo segnalato che il sistema di download di PayPal per i report delle transazioni era completamente rotto:

> Sembra che i download dei report non funzionino in questo momento e non funzionano da tutto il giorno. Inoltre probabilmente dovrebbero inviare una notifica via email se fallisce.

Abbiamo anche evidenziato il disastro nella gestione delle sessioni:

> Inoltre, se sei inattivo mentre sei loggato su PayPal per circa 5 minuti, vieni disconnesso. Quindi quando aggiorni di nuovo il pulsante accanto al report di cui vuoi controllare lo stato (dopo aver aspettato un'eternità), è una seccatura dover effettuare nuovamente il login.

Mark Stuart ha riconosciuto il problema del timeout della sessione:

> Ricordo che avevi segnalato questo in passato con la tua sessione che scadeva spesso e interrompeva il tuo flusso di sviluppo mentre passavi tra il tuo IDE e developer.paypal.com o la dashboard del commerciante, poi tornavi e venivi disconnesso di nuovo.

**Risultato**: I timeout delle sessioni sono ancora di 60 secondi. Il sistema dei report continua a fallire regolarmente.

### 2022: Funzionalità Core API Mancante (Ancora) {#2022-core-api-feature-missing-again}

A gennaio 2022, abbiamo nuovamente segnalato il problema della lista delle sottoscrizioni, questa volta con ancora più dettagli su come la loro documentazione fosse errata:

> Non esiste un GET che elenchi tutte le sottoscrizioni (precedentemente chiamate accordi di fatturazione)

Abbiamo scoperto che la loro documentazione ufficiale era completamente inaccurata:

> Anche la documentazione API è totalmente inaccurata. Pensavamo di poter fare un workaround scaricando una lista hard-coded di ID sottoscrizioni. Ma neanche questo funziona!

> Dalla documentazione ufficiale qui... Dice che puoi fare questo... Ecco il punto cruciale - non c'è affatto nessun campo "Subscription ID" da trovare e selezionare.

Christina Monti di PayPal ha risposto:

> Ci scusiamo per le frustrazioni causate da questi passaggi errati, lo correggeremo questa settimana.

Sri Shivananda (CTO) ci ha ringraziato:

> Grazie per il vostro continuo aiuto nel renderci migliori. Molto apprezzato.

**Risultato**: La documentazione non è mai stata corretta. L'endpoint per la lista delle sottoscrizioni non è mai stato creato.


## L'incubo dell'esperienza sviluppatore {#the-developer-experience-nightmare}

Lavorare con le API di PayPal è come tornare indietro di 10 anni. Ecco i problemi tecnici che abbiamo documentato:

### Interfaccia utente rotta {#broken-user-interface}

La dashboard sviluppatori di PayPal è un disastro. Ecco cosa affrontiamo quotidianamente:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  L'interfaccia di PayPal è così rotta che non puoi nemmeno chiudere le notifiche
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Il tuo browser non supporta il tag video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  La dashboard sviluppatori ti fa letteralmente trascinare un cursore e poi ti disconnette dopo 60 secondi
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Il tuo browser non supporta il tag video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Altri disastri dell'interfaccia utente nella dashboard sviluppatori di PayPal che mostrano flussi di lavoro rotti
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Il tuo browser non supporta il tag video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  L'interfaccia di gestione delle sottoscrizioni - l'interfaccia è così pessima che abbiamo dovuto affidarci al codice per generare prodotti e piani di sottoscrizione
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="Screenshot delle sottoscrizioni PayPal" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Una vista dell'interfaccia delle sottoscrizioni rotta con funzionalità mancanti (non puoi creare facilmente prodotti/piani/sottoscrizioni – e non sembra esserci modo di eliminare prodotti né piani una volta creati nell'interfaccia)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="Screenshot delle sottoscrizioni PayPal 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Tipici messaggi di errore PayPal - criptici e poco utili
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problemi con l'SDK {#sdk-problems}

* Non riesce a gestire sia pagamenti una tantum che abbonamenti senza soluzioni complesse che prevedono lo scambio e il re-rendering dei pulsanti durante il ricaricamento dell'SDK con tag script
* L'SDK JavaScript viola le convenzioni di base (nomi delle classi in minuscolo, nessun controllo delle istanze)
* I messaggi di errore non indicano quali campi mancano
* Tipi di dati incoerenti (richiedendo importi come stringhe invece che numeri)

### Violazioni della Content Security Policy {#content-security-policy-violations}

Il loro SDK richiede unsafe-inline e unsafe-eval nella tua CSP, **costringendoti a compromettere la sicurezza del tuo sito**.

### Caos nella Documentazione {#documentation-chaos}

Lo stesso Mark Stuart ha ammesso:

> Concordo che ci sia una quantità assurda di API legacy e nuove. Davvero difficile trovare ciò che si cerca (anche per noi che lavoriamo qui).

### Vulnerabilità di Sicurezza {#security-vulnerabilities}

**L'implementazione 2FA di PayPal è al contrario**. Anche con le app TOTP abilitate, impongono la verifica via SMS - rendendo gli account vulnerabili ad attacchi di SIM swap. Se hai abilitato TOTP, dovrebbe essere usato esclusivamente. Il fallback dovrebbe essere l'email, non l'SMS.

### Disastro nella Gestione della Sessione {#session-management-disaster}

**Il loro pannello sviluppatore ti disconnette dopo 60 secondi di inattività**. Prova a fare qualcosa di produttivo e ti ritrovi continuamente a passare per: login → captcha → 2FA → logout → ripeti. Usi una VPN? Buona fortuna.


## Luglio 2025: La Goccia che ha fatto Traboccare il Vaso {#july-2025-the-final-straw}

Dopo 11 anni degli stessi problemi, il punto di rottura è arrivato durante una migrazione di account di routine. Dovevamo passare a un nuovo account PayPal per far corrispondere il nome della nostra azienda "Forward Email LLC" per una contabilità più pulita.

Quello che avrebbe dovuto essere semplice si è trasformato in un disastro completo:

* I test iniziali mostravano che tutto funzionava correttamente
* Ore dopo, PayPal ha improvvisamente bloccato tutti i pagamenti in abbonamento senza preavviso
* I clienti non potevano pagare, creando confusione e un carico di supporto
* Il supporto PayPal ha dato risposte contraddittorie affermando che gli account erano verificati
* Siamo stati costretti a fermare completamente i pagamenti PayPal

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  L'errore che i clienti vedevano tentando di pagare - nessuna spiegazione, nessun log, niente
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Il supporto PayPal che afferma che tutto andava bene mentre i pagamenti erano completamente bloccati. Il messaggio finale mostra che hanno detto di aver "ripristinato alcune funzionalità" ma chiedono ancora altre informazioni non specificate - il classico teatro del supporto PayPal
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
  Il processo di verifica dell'identità che presumibilmente "non ha risolto" nulla
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
  Messaggio vago e ancora nessuna risoluzione. Zero informazioni, avvisi o qualsiasi cosa su quali ulteriori informazioni siano richieste. Il supporto clienti tace.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Perché Non Possiamo Semplicemente Abbandonare PayPal {#why-we-cant-just-drop-paypal}

Nonostante tutti questi problemi, non possiamo abbandonare completamente PayPal perché alcuni clienti hanno solo PayPal come opzione di pagamento. Come ha detto un cliente sulla nostra [pagina di stato](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal è la mia unica opzione di pagamento

**Siamo bloccati a supportare una piattaforma difettosa perché PayPal ha creato un monopolio di pagamento per certi utenti.**


## La Soluzione della Comunità {#the-community-workaround}

Poiché PayPal non fornisce funzionalità di base per l'elenco degli abbonamenti, la comunità di sviluppatori ha creato soluzioni alternative. Abbiamo creato uno script che aiuta a gestire gli abbonamenti PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Questo script fa riferimento a un [gist della comunità](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) dove gli sviluppatori condividono soluzioni. Gli utenti ci stanno effettivamente [ringraziando](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) per aver fornito ciò che PayPal avrebbe dovuto costruire anni fa.


## Blocco dei Modelli PayPal a Causa del Phishing {#blocking-paypal-templates-due-to-phishing}

I problemi vanno oltre le API. I modelli email di PayPal sono così mal progettati che abbiamo dovuto implementare un filtro specifico nel nostro servizio email perché sono indistinguibili dai tentativi di phishing.

### Il Vero Problema: I Modelli PayPal Sembrano Truffe {#the-real-problem-paypals-templates-look-like-scams}

Riceviamo regolarmente segnalazioni di email PayPal che sembrano esattamente tentativi di phishing. Ecco un esempio reale dai nostri report di abuso:

**Oggetto:** `[Sandbox] TEST - Nuova fattura da PaypalBilling434567 sandbox #A4D369E8-0001`

Questa email è stata inoltrata a `abuse@microsoft.com` perché sembrava un tentativo di phishing. Il problema? Proveniva effettivamente dall'ambiente sandbox di PayPal, ma il loro design del modello è così scadente che attiva i sistemi di rilevamento phishing.

### La Nostra Implementazione {#our-implementation}

Puoi vedere il nostro filtro specifico per PayPal implementato nel nostro [codice di filtraggio email](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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
    'A causa dello spam massiccio di fatture PayPal, devi inviare manualmente un link alla fattura'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Perché Abbiamo Dovuto Bloccare PayPal {#why-we-had-to-block-paypal}

Abbiamo implementato questo perché PayPal si è rifiutata di risolvere i massicci problemi di spam/phishing/frode nonostante le nostre ripetute segnalazioni ai loro team di abuso. I tipi specifici di email che blocchiamo includono:

* **RT000238** - Notifiche di fatture sospette
* **PPC001017** - Conferme di pagamento problematiche
* **RT000542** - Tentativi di hack con messaggi regalo

### La Portata del Problema {#the-scale-of-the-problem}

I nostri log di filtraggio spam mostrano il volume enorme di spam di fatture PayPal che processiamo quotidianamente. Esempi di oggetti bloccati includono:

* "Fattura dal Team di Fatturazione PayPal:- Questo addebito sarà addebitato automaticamente dal tuo conto. Contattaci immediatamente al \[PHONE]"
* "Fattura da \[COMPANY NAME] (\[ORDER-ID])"
* Molteplici variazioni con numeri di telefono diversi e falsi ID ordine
Queste email spesso provengono da host `outlook.com` ma sembrano originare dai sistemi legittimi di PayPal, rendendole particolarmente pericolose. Le email superano l'autenticazione SPF, DKIM e DMARC perché vengono inviate tramite l'effettiva infrastruttura di PayPal.

I nostri log tecnici mostrano che queste email di spam contengono intestazioni PayPal legittime:

* `X-Email-Type-Id: RT000238` (lo stesso ID che blocchiamo)
* `From: "service@paypal.com" <service@paypal.com>`
* Firma DKIM valida da `paypal.com`
* Record SPF corretti che mostrano i server di posta di PayPal

Questo crea una situazione impossibile: email legittime di PayPal e spam hanno entrambe caratteristiche tecniche identiche.

### L'Ironia {#the-irony}

PayPal, un'azienda che dovrebbe essere in prima linea nella lotta contro le frodi finanziarie, ha modelli di email così mal progettati da attivare i sistemi anti-phishing. Siamo costretti a bloccare email legittime di PayPal perché sono indistinguibili dalle truffe.

Questo è documentato nella ricerca sulla sicurezza: [Attenzione alla nuova frode sull'indirizzo PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - che mostra come i sistemi di PayPal vengano sfruttati per frodi.

### Impatto nel Mondo Reale: Nuove Truffe PayPal {#real-world-impact-novel-paypal-scams}

Il problema va oltre il semplice design povero dei modelli. Il sistema di fatturazione di PayPal è così facilmente sfruttabile che i truffatori lo abusano regolarmente per inviare fatture fraudolente dall'aspetto legittimo. Il ricercatore di sicurezza Gavin Anderegg ha documentato [Una Nuova Truffa PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) in cui i truffatori inviano vere fatture PayPal che superano tutti i controlli di autenticazione:

> "Ispezionando la sorgente, l'email sembrava provenire effettivamente da PayPal (SPF, DKIM e DMARC tutti superati). Il pulsante puntava anche a quello che sembrava un URL legittimo di PayPal... Ci è voluto un attimo per rendermi conto che era un'email legittima. Mi era appena stata inviata una 'fattura' casuale da un truffatore."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Screenshot che mostra molteplici fatture PayPal fraudolente che inondano una casella di posta, tutte apparentemente legittime perché provengono effettivamente dai sistemi di PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="Screenshot avviso truffa PayPal" class="rounded-lg" />
</figure>

Il ricercatore ha osservato:

> "Sembra anche una funzionalità di comodità che PayPal dovrebbe considerare di bloccare. Ho subito pensato che fosse una qualche forma di truffa e mi interessavano solo i dettagli tecnici. Sembra troppo facile da realizzare, e temo che altri possano cascarci."

Questo illustra perfettamente il problema: i sistemi legittimi di PayPal sono così mal progettati da permettere frodi pur rendendo sospette le comunicazioni legittime.

A peggiorare le cose, questo ha influenzato la nostra deliverability con Yahoo, causando reclami da parte dei clienti e ore di test meticolosi e controllo dei pattern.


## Il Processo KYC Invertito di PayPal {#paypals-backwards-kyc-process}

Uno degli aspetti più frustranti della piattaforma PayPal è il loro approccio invertito alla conformità e alle procedure Know Your Customer (KYC). A differenza di ogni altro processore di pagamenti, PayPal permette agli sviluppatori di integrare le loro API e iniziare a raccogliere pagamenti in produzione prima di completare la verifica appropriata.

### Come Dovrebbe Funzionare {#how-it-should-work}

Ogni processore di pagamenti legittimo segue questa sequenza logica:

1. **Completare prima la verifica KYC**
2. **Approvare l'account commerciante**
3. **Fornire accesso API in produzione**
4. **Consentire la raccolta dei pagamenti**

Questo protegge sia il processore di pagamenti che il commerciante assicurando la conformità prima che avvengano transazioni.

### Come Funziona Davvero PayPal {#how-paypal-actually-works}

Il processo di PayPal è completamente invertito:

1. **Fornire immediatamente accesso API in produzione**
2. **Consentire la raccolta pagamenti per ore o giorni**
3. **Bloccare improvvisamente i pagamenti senza preavviso**
4. **Richiedere documentazione KYC dopo che i clienti sono già stati coinvolti**
5. **Non fornire alcuna notifica al commerciante**
6. **Lasciare che siano i clienti a scoprire il problema e segnalarlo**
### L'impatto nel mondo reale {#the-real-world-impact}

Questo processo inverso crea disastri per le aziende:

* **I clienti non possono completare gli acquisti** durante i periodi di vendita di punta
* **Nessun avviso anticipato** che la verifica è necessaria
* **Nessuna notifica via email** quando i pagamenti vengono bloccati
* **I commercianti vengono a sapere dei problemi dai clienti confusi**
* **Perdita di ricavi** durante periodi critici per l'attività
* **Danno alla fiducia dei clienti** quando i pagamenti falliscono misteriosamente

### Il disastro della migrazione degli account di luglio 2025 {#the-july-2025-account-migration-disaster}

Questo scenario esatto si è verificato durante la nostra routine migrazione degli account a luglio 2025. PayPal ha permesso inizialmente che i pagamenti funzionassero, poi li ha improvvisamente bloccati senza alcuna notifica. Abbiamo scoperto il problema solo quando i clienti hanno iniziato a segnalare che non riuscivano a pagare.

Quando abbiamo contattato l'assistenza, abbiamo ricevuto risposte contraddittorie su quali documenti fossero necessari, senza una tempistica chiara per la risoluzione. Questo ci ha costretto a bloccare completamente i pagamenti PayPal, confondendo i clienti che non avevano altre opzioni di pagamento.

### Perché è importante {#why-this-matters}

L'approccio di PayPal alla conformità mostra una fondamentale incomprensione di come operano le aziende. La corretta KYC dovrebbe avvenire **prima** dell'integrazione in produzione, non dopo che i clienti stanno già cercando di pagare. La mancanza di comunicazione proattiva quando sorgono problemi dimostra il distacco di PayPal dalle esigenze dei commercianti.

Questo processo inverso è sintomatico dei problemi organizzativi più ampi di PayPal: danno priorità ai loro processi interni rispetto all'esperienza di commercianti e clienti, portando a disastri operativi che allontanano le aziende dalla loro piattaforma.


## Come fanno bene tutti gli altri processori di pagamento {#how-every-other-payment-processor-does-it-right}

La funzionalità di elenco delle sottoscrizioni che PayPal si rifiuta di implementare è uno standard del settore da oltre un decennio. Ecco come gli altri processori di pagamento gestiscono questo requisito di base:

### Stripe {#stripe}

Stripe ha l'elenco delle sottoscrizioni fin dal lancio della loro API. La loro documentazione mostra chiaramente come recuperare tutte le sottoscrizioni per un cliente o un account commerciante. Questo è considerato funzionalità CRUD di base.

### Paddle {#paddle}

Paddle fornisce API complete per la gestione delle sottoscrizioni, inclusi elenco, filtro e paginazione. Capiscono che i commercianti devono vedere i loro flussi di entrate ricorrenti.

### Coinbase Commerce {#coinbase-commerce}

Anche i processori di pagamento in criptovalute come Coinbase Commerce offrono una gestione delle sottoscrizioni migliore di PayPal.

### Square {#square}

L'API di Square include l'elenco delle sottoscrizioni come funzionalità fondamentale, non come ripensamento.

### Lo standard del settore {#the-industry-standard}

Ogni processore di pagamento moderno fornisce:

* Elenco di tutte le sottoscrizioni
* Filtro per stato, data, cliente
* Paginazione per grandi dataset
* Notifiche webhook per modifiche alle sottoscrizioni
* Documentazione completa con esempi funzionanti

### Cosa forniscono gli altri processori vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Elenca tutte le sottoscrizioni:**

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

**PayPal - Quello che ottieni realmente:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Puoi ottenere SOLO UNA sottoscrizione se conosci già l'ID
# NON esiste un endpoint per elencare tutte le sottoscrizioni
# NON c'è modo di cercare o filtrare
# Devi tenere traccia di tutti gli ID delle sottoscrizioni da solo
```

**Endpoint disponibili di PayPal:**

* `POST /v1/billing/subscriptions` - Crea una sottoscrizione
* `GET /v1/billing/subscriptions/{id}` - Ottieni UNA sottoscrizione (se conosci l'ID)
* `PATCH /v1/billing/subscriptions/{id}` - Aggiorna una sottoscrizione
* `POST /v1/billing/subscriptions/{id}/cancel` - Annulla sottoscrizione
* `POST /v1/billing/subscriptions/{id}/suspend` - Sospendi sottoscrizione
**Cosa Manca in PayPal:**

* ❌ Nessun `GET /v1/billing/subscriptions` (elenca tutti)
* ❌ Nessuna funzionalità di ricerca
* ❌ Nessun filtro per stato, cliente, data
* ❌ Nessun supporto per la paginazione

PayPal è l'unico grande processore di pagamenti che costringe gli sviluppatori a tracciare manualmente gli ID delle sottoscrizioni nei propri database.


## La Copertura Sistemica di PayPal: Zittire 6 Milioni di Voci {#paypals-systematic-cover-up-silencing-6-million-voices}

In una mossa che incarna perfettamente l'approccio di PayPal nel gestire le critiche, hanno recentemente messo offline l'intero forum della loro community, zittendo efficacemente oltre 6 milioni di membri e cancellando centinaia di migliaia di post che documentavano i loro fallimenti.

### La Grande Cancellazione {#the-great-erasure}

La Community originale di PayPal su `paypal-community.com` ospitava **6.003.558 membri** e conteneva centinaia di migliaia di post, segnalazioni di bug, reclami e discussioni sui fallimenti dell'API di PayPal. Questo rappresentava oltre un decennio di prove documentate dei problemi sistematici di PayPal.

Il 30 giugno 2025, PayPal ha silenziosamente messo offline l'intero forum. Tutti i link `paypal-community.com` ora restituiscono errori 404. Non si è trattato di una migrazione o di un aggiornamento.

### Il Salvataggio di Terze Parti {#the-third-party-rescue}

Fortunatamente, un servizio di terze parti su [ppl.lithium.com](https://ppl.lithium.com/) ha preservato parte dei contenuti, permettendoci di accedere alle discussioni che PayPal ha cercato di nascondere. Tuttavia, questa conservazione da parte di terzi è incompleta e potrebbe scomparire in qualsiasi momento.

Questo schema di nascondere le prove non è nuovo per PayPal. Hanno una storia documentata di:

* Rimuovere segnalazioni critiche di bug dalla vista pubblica
* Discontinuare strumenti per sviluppatori senza preavviso
* Cambiare API senza una documentazione adeguata
* Zittire le discussioni della community sui loro fallimenti

La chiusura del forum rappresenta il tentativo più sfacciato finora di nascondere i loro fallimenti sistematici al pubblico.


## Il Disastro del Bug di Cattura di 11 Anni: $1.899 e Oltre {#the-11-year-capture-bug-disaster-1899-and-counting}

Mentre PayPal era impegnato a organizzare sessioni di feedback e fare promesse, il loro sistema principale di elaborazione pagamenti è stato fondamentalmente rotto per oltre 11 anni. Le prove sono devastanti.

### La Perdita di $1.899 di Forward Email {#forward-emails-1899-loss}

Nei nostri sistemi di produzione, abbiamo scoperto 108 pagamenti PayPal per un totale di **$1.899** persi a causa dei fallimenti di cattura di PayPal. Questi pagamenti mostrano un modello coerente:

* Sono stati ricevuti webhook `CHECKOUT.ORDER.APPROVED`
* L'API di cattura di PayPal ha restituito errori 404
* Gli ordini sono diventati inaccessibili tramite l'API di PayPal

È impossibile determinare se i clienti siano stati addebitati poiché PayPal nasconde completamente i log di debug dopo 14 giorni e cancella tutti i dati dal dashboard per gli ID ordine non catturati.

Questo rappresenta solo un'attività commerciale. **Le perdite collettive tra migliaia di commercianti in oltre 11 anni probabilmente ammontano a milioni di dollari.**

**Lo ribadiamo: le perdite collettive tra migliaia di commercianti in oltre 11 anni probabilmente ammontano a milioni di dollari.**

L'unico motivo per cui abbiamo scoperto questo è perché siamo incredibilmente meticolosi e guidati dai dati.

### Il Rapporto Originale del 2013: Oltre 11 Anni di Negligenza {#the-2013-original-report-11-years-of-negligence}

La prima segnalazione documentata di questo esatto problema appare su [Stack Overflow nel novembre 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archiviato](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Continuo a ricevere errore 404 con Rest API durante una cattura"

L'errore segnalato nel 2013 è **identico** a quello che Forward Email ha sperimentato nel 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

La risposta della community nel 2013 era eloquente:

> "Al momento c'è un problema segnalato con la REST API. PayPal ci sta lavorando."
**Oltre 11 anni dopo, stanno ancora "lavorando per risolverlo."**

### L'ammissione del 2016: PayPal rompe il proprio SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

Nel 2016, il repository GitHub ufficiale di PayPal documentava [gravi fallimenti nelle catture](https://github.com/paypal/PayPal-PHP-SDK/issues/660) che interessavano il loro SDK PHP ufficiale. La portata era impressionante:

> "Dal 20/09/2016, tutti i tentativi di cattura PayPal falliscono con 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. Non è stato cambiato nulla tra il 19/09 e il 20/09 nell'integrazione API. **Il 100% dei tentativi di cattura dal 20/09 ha restituito questo errore.**"

Un commerciante ha riferito:

> "Ho avuto **oltre 1.400 tentativi di cattura falliti nelle ultime 24 ore**, tutti con la risposta di errore INVALID_RESOURCE_ID."

La risposta iniziale di PayPal è stata di incolpare il commerciante e indirizzarlo al supporto tecnico. Solo dopo una forte pressione hanno ammesso la colpa:

> "Ho un aggiornamento dai nostri sviluppatori di prodotto. Notano negli header inviati che il PayPal-Request-ID viene inviato con 42 caratteri, ma **sembra che un cambiamento recente abbia limitato questo ID a soli 38 caratteri.**"

Questa ammissione rivela la negligenza sistematica di PayPal:

1. **Hanno fatto cambiamenti incompatibili non documentati**
2. **Hanno rotto il loro SDK ufficiale**
3. **Hanno incolpato prima i commercianti**
4. **Hanno ammesso la colpa solo sotto pressione**

Anche dopo aver "risolto" il problema, i commercianti hanno riferito:

> "Aggiornato l'SDK alla v1.7.4 e **il problema si verifica ancora.**"

### L'escalation del 2024: ancora rotto {#the-2024-escalation-still-broken}

Segnalazioni recenti dalla community PayPal conservata mostrano che il problema è effettivamente peggiorato. Una [discussione di settembre 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archiviata](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) documenta gli stessi identici problemi:

> "Il problema è iniziato a manifestarsi solo circa 2 settimane fa e non interessa tutti gli ordini. **Il problema molto più comune sembra essere i 404 sulle catture.**"

Il commerciante descrive lo stesso schema vissuto da Forward Email:

> "Dopo aver tentato di catturare l'ordine, PayPal restituisce un 404. Quando si recuperano i dettagli dell'ordine: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Questo senza alcuna traccia di una cattura riuscita da parte nostra.**"

### Il disastro dell'affidabilità dei webhook {#the-webhook-reliability-disaster}

Un'altra [discussione della community conservata](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) rivela che il sistema webhook di PayPal è fondamentalmente inaffidabile:

> "Teoricamente, dovrebbe esserci un doppio evento (CHECKOUT.ORDER.APPROVED e PAYMENT.CAPTURE.COMPLETED) dagli eventi Webhook. In realtà, **questi due eventi raramente vengono ricevuti immediatamente, PAYMENT.CAPTURE.COMPLETED spesso non viene ricevuto o arriva dopo alcune ore.**"

Per i pagamenti in abbonamento:

> "**'PAYMENT.SALE.COMPLETED' a volte non viene ricevuto o arriva solo dopo alcune ore.**"

Le domande del commerciante rivelano la profondità dei problemi di affidabilità di PayPal:

1. **"Perché succede questo?"** - Il sistema webhook di PayPal è fondamentalmente rotto
2. **"Se lo stato dell'ordine è 'COMPLETED', posso considerare di aver ricevuto il denaro?"** - I commercianti non possono fidarsi delle risposte API di PayPal
3. **"Perché in 'Event Logs->Webhook Events' non si trovano log?"** - Anche il sistema di logging di PayPal non funziona

### Il modello di negligenza sistematica {#the-pattern-of-systematic-negligence}

Le prove coprono oltre 11 anni e mostrano un chiaro schema:

* **2013**: "PayPal ci sta lavorando"
* **2016**: PayPal ammette un cambiamento incompatibile, fornisce una correzione difettosa
* **2024**: Gli stessi identici errori si verificano ancora, colpendo Forward Email e innumerevoli altri

Non si tratta di un bug - **questa è negligenza sistematica.** PayPal è a conoscenza di questi gravi fallimenti nel processo di pagamento da oltre un decennio e ha costantemente:
1. **Incolpato i commercianti per i bug di PayPal**  
2. **Effettuato modifiche non documentate e incompatibili**  
3. **Fornito correzioni inadeguate che non funzionano**  
4. **Ignorato l'impatto finanziario sulle aziende**  
5. **Nascosto le prove rimuovendo i forum della community**  

### Il Requisito Non Documentato {#the-undocumented-requirement}  

Da nessuna parte nella documentazione ufficiale di PayPal si menziona che i commercianti devono implementare una logica di retry per le operazioni di capture. La loro documentazione afferma che i commercianti dovrebbero "effettuare la capture immediatamente dopo l'approvazione", ma non menziona che la loro API restituisce casualmente errori 404 che richiedono meccanismi di retry complessi.  

Questo costringe ogni commerciante a:  

* Implementare una logica di retry con backoff esponenziale  
* Gestire la consegna incoerente dei webhook  
* Costruire sistemi complessi di gestione dello stato  
* Monitorare manualmente le capture fallite  

**Tutti gli altri processori di pagamento forniscono API di capture affidabili che funzionano al primo tentativo.**  


## Il Modello Più Ampio di Inganno di PayPal {#paypals-broader-pattern-of-deception}  

Il disastro del bug della capture è solo un esempio dell'approccio sistematico di PayPal nel ingannare i clienti e nascondere i propri fallimenti.  

### L'Azione del Dipartimento dei Servizi Finanziari di New York {#the-new-york-department-of-financial-services-action}  

Nel gennaio 2025, il Dipartimento dei Servizi Finanziari di New York ha emesso un'[azione di enforcement contro PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf)' per pratiche ingannevoli, dimostrando che il modello di inganno di PayPal si estende ben oltre le loro API.  

Questa azione regolatoria mostra la disponibilità di PayPal a impegnarsi in pratiche ingannevoli in tutto il loro business, non solo nei loro strumenti per sviluppatori.  

### La Causa Honey: Riscrittura dei Link di Affiliazione {#the-honey-lawsuit-rewriting-affiliate-links}  

L'acquisizione di Honey da parte di PayPal ha portato a [cause legali che accusano Honey di riscrivere i link di affiliazione](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), rubando commissioni a creatori di contenuti e influencer. Questo rappresenta un'altra forma di inganno sistematico in cui PayPal trae profitto reindirizzando entrate che dovrebbero andare ad altri.  

Il modello è chiaro:  

1. **Fallimenti API**: Nascondere funzionalità rotte, incolpare i commercianti  
2. **Silenziare la community**: Rimuovere le prove dei problemi  
3. **Violazioni regolatorie**: Impegnarsi in pratiche ingannevoli  
4. **Furto di affiliazioni**: Rubare commissioni tramite manipolazioni tecniche  

### Il Costo della Negligenza di PayPal {#the-cost-of-paypals-negligence}  

La perdita di $1,899 di Forward Email rappresenta solo la punta dell'iceberg. Considera l'impatto più ampio:  

* **Commercianti individuali**: Migliaia che perdono da centinaia a migliaia di dollari ciascuno  
* **Clienti enterprise**: Potenzialmente milioni di entrate perse  
* **Tempo degli sviluppatori**: Innumerevoli ore spese a costruire soluzioni alternative per le API rotte di PayPal  
* **Fiducia dei clienti**: Aziende che perdono clienti a causa dei fallimenti nei pagamenti di PayPal  

Se un piccolo servizio email ha perso quasi $2,000, e questo problema esiste da oltre 11 anni colpendo migliaia di commercianti, il danno finanziario collettivo probabilmente ammonta a **centinaia di milioni di dollari**.  

### La Bugia della Documentazione {#the-documentation-lie}  

La documentazione ufficiale di PayPal non menziona mai le limitazioni critiche e i bug che i commercianti incontreranno. Per esempio:  

* **API di capture**: Nessuna menzione che gli errori 404 sono comuni e richiedono logica di retry  
* **Affidabilità dei webhook**: Nessuna menzione che i webhook spesso arrivano con ore di ritardo  
* **Elenco abbonamenti**: La documentazione implica che sia possibile elencare quando invece non esiste alcun endpoint  
* **Timeout di sessione**: Nessuna menzione dei timeout aggressivi di 60 secondi  

Questa omissione sistematica di informazioni critiche costringe i commercianti a scoprire le limitazioni di PayPal tramite tentativi ed errori in sistemi di produzione, spesso con conseguenti perdite finanziarie.  


## Cosa Significa Questo per gli Sviluppatori {#what-this-means-for-developers}  

Il fallimento sistematico di PayPal nel soddisfare le esigenze di base degli sviluppatori, pur raccogliendo ampi feedback, mostra un problema organizzativo fondamentale. Trattano la raccolta di feedback come un sostituto per la risoluzione effettiva dei problemi.
Il modello è chiaro:

1. Gli sviluppatori segnalano problemi  
2. PayPal organizza sessioni di feedback con i dirigenti  
3. Viene fornito un feedback approfondito  
4. I team riconoscono le lacune e promettono di "monitorare e risolvere"  
5. Nulla viene implementato  
6. I dirigenti lasciano per aziende migliori  
7. I nuovi team chiedono lo stesso feedback  
8. Il ciclo si ripete  

Nel frattempo, gli sviluppatori sono costretti a creare soluzioni alternative, compromettere la sicurezza e gestire interfacce utente difettose solo per accettare pagamenti.

Se stai costruendo un sistema di pagamento, impara dalla nostra esperienza: crea il tuo [approccio trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) con più processori, ma non aspettarti che PayPal fornisca le funzionalità di base di cui hai bisogno. Pianifica di costruire soluzioni alternative fin dal primo giorno.

> Questo post documenta la nostra esperienza di 11 anni con le API di PayPal su Forward Email. Tutti gli esempi di codice e i link provengono dai nostri sistemi di produzione reali. Continuiamo a supportare i pagamenti PayPal nonostante questi problemi perché alcuni clienti non hanno altra opzione

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="Illustrazione del disastro API di PayPal" class="rounded-lg" />
