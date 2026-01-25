# Informazioni su Inoltra email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" classe="arrotondato-lg" />

# Informazioni su Inoltra email {#about-forward-email-1}

## Indice {#table-of-contents}

* [Panoramica](#overview)
* [Fondatore e missione](#founder-and-mission)
* [Cronologia](#timeline)
  * [2017 - Fondazione e lancio](#2017---founding-and-launch)
  * [2018 - Infrastrutture e Integrazione](#2018---infrastructure-and-integration)
  * [2019 - Rivoluzione delle prestazioni](#2019---performance-revolution)
  * [2020 - Focus su privacy e sicurezza](#2020---privacy-and-security-focus)
  * [2021 - Modernizzazione della piattaforma](#2021---platform-modernization)
  * [2023 - Espansione dell'infrastruttura e delle funzionalità](#2023---infrastructure-and-feature-expansion)
  * [2024 - Ottimizzazione del servizio e funzionalità avanzate](#2024---service-optimization-and-advanced-features)
  * [2025 - Miglioramenti della privacy e supporto protocolli](#2025---privacy-enhancements-and-protocol-support)
  * [2026 - Conformità RFC e filtraggio avanzato](#2026---rfc-compliance-and-advanced-filtering)
* [Principi fondamentali](#core-principles)
* [Stato attuale](#current-status)

## Panoramica {#overview}

> \[!TIP]
> Per dettagli tecnici sulla nostra architettura, sulle implementazioni di sicurezza e sulla roadmap, consultare [Whitepaper tecnico](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email è un servizio incentrato sulla gestione delle email degli utenti. Quella che nel 2017 era una semplice soluzione di inoltro email si è evoluta in una piattaforma email completa che offre nomi di dominio personalizzati illimitati, indirizzi email e alias illimitati, indirizzi email usa e getta illimitati, protezione da spam e phishing, archiviazione di caselle di posta crittografate e numerose funzionalità avanzate.

Il servizio è gestito e di proprietà del suo team fondatore originale di designer e sviluppatori. È realizzato con software open source al 100% utilizzando [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") e [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Fondatore e Missione {#founder-and-mission}

Forward Email è stata fondata da **Nicholas Baugh** nel 2017. Secondo [Whitepaper tecnico sull'inoltro delle e-mail](https://forwardemail.net/technical-whitepaper.pdf), Baugh era inizialmente alla ricerca di una soluzione semplice ed economica per abilitare la posta elettronica sui nomi di dominio per i suoi progetti collaterali. Dopo aver valutato le opzioni disponibili, ha iniziato a programmare la propria soluzione e ha acquistato il dominio `forwardemail.net` il 2 ottobre 2017.

La missione di Forward Email va oltre la fornitura di servizi di posta elettronica: mira a trasformare il modo in cui il settore affronta la privacy e la sicurezza delle email. I valori fondamentali dell'azienda includono trasparenza, controllo dell'utente e protezione della privacy attraverso l'implementazione tecnica, anziché semplici promesse di policy.

## Cronologia {#timeline}

### 2017 - Fondazione e lancio {#2017---founding-and-launch}

**2 ottobre 2017**: Nicholas Baugh ha acquistato il dominio `forwardemail.net` dopo aver ricercato soluzioni di posta elettronica convenienti per i suoi progetti collaterali.

**5 novembre 2017**: Baugh ha creato un file JavaScript di 634 righe utilizzando [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") per inoltrare le email per qualsiasi nome di dominio personalizzato. Questa implementazione iniziale è stata pubblicata come open source su [GitHub](https://github.com/forwardemail) e il servizio è stato lanciato tramite GitHub Pages.

**Novembre 2017**: Forward Email è stato lanciato ufficialmente dopo una release iniziale. La prima versione era basata esclusivamente su DNS, senza registrazione di account o procedura di iscrizione: era semplicemente un file README scritto in Markdown con istruzioni. Gli utenti potevano impostare l'inoltro email configurando i record MX in modo che puntassero a `mx1.forwardemail.net` e `mx2.forwardemail.net` e aggiungendo un record TXT con `forward-email=user@gmail.com`.

La semplicità e l'efficacia di questa soluzione hanno attirato l'attenzione di importanti sviluppatori, tra cui [Davide Heinemeier Hansson](https://dhh.dk) (creatore di Ruby on Rails), che continua a utilizzare Forward Email sul suo dominio `dhh.dk` ancora oggi.

### 2018 - Infrastruttura e integrazione {#2018---infrastructure-and-integration}

**Aprile 2018**: Quando [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") ha lanciato [servizio DNS per i consumatori che privilegia la privacy](https://blog.cloudflare.com/announcing-1111/), Forward Email è passata dall'utilizzo di [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") a [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") per la gestione delle ricerche [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), dimostrando l'impegno dell'azienda verso scelte infrastrutturali incentrate sulla privacy.

**Ottobre 2018**: Inoltra email ha consentito agli utenti di "Invia email come" con [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") e [Veduta](https://en.wikipedia.org/wiki/Outlook "Outlook"), ampliando le capacità di integrazione con i provider di posta elettronica più diffusi.

### 2019 - Rivoluzione delle prestazioni {#2019---performance-revolution}

**Maggio 2019**: Forward Email ha rilasciato la versione 2, che ha rappresentato una riscrittura sostanziale rispetto alle versioni iniziali. Questo aggiornamento si è concentrato sui miglioramenti di [prestazione](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") attraverso l'utilizzo di [flussi](https://en.wikipedia.org/wiki/Streams "Streams") di [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), gettando le basi per la scalabilità della piattaforma.

### 2020 - Focus su privacy e sicurezza {#2020---privacy-and-security-focus}

**Febbraio 2020**: Forward Email ha rilasciato il piano Enhanced Privacy Protection, che consente agli utenti di disattivare l'impostazione di record DNS pubblici con i propri alias di configurazione dell'inoltro email. Grazie a questo piano, le informazioni relative all'alias email di un utente vengono nascoste e non sono più ricercabili pubblicamente su Internet. L'azienda ha inoltre rilasciato una funzionalità per abilitare o disabilitare specifici alias, consentendo loro di apparire come indirizzi email validi e di restituire un [Codici di stato SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") con esito positivo, con l'eliminazione immediata delle email (simile all'inoltro dell'output a [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Aprile 2020**: Dopo aver incontrato innumerevoli ostacoli con le soluzioni di rilevamento dello spam esistenti che non rispettavano l'informativa sulla privacy di Forward Email, l'azienda ha rilasciato la sua versione alpha iniziale di Spam Scanner. Questa soluzione [filtro antispam](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques"), completamente gratuita e open source, utilizza un approccio [Filtro antispam Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") combinato con la protezione [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") e [Attacco omografo IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email ha anche rilasciato [autenticazione a due fattori](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) utilizzando [password monouso](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) per una maggiore sicurezza dell'account.

**Maggio 2020**: Inoltra email ha consentito l'utilizzo di [inoltro delle porte](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") personalizzato come soluzione alternativa per consentire agli utenti di aggirare il blocco delle porte da parte di [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). L'azienda ha inoltre rilasciato [API RESTful gratuita per l'inoltro e-mail](email-api) con documentazione completa ed esempi di richieste e risposte in tempo reale, oltre al supporto per i webhook.

**Agosto 2020**: Forward Email ha aggiunto il supporto per il sistema di autenticazione e-mail [Catena ricevuta autenticata](arc) ("ARC"), rafforzando ulteriormente la sicurezza e la recapitabilità delle e-mail.

**23 novembre 2020**: Forward Email è stato lanciato pubblicamente dopo la fase beta, segnando una pietra miliare significativa nello sviluppo della piattaforma.

### 2021 - Modernizzazione della piattaforma {#2021---platform-modernization}

**Febbraio 2021**: Forward Email ha rifattorizzato il proprio codice base per rimuovere tutte le dipendenze da [Pitone](https://en.wikipedia.org/wiki/Python_\(programming_language\) ("Python (linguaggio di programmazione)"), consentendo al proprio stack di diventare al 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") e [Node.js](https://en.wikipedia.org/wiki/Node.js). Questa decisione architetturale è in linea con l'impegno dell'azienda a mantenere uno stack tecnologico coerente e open source.

**27 settembre 2021**: Inoltra l'email [supporto aggiunto](email-forwarding-regex-pattern-filter) affinché gli alias di inoltro email corrispondano a [espressioni regolari](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), offrendo agli utenti funzionalità di routing email più sofisticate.

### 2023 - Espansione dell'infrastruttura e delle funzionalità {#2023---infrastructure-and-feature-expansion}

**Gennaio 2023**: Forward Email ha lanciato un sito web riprogettato e ottimizzato per la velocità di caricamento delle pagine, migliorando l'esperienza utente e le prestazioni.

**Febbraio 2023**: L'azienda ha aggiunto il supporto per [registri degli errori](/faq#do-you-store-error-logs) e ha implementato una combinazione di colori per il sito web [modalità scura](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme), rispondendo alle preferenze degli utenti e alle esigenze di accessibilità.

**Marzo 2023**: Forward Email ha rilasciato [mandarino](https://github.com/forwardemail/tangerine#readme) e lo ha integrato in tutta la propria infrastruttura, consentendo l'utilizzo di [DNS su HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") a livello applicativo. L'azienda ha inoltre aggiunto il supporto per [MTA-STS](/faq#do-you-support-mta-sts) ed è passata da [hCaptcha](/) a [Tornello Cloudflare](https://developers.cloudflare.com/turnstile).

**Aprile 2023**: Forward Email ha implementato e automatizzato un'infrastruttura completamente nuova. L'intero servizio ha iniziato a funzionare su DNS con bilanciamento del carico globale e basato sulla prossimità, con controlli di integrità e failover tramite [Cloudflare](https://cloudflare.com), in sostituzione del precedente approccio DNS round-robin. L'azienda è passata a **server bare metal** su più provider, tra cui [Vultr](https://www.vultr.com/?ref=429848) e [Oceano digitale](https://m.do.co/c/a7cecd27e071), entrambi conformi allo standard SOC 2 Tipo 1. I database MongoDB e Redis sono stati trasferiti a configurazioni cluster con nodi primari e di standby per garantire elevata disponibilità, crittografia SSL end-to-end, crittografia a riposo e ripristino point-in-time (PITR).

**Maggio 2023**: Forward Email ha lanciato la funzionalità **SMTP in uscita** per le richieste [invio di e-mail con SMTP](/faq#do-you-support-sending-email-with-smtp) e [invio di email con API](/faq#do-you-support-sending-email-with-api). Questa funzionalità include misure di sicurezza integrate per garantire un'elevata recapitabilità, un sistema di code e tentativi moderno e robusto e [supporta i registri degli errori in tempo reale](/faq#do-you-store-error-logs).

**Novembre 2023**: Forward Email ha lanciato la funzionalità [**archiviazione di cassette postali crittografate**](/blog/docs/best-quantum-safe-encrypted-email-service) per [Supporto IMAP](/faq#do-you-support-receiving-email-with-imap), che rappresenta un significativo progresso nella privacy e nella sicurezza della posta elettronica.

**Dicembre 2023**: L'azienda [supporto aggiunto](/faq#do-you-support-pop3) per il monitoraggio di [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [chiavi di accesso e WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [tempo di posta in arrivo](/faq#i) e [OpenPGP per l'archiviazione IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Ottimizzazione del servizio e funzionalità avanzate {#2024---service-optimization-and-advanced-features}

**Febbraio 2024**: Inoltra email [aggiunto il supporto del calendario (CalDAV)](/faq#do-you-support-calendars-caldav), ampliando le funzionalità della piattaforma oltre la posta elettronica e includendo la sincronizzazione del calendario.

**Da marzo a luglio 2024**: Forward Email ha rilasciato importanti ottimizzazioni e miglioramenti ai propri servizi IMAP, POP3 e CalDAV, con l'obiettivo di rendere il proprio servizio veloce quanto, se non più veloce, delle alternative.

**Luglio 2024**: L'azienda [aggiunto il supporto iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) ha risolto il problema di Apple Mail relativo al supporto del comando IMAP `IDLE` su iOS, consentendo notifiche in tempo reale per i dispositivi Apple iOS. Forward Email ha inoltre aggiunto tempo al monitoraggio della posta in arrivo ("TTI") per il proprio servizio e per Yahoo/AOL, e ha iniziato a consentire agli utenti di crittografare l'intero record DNS TXT anche con il piano gratuito. Come richiesto in [Discussioni sulle guide sulla privacy](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) e [Problemi di GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), l'azienda ha aggiunto la possibilità per gli alias di rifiutare silenziosamente `250`, rifiutare in modo soft `421` o rifiutare in modo hard `550` quando disabilitati.

**Agosto 2024**: Forward Email ha aggiunto il supporto per l'esportazione delle caselle di posta nei formati [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) e [Mbox](https://en.wikipedia.org/wiki/Mbox) (oltre al formato di esportazione [SQLite](https://en.wikipedia.org/wiki/SQLite) esistente). È stato introdotto il supporto per [È stato aggiunto il supporto per la firma webhook](https://forwardemail.net/faq#do-you-support-bounce-webhooks) e l'azienda ha iniziato a consentire agli utenti di inviare newsletter, annunci ed email marketing tramite il proprio servizio SMTP in uscita. Sono state inoltre implementate quote di archiviazione a livello di dominio e specifiche per alias per IMAP/POP3/CalDAV.

### 2025 - Miglioramenti della privacy e supporto protocolli {#2025---privacy-enhancements-and-protocol-support}

**Da settembre 2024 a gennaio 2025**: Inoltra e-mail [aggiunta una funzionalità di risposta automatica molto richiesta e crittografia OpenPGP/WKD per l'inoltro delle email](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), sfruttando le funzionalità di archiviazione delle caselle di posta crittografate già implementate.

**21 gennaio 2025**: Il migliore amico del fondatore, "Jack", il suo fedele compagno a quattro zampe, è mancato serenamente all'età di quasi 11 anni. Jack [sarà sempre ricordato](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) per la sua incrollabile compagnia che ha supportato la creazione di Forward Email. Il [Whitepaper tecnico sull'inoltro delle e-mail](https://forwardemail.net/technical-whitepaper.pdf) è dedicato a Jack, in riconoscimento del suo ruolo nello sviluppo del servizio.

**Febbraio 2025**: Forward Email è passata a [Pacchetto dati](https://www.datapacket.com) come nuovo fornitore principale del data center, implementando hardware bare-metal personalizzato e incentrato sulle prestazioni per migliorare ulteriormente l'affidabilità e la velocità del servizio.

**Giugno 2025**: Forward Email ha lanciato il supporto per [Protocollo CardDAV](/faq#do-you-support-contacts-carddav), ampliando le funzionalità della piattaforma per includere la sincronizzazione dei contatti insieme ai servizi di posta elettronica e calendario esistenti.

### 2026 - Conformità RFC e filtraggio avanzato {#2026---rfc-compliance-and-advanced-filtering}

**Gennaio 2026**: Forward Email ha rilasciato un documento completo di [conformità al protocollo RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) che dettaglia il supporto completo degli standard per SMTP, IMAP, POP3 e CalDAV. La piattaforma ha anche aggiunto [supporto REQUIRETLS (RFC 8689)](/faq#requiretls-support) per la crittografia TLS forzata sul trasporto email, [crittografia S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) per la firma e crittografia sicura dei messaggi, e [filtraggio email Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) con [protocollo ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering) per il filtraggio email lato server. L'[API REST](/email-api) è stata espansa a 39 endpoint che coprono messaggi, cartelle, contatti, calendari ed eventi del calendario.

## Principi fondamentali {#core-principles}

Fin dalla sua nascita, Forward Email ha mantenuto un fermo impegno nei confronti dei principi di privacy e sicurezza:

**Filosofia 100% open source**: a differenza dei concorrenti che rendono open source solo i loro frontend mantenendo chiusi i backend, Forward Email ha reso disponibile l'intera base di codice, sia frontend che backend, per l'esame pubblico su [GitHub](https://github.com/forwardemail).

**Privacy-First Design**: fin dal primo giorno, Forward Email ha implementato un approccio esclusivo di elaborazione in memoria che evita di scrivere le email su disco, distinguendosi dai servizi di posta elettronica convenzionali che archiviano i messaggi in database o file system.

**Innovazione continua**: il servizio si è evoluto da una semplice soluzione di inoltro e-mail a una piattaforma e-mail completa con funzionalità quali caselle di posta crittografate, crittografia resistente ai quantum e supporto per protocolli standard tra cui SMTP, IMAP, POP3 e CalDAV.

**Trasparenza**: rendere tutto il codice open source e disponibile per l'ispezione, garantendo che gli utenti possano verificare le dichiarazioni sulla privacy anziché fidarsi semplicemente delle dichiarazioni di marketing.

**Controllo utente**: offre agli utenti diverse opzioni, tra cui la possibilità di ospitare autonomamente l'intera piattaforma, se lo desiderano.

## Stato attuale {#current-status}

Nel 2025, Forward Email serviva oltre 500.000 domini in tutto il mondo, tra cui importanti organizzazioni e leader del settore come:

* **Aziende tecnologiche**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Organizzazioni mediatiche**: Fox News Radio, Disney Ad Sales
* **Istituti scolastici**: Università di Cambridge, Università del Maryland, Università di Washington, Tufts University, Swarthmore College
* **Enti governativi**: Governo dell'Australia Meridionale, Governo della Repubblica Dominicana
* **Altre organizzazioni**: RCD Hotels, Fly<span>.</span>io
* **Sviluppatori degni di nota**: Isaac Z. Schlueter (creatore di npm), David Heinemeier Hansson (creatore di Ruby on Rails)

La piattaforma continua a evolversi con rilasci regolari di funzionalità e miglioramenti dell'infrastruttura, mantenendo la sua posizione di unico servizio di posta elettronica 100% open source, crittografato, incentrato sulla privacy, trasparente e resistente alla tecnologia quantistica disponibile oggi.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" classe="arrotondato-lg" />