# Segnala abuso {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" classe="arrotondato-lg" />

## Indice {#table-of-contents}

* [Disclaimer](#disclaimer)
* [Come inviare una segnalazione di abuso](#how-to-submit-an-abuse-report)
* [Per il grande pubblico](#for-the-general-public)
* [Per le forze dell'ordine](#for-law-enforcement)
  * [Quali informazioni sono disponibili](#what-information-is-available)
  * [Quali informazioni non sono disponibili](#what-information-is-not-available)
  * [Forze dell'ordine con sede negli Stati Uniti](#law-enforcement-based-in-the-united-states)
  * [Forze dell'ordine con sede al di fuori degli Stati Uniti](#law-enforcement-based-outside-of-the-united-states)
  * [Richieste di emergenza delle forze dell'ordine](#law-enforcement-emergency-requests)
  * [Le richieste delle forze dell'ordine possono attivare notifiche sull'account](#law-enforcement-requests-may-trigger-account-notices)
  * [Richieste delle forze dell'ordine per preservare le informazioni](#law-enforcement-requests-to-preserve-information)
  * [Processo di notifica alle forze dell'ordine](#law-enforcement-serving-process)

## Dichiarazione di non responsabilità {#disclaimer}

Si prega di fare riferimento al nostro [Termini](/terms) poiché si applica all'intero sito.

## Come inviare una segnalazione di abuso {#how-to-submit-an-abuse-report}

Esaminiamo le segnalazioni di abuso e gestiamo le richieste di informazioni per [pubblico in generale](#for-the-general-public) e [forze dell'ordine](#for-law-enforcement) caso per caso tramite e-mail.

Di seguito, le segnalazioni di abusi e le richieste di informazioni relative a utenti, e-mail, indirizzi IP e/o domini vengono collettivamente definite "Account".

Il nostro indirizzo email per contattarci con la tua richiesta o segnalazione di abuso è: `abuse@forwardemail.net`

Per ulteriori informazioni che potrebbero interessarti, leggi le sezioni seguenti.

## Per il grande pubblico {#for-the-general-public}

<u>**Se tu o qualcun altro siete in pericolo imminente, contattate immediatamente la polizia e i servizi di emergenza.**</u>

<u>**Dovresti rivolgerti a un consulente legale professionista per recuperare l'accesso al tuo Account o per aiutare a fermare un malintenzionato.**</u>

Se sei vittima di abuso da parte di un Account che utilizza il nostro servizio, ti preghiamo di inviarci la tua segnalazione via email all'indirizzo sopra indicato. Se il tuo Account è stato preso in carico da un malintenzionato (ad esempio, il tuo dominio è scaduto di recente ed è stato nuovamente registrato da una terza parte e poi utilizzato per abusi), ti preghiamo di inviarci una segnalazione via email all'indirizzo sopra indicato con le informazioni esatte del tuo Account (ad esempio, il tuo nome di dominio). Possiamo aiutarti a [divieto ombra](https://en.wikipedia.org/wiki/Shadow_banning) l'Account dopo la convalida della tua precedente proprietà. Tieni presente che non abbiamo l'autorità di aiutarti a riottenere l'accesso al tuo Account.

Il tuo rappresentante legale potrebbe consigliarti di contattare le forze dell'ordine, il titolare del tuo account (ad esempio il registrar del nome di dominio; il sito web in cui hai registrato il nome di dominio) e/o di rimandarti a [Pagina dell'ICANN sui domini persi](https://www.icann.org/resources/pages/lost-domain-names).

## Per le forze dell'ordine {#for-law-enforcement}

Per la maggior parte delle richieste, la nostra capacità di divulgare informazioni è regolata da [Legge sulla privacy delle comunicazioni elettroniche](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) e seguenti ("ECPA"). L'ECPA ci impone di divulgare determinate informazioni degli utenti alle forze dell'ordine solo in risposta a specifici tipi di richieste legali, tra cui citazioni in giudizio, ordinanze del tribunale e mandati di perquisizione.

Se sei un membro delle forze dell'ordine e desideri informazioni su un Account, ti preghiamo di includere nella tua richiesta le informazioni relative all'Account, nonché l'intervallo di data e ora. Non possiamo elaborare richieste eccessivamente generiche e/o vaghe: questo al fine di tutelare i dati e la fiducia dei nostri utenti e, soprattutto, per garantire la sicurezza dei loro dati.

Se la tua richiesta ci segnala una violazione del nostro [Termini](/terms), la elaboreremo secondo le nostre best practice interne per la gestione degli abusi. Tieni presente che in alcuni casi ciò potrebbe comportare la sospensione e/o il ban dell'account.

**Poiché non siamo un registrar di nomi di dominio**, se desideri cercare informazioni storiche sui record DNS relativi a un nome di dominio, contatta il registrar specifico corrispondente al dominio. Servizi come [Security Trails]() possono fornire una ricerca storica sui record, ma il registrar potrebbe fornire informazioni più specifiche e accurate. Per determinare chi è il registrar di nomi di dominio e/o i proprietari dei nameserver DNS di un dominio, possono essere utili gli strumenti `dig` e `whois` (ad esempio, `whois example.com` o `dig example.com ns`). Puoi determinare se un account ha un piano a pagamento o un piano gratuito del nostro servizio effettuando una ricerca dei record DNS (ad esempio, `dig example.com mx` e `dig example.com txt`). Se i record MX non restituiscono valori come `mx1.forwardemail.net` e `mx2.forwardemail.net`, il dominio non utilizza il nostro servizio. Se i record TXT restituiscono un indirizzo email in chiaro (ad esempio `forward-email=user@example.com`), questo indica la destinazione dell'indirizzo di inoltro email per un dominio. Se invece restituisce un valore come `forward-email-site-verification=XXXXXXXXXX`, significa che si tratta di un piano a pagamento e che la configurazione di inoltro è memorizzata nel nostro database con l'ID `whois`0. Per ulteriori informazioni sul funzionamento del nostro servizio a livello DNS, consultare la nostra guida `whois`1.

### Quali informazioni sono disponibili {#what-information-is-available}

Si prega di fare riferimento alla nostra sezione Informativa sulla privacy per [Informazioni raccolte](/privacy#information-collected). Gli account sono autorizzati a rimuovere le proprie informazioni dal nostro sistema in conformità con le leggi sulla conservazione dei dati e sulla privacy; si prega di fare riferimento alla nostra sezione Informativa sulla privacy per [Rimozione delle informazioni](/privacy#information-removal). Ciò significa che le informazioni richieste potrebbero non essere disponibili al momento della richiesta a causa dell'eliminazione dell'account.

### Quali informazioni non sono disponibili {#what-information-is-not-available}

Si prega di fare riferimento alla nostra sezione Informativa sulla privacy per [Informazioni non raccolte](/privacy#information-not-collected).

### Forze dell'ordine con sede negli Stati Uniti {#law-enforcement-based-in-the-united-states}

Con [eccezione delle emergenze](#law-enforcement-emergency-requests), condividiamo le informazioni dell'account solo dopo aver ricevuto una citazione in giudizio valida, un ordine del tribunale ECPA degli Stati Uniti e/o un mandato di perquisizione.

Potremmo inoltre [notificare un Account](#law-enforcement-requests-may-trigger-account-notices) in merito a una richiesta delle forze dell'ordine, a meno che ciò non ci venga proibito dalla legge o da un ordine del tribunale.

Se riceviamo una citazione in giudizio valida, un ordine del tribunale ECPA e/o un mandato di perquisizione, forniremo informazioni pertinenti e disponibili nel miglior modo possibile.

### Forze dell'ordine con sede al di fuori degli Stati Uniti {#law-enforcement-based-outside-of-the-united-states}

Richiediamo che le richieste vengano inoltrate alle forze dell'ordine con sede al di fuori degli Stati Uniti tramite uno dei seguenti canali:

* Un tribunale degli Stati Uniti.
* Un'agenzia esecutiva che opera secondo le procedure di [Trattato di mutua assistenza giudiziaria degli Stati Uniti](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Un ordine di un governo straniero soggetto a un accordo esecutivo che il Procuratore Generale degli Stati Uniti ha stabilito e certificato al Congresso soddisfa i requisiti di [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Richieste di emergenza delle forze dell'ordine {#law-enforcement-emergency-requests}

Come consentito dalla legge negli Stati Uniti (ad esempio, in conformità con [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)a%20un%20ente%20governativo%2C%20se%20il%20fornitore%2C%20in%20buona%2C%20ritiene%20che%20un'emergenza%20che%20coinvolge%20il%20pericolo%20di%20morte%20o%20gravi%20lesioni%20fisiche%20a%20qualsiasi%20persona%20richiede%20la%20divulgazione%20senza%20ritardo%20delle%20comunicazioni%20relative%20all'emergenza%3B%20o) e [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Eccezioni%20per%20la%20divulgazione%20dei%20record%20dei%20clienti.%E2%80%94Un%20fornitore%20descritto%20nella%20sottosezione%20\(a\)%20può%20divulgare%20un%20record%20o%20altre%20informazioni%20relative%20a%20un%20abbonato%20o%20cliente%20di%20tale%20servizio%20\(non%20compreso%20il%20contenuto%20delle%20comunicazioni%20coperte%20dalla%20sottosezione%20\(a\)\(1\)%20o%20\(a\)\(2\)\)%E2%80%94)), quando in buona fede e con verifica indipendente della richiedente – potremmo divulgare e condividere le informazioni dell'Account con le forze dell'ordine senza citazione in giudizio, ordine del tribunale ECPA e/o mandato di perquisizione quando riteniamo che sia necessario farlo senza indugio per prevenire morte o gravi lesioni fisiche.

Richiediamo che le richieste di dati di emergenza ("EDR") vengano inviate via e-mail e includano tutte le informazioni rilevanti per garantire un processo tempestivo e rapido.

Tieni presente che siamo a conoscenza di attacchi sofisticati di spoofing, phishing e impersonificazione tramite posta elettronica (ad esempio, vedere [questo articolo del The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

La nostra politica per l'elaborazione degli EDR è la seguente:

1. Ricercare in modo indipendente i metadati dell'intestazione dell'e-mail (ad esempio DKIM/SPF/DMARC) (o la loro assenza) per verificarli.

2. Faremo del nostro meglio, in buona fede (con ripetuti tentativi se necessario), per contattare telefonicamente il richiedente in modo indipendente, al fine di confermare l'autenticità della richiesta. Ad esempio, potremmo effettuare una ricerca sul sito web `.gov` relativo alla giurisdizione da cui proviene la richiesta e quindi chiamare l'ufficio dal numero di telefono ufficiale elencato pubblicamente per verificare la richiesta.

### Le richieste delle forze dell'ordine potrebbero attivare notifiche sull'account {#law-enforcement-requests-may-trigger-account-notices}

Potremmo informare un Account e fornirgli una copia di una richiesta delle forze dell'ordine che lo riguarda, a meno che non ci venga vietato dalla legge o da un ordine del tribunale (ad esempio, [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). In tali casi, se applicabile, potremmo informare un Account della scadenza dell'ordine di non divulgazione.

Se una richiesta di informazioni da parte delle forze dell'ordine è valida, [conservare le informazioni necessarie e richieste dell'account](#law-enforcement-requests-to-preserve-information) e faremo ogni ragionevole sforzo per contattare il titolare dell'Account tramite il suo indirizzo email registrato e verificato (ad esempio, entro 7 giorni di calendario). Se riceviamo un'obiezione tempestiva (ad esempio, entro 7 giorni di calendario), ci asterremo dal condividere le informazioni dell'Account e proseguiremo il procedimento legale, se necessario.

### Le forze dell'ordine richiedono di preservare le informazioni {#law-enforcement-requests-to-preserve-information}

Rispetteremo le richieste valide delle forze dell'ordine di conservare le informazioni relative a un Account in base a [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Si prega di notare che la conservazione dei dati è limitata a quanto specificamente richiesto e attualmente disponibile.

### Notifica del processo da parte delle forze dell'ordine {#law-enforcement-serving-process}

Richiediamo a tutte le richieste valide delle forze dell'ordine di fornirci un indirizzo email valido e funzionante con cui possiamo comunicare e a cui possiamo fornire elettronicamente le informazioni richieste.

Tutte le richieste dovranno essere inviate all'indirizzo email specificato sopra in [Come inviare una segnalazione di abuso](#how-to-submit-an-abuse-report).

Tutte le richieste delle forze dell'ordine devono essere inviate su carta intestata dell'agenzia o del dipartimento (ad esempio come allegato PDF scansionato), da un indirizzo e-mail ufficiale e pertinente e firmate.

Se si tratta di un [richiesta di emergenza](#law-enforcement-emergency-requests), scrivere "Richiesta di emergenza alle forze dell'ordine" nell'intestazione dell'oggetto dell'e-mail.

Tieni presente che potrebbero volerci almeno due settimane per poter esaminare la tua richiesta e rispondere.