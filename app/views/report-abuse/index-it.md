# Segnala Abusi {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Segnala abusi e spam a Forward Email" class="rounded-lg" />


## Indice {#table-of-contents}

* [Disclaimer](#disclaimer)
* [Come inviare una segnalazione di abuso](#how-to-submit-an-abuse-report)
* [Per il pubblico generale](#for-the-general-public)
* [Per le forze dell'ordine](#for-law-enforcement)
  * [Quali informazioni sono disponibili](#what-information-is-available)
  * [Quali informazioni non sono disponibili](#what-information-is-not-available)
  * [Forze dell'ordine con sede negli Stati Uniti](#law-enforcement-based-in-the-united-states)
  * [Forze dell'ordine con sede fuori dagli Stati Uniti](#law-enforcement-based-outside-of-the-united-states)
  * [Richieste di emergenza da parte delle forze dell'ordine](#law-enforcement-emergency-requests)
  * [Le richieste delle forze dell'ordine possono attivare notifiche sull'account](#law-enforcement-requests-may-trigger-account-notices)
  * [Richieste delle forze dell'ordine per preservare le informazioni](#law-enforcement-requests-to-preserve-information)
  * [Notifica di procedimenti legali alle forze dell'ordine](#law-enforcement-serving-process)


## Disclaimer {#disclaimer}

Si prega di fare riferimento ai nostri [Termini](/terms) come applicabili a livello del sito.


## Come inviare una segnalazione di abuso {#how-to-submit-an-abuse-report}

Esaminiamo le segnalazioni di abuso e gestiamo le richieste di informazioni per il [pubblico generale](#for-the-general-public) e le [forze dell'ordine](#for-law-enforcement) caso per caso via email.

Le segnalazioni di abuso e le richieste di informazioni riguardanti utenti, email, indirizzi IP e/o domini sono collettivamente indicate come "Account" di seguito.

I nostri indirizzi email per contattarci con la tua richiesta o segnalazione di abuso sono: `support@forwardemail.net`, `abuse@forwardemail.net` e `security@forwardemail.net`.

Si prega di inviare una copia a tutti questi indirizzi email se possibile, e di inviare anche email di promemoria se non rispondiamo entro 24-48+ ore.

Leggi le sezioni seguenti per ulteriori informazioni che potrebbero riguardarti.


## Per il pubblico generale {#for-the-general-public}

<u>**Se tu o qualcun altro siete in pericolo imminente, contattate immediatamente la polizia e i servizi di emergenza.**</u>

<u>**Dovresti cercare assistenza legale professionale per recuperare l'accesso perso al tuo Account o per aiutare a fermare un attore malevolo.**</u>

Se sei vittima di abusi da parte di un Account che utilizza il nostro servizio, inviaci la tua segnalazione via email all'indirizzo sopra indicato. Se il tuo Account è stato preso di mira da un attore malevolo (ad esempio, il tuo dominio è recentemente scaduto ed è stato registrato da un terzo e poi usato per abusi), inviaci una segnalazione via email all'indirizzo sopra con le informazioni esatte del tuo Account (ad esempio il nome del dominio). Possiamo aiutare a [shadow ban](https://en.wikipedia.org/wiki/Shadow_banning) l'Account dopo la convalida della tua precedente proprietà. Nota che non abbiamo l'autorità per aiutarti a recuperare l'accesso al tuo Account.

Il tuo rappresentante legale potrebbe consigliarti di contattare le forze dell'ordine, il proprietario del tuo Account (ad esempio il registrar del nome di dominio; il sito web dove hai registrato il nome di dominio) e/o indirizzarti alla [pagina ICANN sui domini persi](https://www.icann.org/resources/pages/lost-domain-names).


## Per le forze dell'ordine {#for-law-enforcement}

Per la maggior parte delle richieste, la nostra capacità di divulgare informazioni è regolata dal [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), e seguenti ("ECPA"). L'ECPA impone che divulghiamo determinate informazioni sugli utenti alle forze dell'ordine solo in risposta a specifici tipi di richieste legali, inclusi mandati di comparizione, ordini del tribunale e mandati di perquisizione.

Se sei un membro delle forze dell'ordine e stai cercando informazioni riguardanti un Account, le informazioni sull'Account così come l'intervallo di date e orari dovrebbero essere incluse nella tua richiesta. Non possiamo elaborare richieste troppo ampie e/o vaghe – questo per salvaguardare i dati e la fiducia dei nostri utenti, e soprattutto per mantenere i loro dati al sicuro.
Se la tua richiesta ci segnala una violazione dei nostri [Termini](/terms), la elaboreremo secondo le nostre migliori pratiche interne per la gestione degli abusi – nota che in alcuni casi ciò può comportare la sospensione e/o il ban dell'Account.

**Poiché non siamo un registrar di nomi di dominio**, se desideri ottenere informazioni storiche sui record DNS riguardanti un nome di dominio, dovresti contattare il registrar specifico del nome di dominio corrispondente. Servizi come [Security Trails]() possono fornire ricerche di record storici, ma informazioni più specifiche e accurate possono essere fornite dal registrar. Per determinare chi sono il registrar del nome di dominio e/o i proprietari dei nameserver DNS di un dominio, gli strumenti `dig` e `whois` possono essere utili (es. `whois example.com` o `dig example.com ns`). Puoi determinare se un Account è su un piano a pagamento o gratuito sul nostro servizio effettuando una ricerca dei record DNS (es. `dig example.com mx` e `dig example.com txt`). Se i record MX non restituiscono valori come `mx1.forwardemail.net` e `mx2.forwardemail.net`, allora il dominio non sta usando il nostro servizio. Se i record TXT restituiscono un indirizzo email in chiaro (es. `forward-email=user@example.com`), ciò indica la destinazione dell'indirizzo di inoltro email per un dominio. Se invece restituisce un valore come `forward-email-site-verification=XXXXXXXXXX`, ciò indica che è su un piano a pagamento e la configurazione di inoltro è memorizzata nel nostro database sotto l'ID `XXXXXXXXXX`. Per maggiori informazioni su come funziona il nostro servizio a livello DNS, ti invitiamo a consultare la nostra [FAQ](/faq).

### Quali informazioni sono disponibili {#what-information-is-available}

Ti invitiamo a consultare la sezione della nostra Informativa sulla Privacy relativa a [Informazioni Raccoglite](/privacy#information-collected). Gli Account possono rimuovere le proprie informazioni dal nostro sistema in conformità con le leggi sulla conservazione dei dati e sulla privacy; consulta la sezione della nostra Informativa sulla Privacy relativa a [Rimozione delle Informazioni](/privacy#information-removal). Ciò significa che le informazioni richieste potrebbero non essere disponibili al momento della richiesta a causa della cancellazione dell'Account.

### Quali informazioni non sono disponibili {#what-information-is-not-available}

Ti invitiamo a consultare la sezione della nostra Informativa sulla Privacy relativa a [Informazioni Non Raccoglite](/privacy#information-not-collected).

### Forze dell'ordine con sede negli Stati Uniti {#law-enforcement-based-in-the-united-states}

Con [eccezione delle emergenze](#law-enforcement-emergency-requests), condividiamo le informazioni dell'Account solo al ricevimento di una citazione valida, un ordine del tribunale ECPA degli Stati Uniti e/o un mandato di perquisizione.

Possiamo inoltre [notificare un Account](#law-enforcement-requests-may-trigger-account-notices) riguardo a una richiesta delle forze dell'ordine, a meno che la legge o un ordine del tribunale non ci proibiscano di farlo.

Se riceviamo una citazione valida, un ordine del tribunale ECPA e/o un mandato di perquisizione, forniremo le informazioni rilevanti e disponibili nel miglior modo possibile.

### Forze dell'ordine con sede al di fuori degli Stati Uniti {#law-enforcement-based-outside-of-the-united-states}

Richiediamo che le richieste per forze dell'ordine con sede al di fuori degli Stati Uniti siano servite tramite uno dei seguenti:

* Un tribunale degli Stati Uniti.
* Un'agenzia di applicazione della legge secondo le procedure di un [trattato di assistenza legale reciproca degli Stati Uniti](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Un ordine di un governo straniero soggetto a un accordo esecutivo che il Procuratore Generale degli Stati Uniti ha determinato e certificato al Congresso soddisfi i requisiti di [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Richieste di emergenza da parte delle forze dell'ordine {#law-enforcement-emergency-requests}

Come previsto dalla legge negli Stati Uniti (es. in conformità con [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) e [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), quando in buona fede e con verifica indipendente del richiedente – possiamo divulgare e condividere informazioni dell'Account con le forze dell'ordine senza citazione, ordine del tribunale ECPA e/o mandato di perquisizione quando riteniamo che farlo senza ritardo sia necessario per prevenire la morte o gravi lesioni fisiche.
Richiediamo che le richieste di dati di emergenza ("EDR") siano inviate via email e includano tutte le informazioni rilevanti al fine di garantire un processo tempestivo e accelerato.

Si noti che siamo consapevoli di sofisticati attacchi di spoofing, phishing e impersonificazione tramite email (ad esempio vedi [questo articolo di The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

La nostra politica per la gestione delle EDR è la seguente:

1. Ricercare in modo indipendente i metadati dell'intestazione email (ad esempio DKIM/SPF/DMARC) (o la loro assenza) per la verifica.

2. Fare il massimo sforzo in buona fede (con tentativi ripetuti se necessario) per contattare telefonicamente il richiedente – al fine di confermare l'autenticità della richiesta. Ad esempio, potremmo ricercare il sito `.gov` relativo alla giurisdizione da cui proviene la richiesta, e quindi chiamare l’ufficio dal numero di telefono ufficiale pubblicamente elencato per verificare la richiesta.

### Le richieste delle forze dell'ordine possono attivare notifiche sull'account {#law-enforcement-requests-may-trigger-account-notices}

Potremmo notificare un Account e fornire una copia di una richiesta delle forze dell'ordine relativa a esso, a meno che non siamo proibiti dalla legge o da un ordine del tribunale di farlo (ad esempio [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). In tali casi, se applicabile, potremmo notificare un Account quando l’ordine di non divulgazione è scaduto.

Se una richiesta di informazioni da parte delle forze dell'ordine è valida, allora [preserveremo le informazioni necessarie e richieste sull’Account](#law-enforcement-requests-to-preserve-information) e faremo un ragionevole tentativo di contattare il proprietario dell’Account tramite il suo indirizzo email registrato e verificato (ad esempio entro 7 giorni di calendario). Se riceviamo un’obiezione tempestiva (ad esempio entro 7 giorni di calendario), allora tratterremo la condivisione delle informazioni sull’Account e continueremo il processo legale come necessario.

### Richieste delle forze dell'ordine per preservare le informazioni {#law-enforcement-requests-to-preserve-information}

Onoreremo le richieste valide delle forze dell'ordine di preservare le informazioni riguardanti un Account secondo [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Si noti che la conservazione dei dati è limitata solo a quanto specificamente richiesto e attualmente disponibile.

### Notifica del procedimento da parte delle forze dell'ordine {#law-enforcement-serving-process}

Richiediamo che tutte le richieste valide delle forze dell'ordine ci forniscano un indirizzo email valido e funzionante al quale possiamo corrispondere e fornire le informazioni richieste elettronicamente.

Tutte le richieste devono essere inviate all’indirizzo email specificato in [Come inviare una segnalazione di abuso](#how-to-submit-an-abuse-report) sopra.

Tutte le richieste delle forze dell'ordine devono essere inviate su carta intestata dell’agenzia o del dipartimento (ad esempio come allegato PDF scansionato), da un indirizzo email ufficiale e pertinente, e firmate.

Se riguarda una [richiesta di emergenza](#law-enforcement-emergency-requests), si prega di scrivere "Richiesta di emergenza delle forze dell'ordine" nell’oggetto dell’email.

Si prega di notare che potrebbero volerci almeno due settimane per poter esaminare e rispondere alla vostra richiesta.
