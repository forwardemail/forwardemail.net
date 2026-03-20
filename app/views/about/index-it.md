# Informazioni su Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Storia del team e dell'azienda Forward Email" class="rounded-lg" />

# Informazioni su Forward Email {#about-forward-email-1}


## Indice {#table-of-contents}

* [Panoramica](#overview)
* [Fondatore e Missione](#founder-and-mission)
* [Cronologia](#timeline)
  * [2017 - Fondazione e Lancio](#2017---founding-and-launch)
  * [2018 - Infrastruttura e Integrazione](#2018---infrastructure-and-integration)
  * [2019 - Rivoluzione delle Prestazioni](#2019---performance-revolution)
  * [2020 - Focus su Privacy e Sicurezza](#2020---privacy-and-security-focus)
  * [2021 - Modernizzazione della Piattaforma](#2021---platform-modernization)
  * [2023 - Espansione di Infrastruttura e Funzionalità](#2023---infrastructure-and-feature-expansion)
  * [2024 - Ottimizzazione del Servizio e Funzionalità Avanzate](#2024---service-optimization-and-advanced-features)
  * [2025 - Miglioramenti della Privacy e Supporto ai Protocolli {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - Conformità RFC e Filtraggio Avanzato {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Principi Fondamentali](#core-principles)
* [Stato Attuale](#current-status)


## Panoramica {#overview}

> \[!TIP]
> Per dettagli tecnici sulla nostra architettura, implementazioni di sicurezza e roadmap, consulta il [Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email è un servizio di [inoltro email](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") [gratuito e open-source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") focalizzato sul [diritto alla privacy](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") dell'utente. Ciò che è iniziato come una semplice soluzione di inoltro email nel 2017 si è evoluto in una piattaforma email completa che offre nomi di dominio personalizzati illimitati, indirizzi email e alias illimitati, indirizzi email usa e getta illimitati, protezione da spam e phishing, archiviazione crittografata della casella di posta e numerose funzionalità avanzate.

Il servizio è mantenuto e posseduto dal team originale di fondatori, designer e sviluppatori. È costruito con software 100% open-source utilizzando [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") e [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Fondatore e Missione {#founder-and-mission}

Forward Email è stato fondato da **Nicholas Baugh** nel 2017. Secondo il [Technical Whitepaper di Forward Email](https://forwardemail.net/technical-whitepaper.pdf), Baugh stava inizialmente cercando una soluzione semplice ed economica per abilitare le email su nomi di dominio per i suoi progetti secondari. Dopo aver ricercato le opzioni disponibili, ha iniziato a sviluppare la propria soluzione e ha acquistato il dominio `forwardemail.net` il 2 ottobre 2017.

La missione di Forward Email va oltre la semplice fornitura di servizi email: mira a trasformare il modo in cui l'industria affronta la privacy e la sicurezza delle email. I valori fondamentali dell'azienda includono trasparenza, controllo da parte dell'utente e protezione della privacy tramite implementazioni tecniche piuttosto che semplici promesse politiche.


## Cronologia {#timeline}

### 2017 - Fondazione e Lancio {#2017---founding-and-launch}

**2 ottobre 2017**: Nicholas Baugh ha acquistato il dominio `forwardemail.net` dopo aver ricercato soluzioni email economiche per i suoi progetti secondari.

**5 novembre 2017**: Baugh ha creato un file JavaScript di 634 righe utilizzando [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") per inoltrare email per qualsiasi nome di dominio personalizzato. Questa implementazione iniziale è stata pubblicata come open-source su [GitHub](https://github.com/forwardemail) e il servizio è stato lanciato utilizzando GitHub Pages.
**Novembre 2017**: Forward Email è stato ufficialmente lanciato dopo una prima versione. La versione iniziale era basata esclusivamente su DNS senza alcuna registrazione o processo di iscrizione—semplicemente un file README scritto in Markdown con istruzioni. Gli utenti potevano configurare l'inoltro email impostando i record MX per puntare a `mx1.forwardemail.net` e `mx2.forwardemail.net`, e aggiungendo un record TXT con `forward-email=user@gmail.com`.

La semplicità ed efficacia di questa soluzione ha attirato l'attenzione di sviluppatori di rilievo, incluso [David Heinemeier Hansson](https://dhh.dk) (creatore di Ruby on Rails), che continua a utilizzare Forward Email sul suo dominio `dhh.dk` ancora oggi.

### 2018 - Infrastruttura e Integrazione {#2018---infrastructure-and-integration}

**Aprile 2018**: Quando [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") ha lanciato il loro [servizio DNS per consumatori orientato alla privacy](https://blog.cloudflare.com/announcing-1111/), Forward Email è passato dall'uso di [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") a [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") per la gestione delle ricerche [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), dimostrando l'impegno dell'azienda verso scelte infrastrutturali focalizzate sulla privacy.

**Ottobre 2018**: Forward Email ha permesso agli utenti di "Inviare posta come" con [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") e [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), ampliando le capacità di integrazione con i provider email più popolari.

### 2019 - Rivoluzione delle Prestazioni {#2019---performance-revolution}

**Maggio 2019**: Forward Email ha rilasciato la versione 2, che ha rappresentato una riscrittura importante rispetto alle versioni iniziali. Questo aggiornamento si è concentrato su miglioramenti delle [prestazioni](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") tramite l'uso degli [stream](https://en.wikipedia.org/wiki/Streams "Streams") di [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), stabilendo le basi per la scalabilità della piattaforma.

### 2020 - Focus su Privacy e Sicurezza {#2020---privacy-and-security-focus}

**Febbraio 2020**: Forward Email ha rilasciato il piano Enhanced Privacy Protection, che permette agli utenti di disattivare l'impostazione di record DNS pubblici con i loro alias di configurazione per l'inoltro email. Attraverso questo piano, le informazioni sugli alias email di un utente sono nascoste dalla ricerca pubblica su Internet. L'azienda ha anche rilasciato una funzionalità per abilitare o disabilitare alias specifici pur consentendo loro di apparire come indirizzi email validi e restituire codici di stato [SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") di successo, con le email immediatamente scartate (simile a reindirizzare l'output a [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Aprile 2020**: Dopo aver incontrato numerosi ostacoli con soluzioni esistenti di rilevamento spam che non rispettavano la politica sulla privacy di Forward Email, l'azienda ha rilasciato la loro versione alpha iniziale di Spam Scanner. Questa soluzione di [filtraggio anti-spam](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") completamente gratuita e open-source utilizza un approccio con filtro spam [Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") combinato con protezione [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") e contro attacchi di omografi IDN ([IDN homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")). Forward Email ha inoltre rilasciato l'[autenticazione a due fattori](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) utilizzando [password monouso](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) per una maggiore sicurezza dell'account.

**Maggio 2020**: Forward Email ha permesso il [port forwarding](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") personalizzato come soluzione alternativa per gli utenti per aggirare il blocco delle porte da parte del loro [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). L'azienda ha anche rilasciato la loro [Free Email Forwarding RESTful API](email-api) con documentazione completa ed esempi di richieste e risposte in tempo reale, insieme al supporto per webhook.
**Agosto 2020**: Forward Email ha aggiunto il supporto per il sistema di autenticazione email [Authenticated Received Chain](arc) ("ARC"), rafforzando ulteriormente la sicurezza e la consegna delle email.

**23 novembre 2020**: Forward Email è stato lanciato pubblicamente fuori dal programma beta, segnando una tappa significativa nello sviluppo della piattaforma.

### 2021 - Modernizzazione della Piattaforma {#2021---platform-modernization}

**Febbraio 2021**: Forward Email ha rifattorizzato il proprio codice per rimuovere tutte le dipendenze da [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), permettendo allo stack di diventare al 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") e [Node.js](https://en.wikipedia.org/wiki/Node.js). Questa decisione architetturale si è allineata con l’impegno dell’azienda a mantenere uno stack tecnologico coerente e open source.

**27 settembre 2021**: Forward Email ha [aggiunto il supporto](email-forwarding-regex-pattern-filter) per alias di inoltro email che corrispondono a [espressioni regolari](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), offrendo agli utenti capacità di instradamento email più sofisticate.

### 2023 - Espansione dell’Infrastruttura e delle Funzionalità {#2023---infrastructure-and-feature-expansion}

**Gennaio 2023**: Forward Email ha lanciato un sito web ridisegnato e ottimizzato per la velocità di caricamento, migliorando l’esperienza utente e le prestazioni.

**Febbraio 2023**: L’azienda ha aggiunto il supporto per i [log degli errori](/faq#do-you-store-error-logs) e ha implementato un tema scuro per il sito web, rispondendo alle preferenze degli utenti e alle esigenze di accessibilità.

**Marzo 2023**: Forward Email ha rilasciato [Tangerine](https://github.com/forwardemail/tangerine#readme) e lo ha integrato in tutta l’infrastruttura, abilitando l’uso di [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") a livello applicativo. L’azienda ha inoltre aggiunto il supporto per [MTA-STS](/faq#do-you-support-mta-sts) e ha sostituito [hCaptcha](/) con [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**Aprile 2023**: Forward Email ha implementato e automatizzato una nuova infrastruttura. L’intero servizio ha iniziato a funzionare su DNS bilanciato globalmente e basato sulla prossimità, con controlli di integrità e failover tramite [Cloudflare](https://cloudflare.com), sostituendo il precedente approccio round-robin DNS. L’azienda è passata a **server bare metal** presso più provider, inclusi [Vultr](https://www.vultr.com/?ref=429848) e [Digital Ocean](https://m.do.co/c/a7cecd27e071), entrambi provider conformi SOC 2 Tipo 1. I database MongoDB e Redis sono stati spostati in configurazioni cluster con nodi primari e standby per alta disponibilità, crittografia SSL end-to-end, crittografia a riposo e recupero point-in-time (PITR).

**Maggio 2023**: Forward Email ha lanciato la funzionalità **SMTP in uscita** per [l’invio di email con SMTP](/faq#do-you-support-sending-email-with-smtp) e [l’invio di email tramite API](/faq#do-you-support-sending-email-with-api). Questa funzionalità include salvaguardie integrate per garantire alta deliverability, un sistema moderno e robusto di coda e ritentativi, e [supporta i log degli errori in tempo reale](/faq#do-you-store-error-logs).

**Novembre 2023**: Forward Email ha lanciato la funzionalità di [**archiviazione crittografata della casella**](/blog/docs/best-quantum-safe-encrypted-email-service) per il [supporto IMAP](/faq#do-you-support-receiving-email-with-imap), rappresentando un significativo progresso nella privacy e sicurezza delle email.

**Dicembre 2023**: L’azienda ha [aggiunto il supporto](/faq#do-you-support-pop3) per [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkey e WebAuthn](/faq#do-you-support-passkeys-and-webauthn), monitoraggio del [tempo di arrivo in inbox](/faq#i) e [OpenPGP per l’archiviazione IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Ottimizzazione del Servizio e Funzionalità Avanzate {#2024---service-optimization-and-advanced-features}

**Febbraio 2024**: Forward Email ha [aggiunto il supporto per calendari (CalDAV)](/faq#do-you-support-calendars-caldav), ampliando le capacità della piattaforma oltre le email per includere la sincronizzazione dei calendari.
**Marzo a Luglio 2024**: Forward Email ha rilasciato importanti ottimizzazioni e miglioramenti ai loro servizi IMAP, POP3 e CalDAV, con l'obiettivo di rendere il loro servizio veloce quanto, se non più veloce, delle alternative.

**Luglio 2024**: L'azienda ha [aggiunto il supporto iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) per risolvere la mancanza di supporto al comando IMAP `IDLE` in Apple Mail su iOS, abilitando notifiche in tempo reale per i dispositivi Apple iOS. Forward Email ha inoltre aggiunto il monitoraggio del tempo di arrivo in inbox ("TTI") per il proprio servizio e per Yahoo/AOL, e ha iniziato a permettere agli utenti di criptare l'intero record DNS TXT anche nel piano gratuito. Come richiesto nelle [discussioni di Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) e nelle [issue di GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), l'azienda ha aggiunto la possibilità per gli alias di rifiutare silenziosamente con `250`, rifiutare soft con `421` o rifiutare hard con `550` quando disabilitati.

**Agosto 2024**: Forward Email ha aggiunto il supporto per esportare le caselle di posta nei formati [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) e [Mbox](https://en.wikipedia.org/wiki/Mbox) (oltre al formato di esportazione [SQLite](https://en.wikipedia.org/wiki/SQLite) già esistente). È stato [aggiunto il supporto per la firma dei webhook](https://forwardemail.net/faq#do-you-support-bounce-webhooks), e l'azienda ha iniziato a permettere agli utenti di inviare newsletter, annunci e email marketing tramite il loro servizio SMTP in uscita. Sono state inoltre implementate quote di archiviazione a livello di dominio e specifiche per alias per IMAP/POP3/CalDAV.

### 2025 - Miglioramenti della Privacy e Supporto ai Protocolli {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**Settembre 2024 a Gennaio 2025**: Forward Email ha [aggiunto una funzione molto richiesta di risposta automatica per le vacanze e la crittografia OpenPGP/WKD per l'inoltro email](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), ampliando le capacità di archiviazione crittografata delle caselle di posta già implementate.

**21 Gennaio 2025**: Il migliore amico del fondatore "Jack", il suo fedele compagno canino, è venuto a mancare serenamente all'età di quasi 11 anni. Jack [sarà sempre ricordato](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) per la sua incrollabile compagnia che ha supportato la creazione di Forward Email. Il [Whitepaper Tecnico di Forward Email](https://forwardemail.net/technical-whitepaper.pdf) è dedicato a Jack, riconoscendo il suo ruolo nello sviluppo del servizio.

**Febbraio 2025**: Forward Email ha cambiato provider del data center principale scegliendo [DataPacket](https://www.datapacket.com), implementando hardware bare-metal personalizzato e focalizzato sulle prestazioni per migliorare ulteriormente affidabilità e velocità del servizio.

**Marzo 2025**: È stata ufficialmente rilasciata la versione 1.0 di Forward Email.

**Aprile 2025**: È stata pubblicata la prima versione del [Whitepaper Tecnico di Forward Email](https://forwardemail.net/technical-whitepaper.pdf) e l'azienda ha iniziato ad accettare pagamenti in criptovalute.

**Maggio 2025**: Il servizio ha lanciato una nuova documentazione API utilizzando [Scalar](https://github.com/scalar/scalar).

**Giugno 2025**: Forward Email ha lanciato il supporto per il [protocollo CardDAV](/faq#do-you-support-contacts-carddav), ampliando le capacità della piattaforma per includere la sincronizzazione dei contatti oltre ai servizi di email e calendario esistenti.

**Agosto 2025**: La piattaforma ha aggiunto il supporto [CalDAV VTODO/tasks](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), abilitando la gestione delle attività insieme agli eventi del calendario.

**Novembre 2025**: La sicurezza della piattaforma è stata migliorata con la migrazione da PBKDF2 a [Argon2id](https://en.wikipedia.org/wiki/Argon2) per l'hashing delle password, e l'infrastruttura è stata migrata da Redis a [Valkey](https://github.com/valkey-io/valkey).

**Dicembre 2025**: È stata rilasciata la versione 2.0, introducendo il supporto a [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) per l'enforcement della crittografia TLS nel trasporto email e l'aggiornamento a [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6.
### 2026 - Conformità RFC e Filtraggio Avanzato {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Gennaio 2026**: Forward Email ha pubblicato un completo [documento di conformità ai protocolli RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) e ha aggiunto il supporto per la [crittografia S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) e un completo [filtraggio email Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) con supporto al [protocollo ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering). L'API REST è stata inoltre ampliata a 39 endpoint.

**Febbraio 2026**: Il client webmail ufficiale e open-source è stato lanciato su [mail.forwardemail.net](https://mail.forwardemail.net) ([codice sorgente su GitHub](https://github.com/forwardemail/mail.forwardemail.net)). La piattaforma ha inoltre aggiunto il supporto per le [Estensioni di Scheduling CalDAV (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) e [Domain Connect](https://domainconnect.org) per la configurazione DNS con un clic. Sono state lanciate notifiche push in tempo reale per IMAP, CalDAV e CardDAV utilizzando WebSockets.

**Marzo 2026**: È stato aggiunto il supporto per lo storage personalizzato compatibile S3 per dominio, insieme a uno strumento da linea di comando per la gestione. È iniziato il lavoro su applicazioni desktop e mobile multipiattaforma per macOS, Windows, Linux, iOS e Android utilizzando la stessa base di codice open-source del webmail, costruite con [Tauri](https://tauri.app).


## Principi Fondamentali {#core-principles}

Sin dalla sua nascita, Forward Email ha mantenuto un fermo impegno verso i principi di privacy e sicurezza:

**Filosofia 100% Open-Source**: A differenza dei concorrenti che rendono open-source solo i frontend mantenendo chiusi i backend, Forward Email ha reso disponibile l’intero codice—sia frontend che backend—per la revisione pubblica su [GitHub](https://github.com/forwardemail).

**Design Privacy-First**: Fin dal primo giorno, Forward Email ha implementato un approccio unico di elaborazione in memoria che evita di scrivere le email su disco, distinguendosi dai servizi email convenzionali che archiviano i messaggi in database o file system.

**Innovazione Continua**: Il servizio si è evoluto da una semplice soluzione di inoltro email a una piattaforma completa con funzionalità come caselle di posta criptate, crittografia resistente al quantum e supporto per protocolli standard inclusi SMTP, IMAP, POP3 e CalDAV.

**Trasparenza**: Rendendo tutto il codice open-source e disponibile per l’ispezione, garantendo agli utenti la possibilità di verificare le affermazioni sulla privacy invece di affidarsi solo a dichiarazioni di marketing.

**Controllo Utente**: Offrendo agli utenti opzioni, inclusa la possibilità di auto-ospitare l’intera piattaforma se desiderato.


## Stato Attuale {#current-status}

A marzo 2026, Forward Email serve oltre 500.000 domini in tutto il mondo, inclusi organizzazioni di rilievo e leader di settore come:

* **Aziende Tecnologiche**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Organizzazioni Media**: Fox News Radio, Disney Ad Sales
* **Istituzioni Educative**: Università di Cambridge, Università del Maryland, Università di Washington, Tufts University, Swarthmore College
* **Enti Governativi**: Governo del South Australia, Governo della Repubblica Dominicana
* **Altre Organizzazioni**: RCD Hotels, Fly<span>.</span>io
* **Sviluppatori Noti**: Isaac Z. Schlueter (creatore di npm), David Heinemeier Hansson (creatore di Ruby on Rails)

La piattaforma continua a evolversi con rilasci regolari di funzionalità e miglioramenti infrastrutturali, mantenendo la sua posizione come unico servizio email 100% open-source, criptato, focalizzato sulla privacy, trasparente e resistente al quantum disponibile oggi.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
