# Guida Completa alla Configurazione Email NAS con Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Configurare le notifiche email sul tuo NAS non dovrebbe essere un problema. Che tu abbia un Synology, QNAP o anche un setup con Raspberry Pi, questa guida farà in modo che il tuo dispositivo comunichi con Forward Email così saprai davvero quando qualcosa va storto.

La maggior parte dei dispositivi NAS può inviare avvisi email per guasti ai dischi, avvisi di temperatura, completamento backup ed eventi di sicurezza. Il problema? Molti provider email sono diventati esigenti sulla sicurezza, e i dispositivi più vecchi spesso non riescono a stare al passo. Qui entra in gioco Forward Email - supportiamo sia dispositivi moderni che legacy.

Questa guida copre la configurazione email per oltre 75 provider NAS con istruzioni passo-passo, informazioni sulla compatibilità e suggerimenti per la risoluzione dei problemi. Qualunque dispositivo tu stia usando, faremo funzionare le tue notifiche.


## Indice {#table-of-contents}

* [Perché Hai Bisogno delle Notifiche Email NAS](#why-you-need-nas-email-notifications)
* [Il Problema TLS (E Come Lo Risolviamo)](#the-tls-problem-and-how-we-fix-it)
* [Impostazioni SMTP di Forward Email](#forward-email-smtp-settings)
* [Matrice Completa di Compatibilità dei Provider NAS](#comprehensive-nas-provider-compatibility-matrix)
* [Configurazione Email Synology NAS](#synology-nas-email-configuration)
  * [Passaggi di Configurazione](#configuration-steps)
* [Configurazione Email QNAP NAS](#qnap-nas-email-configuration)
  * [Passaggi di Configurazione](#configuration-steps-1)
  * [Problemi Comuni di Risoluzione QNAP](#common-qnap-troubleshooting-issues)
* [Configurazione Legacy ReadyNAS](#readynas-legacy-configuration)
  * [Passaggi di Configurazione Legacy](#legacy-configuration-steps)
  * [Risoluzione Problemi ReadyNAS](#readynas-troubleshooting)
* [Configurazione TerraMaster NAS](#terramaster-nas-configuration)
* [Configurazione ASUSTOR NAS](#asustor-nas-configuration)
* [Configurazione Buffalo TeraStation](#buffalo-terastation-configuration)
* [Configurazione Western Digital My Cloud](#western-digital-my-cloud-configuration)
* [Configurazione Email TrueNAS](#truenas-email-configuration)
* [Configurazione OpenMediaVault](#openmediavault-configuration)
* [Configurazione Raspberry Pi NAS](#raspberry-pi-nas-configuration)
  * [Configurazione Iniziale Raspberry Pi](#initial-raspberry-pi-setup)
  * [Configurazione Condivisione File Samba](#samba-file-sharing-configuration)
  * [Configurazione Server FTP](#ftp-server-setup)
  * [Configurazione Notifiche Email](#email-notification-configuration)
  * [Funzionalità Avanzate Raspberry Pi NAS](#advanced-raspberry-pi-nas-features)
  * [Risoluzione Problemi Email Raspberry Pi](#raspberry-pi-email-troubleshooting)
  * [Ottimizzazione delle Prestazioni](#performance-optimization)
  * [Considerazioni sulla Sicurezza](#security-considerations)


## Perché Hai Bisogno delle Notifiche Email NAS {#why-you-need-nas-email-notifications}

Il tuo NAS monitora un sacco di cose - salute dei dischi, temperatura, problemi di rete, eventi di sicurezza. Senza avvisi email, i problemi possono passare inosservati per settimane, causando potenzialmente perdita di dati o violazioni della sicurezza.

Le notifiche email ti danno avvisi immediati quando i dischi iniziano a guastarsi, ti avvertono di tentativi di accesso non autorizzati, confermano backup riusciti e ti tengono informato sulla salute del sistema. Forward Email assicura che queste notifiche critiche ti raggiungano davvero.


## Il Problema TLS (E Come Lo Risolviamo) {#the-tls-problem-and-how-we-fix-it}

Ecco il punto: se il tuo NAS è stato prodotto prima del 2020, probabilmente supporta solo TLS 1.0. Gmail, Outlook e la maggior parte dei provider hanno abbandonato il supporto per questo anni fa. Il tuo dispositivo prova a inviare email, viene rifiutato e rimani al buio.

Forward Email risolve questo con il supporto a doppia porta. I dispositivi moderni usano le nostre porte standard (`465` e `587`), mentre quelli più vecchi possono usare le nostre porte legacy (`2455` e `2555`) che supportano ancora TLS 1.0.

> \[!IMPORTANT]
> Forward Email supporta sia dispositivi NAS moderni che legacy tramite la nostra strategia a doppia porta. Usa le porte 465/587 per dispositivi moderni con supporto TLS 1.2+, e le porte 2455/2555 per dispositivi legacy che supportano solo TLS 1.0.


## Impostazioni SMTP di Forward Email {#forward-email-smtp-settings}
Ecco cosa devi sapere sulla nostra configurazione SMTP:

**Per dispositivi NAS moderni (2020+):** Usa `smtp.forwardemail.net` con la porta `465` (SSL/TLS) o la porta `587` (STARTTLS). Queste funzionano con il firmware attuale che supporta TLS 1.2+.

**Per dispositivi NAS più vecchi:** Usa `smtp.forwardemail.net` con la porta `2455` (SSL/TLS) o la porta `2555` (STARTTLS). Queste supportano TLS 1.0 per dispositivi legacy.

**Autenticazione:** Usa il tuo alias Forward Email come nome utente e la password generata da [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) (non la password del tuo account).

> \[!CAUTION]
> Non usare mai la password di accesso al tuo account per l'autenticazione SMTP. Usa sempre la password generata da [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) per la configurazione del NAS.

> \[!TIP]
> Controlla la versione del firmware del tuo dispositivo NAS e il supporto TLS prima della configurazione. La maggior parte dei dispositivi prodotti dopo il 2020 supporta protocolli TLS moderni, mentre i dispositivi più vecchi richiedono tipicamente porte di compatibilità legacy.


## Matrice completa di compatibilità dei provider NAS {#comprehensive-nas-provider-compatibility-matrix}

La seguente matrice fornisce informazioni dettagliate sulla compatibilità per i principali provider NAS, inclusi i livelli di supporto TLS, lo stato del firmware e le impostazioni di configurazione Forward Email consigliate.

| Provider NAS     | Modelli attuali | Supporto TLS | Stato firmware | Porte consigliate | Problemi comuni                                                                                                                                         | Guida alla configurazione/Schermate                                                                                                             |
| ---------------- | --------------- | ------------ | -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology         | DSM 7.x         | TLS 1.2+     | Attivo         | `465`, `587`      | [Configurazione STARTTLS](https://community.synology.com/enu/forum/2/post/124584)                                                                      | [Configurazione notifiche email DSM](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                         |
| QNAP             | QTS 5.x         | TLS 1.2+     | Attivo         | `465`, `587`      | [Errori Notification Center](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)  | [Configurazione server email QTS](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi     | Raspberry Pi OS | TLS 1.2+     | Attivo         | `465`, `587`      | [Problemi risoluzione DNS](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                  | [Guida configurazione email Raspberry Pi](#raspberry-pi-nas-configuration)                                                                     |
| ASUSTOR          | ADM 4.x         | TLS 1.2+     | Attivo         | `465`, `587`      | [Validazione certificato](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                       | [Configurazione notifiche ASUSTOR](https://www.asustor.com/en/online/online_help?id=8)                                                         |
| TerraMaster      | TOS 6.x         | TLS 1.2      | Attivo         | `465`, `587`      | [Autenticazione SMTP](https://www.terra-master.com/global/forum/)                                                                                       | [Configurazione email TerraMaster](https://www.terra-master.com/global/support/download.php)                                                    |
| TrueNAS          | SCALE/CORE      | TLS 1.2+     | Attivo         | `465`, `587`      | [Configurazione certificato SSL](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                     | [Guida configurazione email TrueNAS](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)            |
| Buffalo          | TeraStation     | TLS 1.2      | Limitato       | `465`, `587`      | [Compatibilità firmware](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)           | [Configurazione email TeraStation](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital  | My Cloud OS 5   | TLS 1.2      | Limitato       | `465`, `587`      | [Compatibilità OS legacy](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                                 | [Configurazione email My Cloud](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                     |
| OpenMediaVault   | OMV 7.x         | TLS 1.2+     | Attivo         | `465`, `587`      | [Dipendenze plugin](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                         | [Configurazione notifiche OMV](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                            |
| Netgear ReadyNAS | OS 6.x          | Solo TLS 1.0 | Discontinuato  | `2455`, `2555`    | [Supporto TLS legacy](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                         | [Configurazione avvisi email ReadyNAS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)  |
| Drobo            | Dashboard       | TLS 1.2      | Discontinuato  | `465`, `587`      | [Supporto limitato](https://myprojects.drobo.com/support/)                                                                                            | [Notifiche email Drobo](https://www.drobo.com/support/)                                                                                        |
Questa matrice dimostra la chiara divisione tra sistemi NAS moderni e attivamente mantenuti e dispositivi legacy che richiedono considerazioni speciali di compatibilità. La maggior parte degli attuali dispositivi NAS supporta gli standard TLS moderni e può utilizzare le porte SMTP primarie di Forward Email senza alcuna configurazione speciale.


## Configurazione Email Synology NAS {#synology-nas-email-configuration}

I dispositivi Synology con DSM sono piuttosto semplici da configurare. Supportano TLS moderno, quindi puoi utilizzare le nostre porte standard senza problemi.

> \[!NOTE]
> Synology DSM 7.x offre le funzionalità di notifica email più complete. Le versioni DSM più vecchie potrebbero avere opzioni di configurazione limitate.

### Passaggi di Configurazione {#configuration-steps}

1. **Accedi all'interfaccia web DSM** inserendo l'indirizzo IP del tuo dispositivo NAS o l'ID QuickConnect in un browser web.

2. **Vai al Pannello di Controllo** e seleziona la sezione "Notifiche", quindi clicca sulla scheda "Email" per accedere alle opzioni di configurazione email.

3. **Abilita le notifiche email** selezionando la casella "Abilita notifiche email".

4. **Configura il server SMTP** inserendo `smtp.forwardemail.net` come indirizzo del server.

5. **Imposta la configurazione della porta** sulla porta 465 per connessioni SSL/TLS (consigliato). La porta 587 con STARTTLS è supportata come alternativa.

6. **Configura l'autenticazione** selezionando "Autenticazione SMTP richiesta" e inserendo il tuo alias Forward Email nel campo username.

7. **Inserisci la tua password** utilizzando la password generata da [Il Mio Account -> Domini -> Alias](https://forwardemail.net/my-account/domains).

8. **Imposta gli indirizzi dei destinatari** inserendo fino a cinque indirizzi email che dovrebbero ricevere le notifiche.

9. **Configura il filtro delle notifiche** per controllare quali eventi attivano gli avvisi email, evitando un sovraccarico di notifiche e assicurando che gli eventi critici vengano segnalati.

10. **Testa la configurazione** utilizzando la funzione di test integrata in DSM per verificare che tutte le impostazioni siano corrette e che la comunicazione con i server di Forward Email funzioni correttamente.

> \[!TIP]
> Synology consente diversi tipi di notifica per destinatari differenti, offrendo flessibilità su come gli avvisi vengono distribuiti nel tuo team.


## Configurazione Email QNAP NAS {#qnap-nas-email-configuration}

I dispositivi QNAP con QTS funzionano molto bene con Forward Email. Supportano TLS moderno e hanno una bella interfaccia web per la configurazione.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 aveva un problema noto con le notifiche email che è stato [risolto in QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Assicurati che il firmware sia aggiornato per evitare fallimenti nelle notifiche.

### Passaggi di Configurazione {#configuration-steps-1}

1. **Accedi all'interfaccia web del tuo dispositivo QNAP** inserendo il suo indirizzo IP in un browser web.

2. **Vai al Pannello di Controllo** e seleziona "Account di Servizio e Accoppiamento Dispositivo", quindi clicca sulla sezione "E-mail" per iniziare la configurazione email.

3. **Clicca su "Aggiungi Servizio SMTP"** per creare una nuova configurazione email.

4. **Configura il server SMTP** inserendo `smtp.forwardemail.net` come indirizzo del server SMTP.

5. **Seleziona il protocollo di sicurezza appropriato** - scegli "SSL/TLS" con porta `465` (consigliato). La porta `587` con STARTTLS è supportata come alternativa.

6. **Configura il numero di porta** - la porta `465` con SSL/TLS è consigliata. La porta `587` con STARTTLS è disponibile se necessario.

7. **Inserisci le credenziali di autenticazione** usando il tuo alias Forward Email come username e la password generata da [Il Mio Account -> Domini -> Alias](https://forwardemail.net/my-account/domains).

8. **Configura le informazioni del mittente** inserendo un nome descrittivo per il campo "Da", come "Sistema NAS QNAP" o il nome host del tuo dispositivo.

9. **Imposta gli indirizzi dei destinatari** per i diversi tipi di notifica. QNAP consente di configurare più gruppi di destinatari per diversi tipi di avviso.

10. **Testa la configurazione** utilizzando la funzione di test email integrata di QNAP per verificare che tutte le impostazioni funzionino correttamente.

> \[!TIP]
> Se incontri [problemi di configurazione SMTP con Gmail](https://forum.qnap.com/viewtopic.php?t=152466), gli stessi passaggi di risoluzione si applicano a Forward Email. Assicurati che l'autenticazione sia abilitata correttamente e che le credenziali siano corrette.
> \[!NOTE]
> I dispositivi QNAP supportano una pianificazione avanzata delle notifiche, permettendoti di configurare orari di silenzio durante i quali le notifiche non critiche vengono soppresse. Questo è particolarmente utile negli ambienti aziendali.

### Problemi comuni di risoluzione dei problemi QNAP {#common-qnap-troubleshooting-issues}

Se il tuo dispositivo QNAP [non riesce a inviare email di notifica](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), verifica quanto segue:

* Verifica che le credenziali di Forward Email siano corrette
* Assicurati che l'indirizzo del server SMTP sia esattamente `smtp.forwardemail.net`
* Conferma che la porta corrisponda al tuo metodo di crittografia (`465` per SSL/TLS è consigliato; `587` per STARTTLS è supportato)
* Controlla che la tua [configurazione del server SMTP](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) consenta la connessione


## Configurazione Legacy ReadyNAS {#readynas-legacy-configuration}

I dispositivi Netgear ReadyNAS presentano sfide uniche a causa del supporto firmware interrotto e della dipendenza dai protocolli legacy TLS 1.0. Tuttavia, il supporto delle porte legacy di Forward Email garantisce che questi dispositivi possano continuare a inviare notifiche email in modo affidabile.

> \[!CAUTION]
> ReadyNAS OS 6.x supporta solo TLS 1.0, che richiede le porte di compatibilità legacy di Forward Email `2455` e `2555`. Le porte moderne `465` e `587` non funzioneranno con questi dispositivi.

### Passaggi per la configurazione legacy {#legacy-configuration-steps}

1. **Accedi all'interfaccia web di ReadyNAS** inserendo l'indirizzo IP del dispositivo in un browser web.

2. **Naviga su Sistema > Impostazioni > Avvisi** per accedere alla sezione di configurazione email.

3. **Configura il server SMTP** inserendo `smtp.forwardemail.net` come indirizzo del server.

4. **Imposta la configurazione della porta** su `2455` per connessioni SSL/TLS o `2555` per connessioni STARTTLS - queste sono le porte di compatibilità legacy di Forward Email.

5. **Abilita l'autenticazione** e inserisci il tuo alias Forward Email come nome utente e la password generata da [Il mio account -> Domini -> Alias](https://forwardemail.net/my-account/domains).

6. **Configura le informazioni del mittente** con un indirizzo "Da" descrittivo per identificare il dispositivo ReadyNAS.

7. **Aggiungi gli indirizzi email dei destinatari** usando il pulsante + nella sezione contatti email.

8. **Testa la configurazione** per assicurarti che la connessione TLS legacy funzioni correttamente.

> \[!IMPORTANT]
> I dispositivi ReadyNAS richiedono le porte legacy perché non possono stabilire connessioni sicure usando i protocolli TLS moderni. Questa è una [limitazione nota](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) del firmware interrotto.

### Risoluzione dei problemi ReadyNAS {#readynas-troubleshooting}

I problemi comuni con la configurazione email ReadyNAS includono:

* **Incompatibilità della versione TLS**: assicurati di usare le porte `2455` o `2555`, non le porte moderne
* **Errori di autenticazione**: verifica che le credenziali Forward Email siano corrette
* **Connettività di rete**: controlla che ReadyNAS possa raggiungere `smtp.forwardemail.net`
* **Limitazioni del firmware**: alcuni modelli ReadyNAS più vecchi potrebbero avere ulteriori [requisiti di configurazione HTTPS](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

I dispositivi ReadyNAS con OS 6.x e versioni precedenti supportano solo connessioni TLS 1.0, che la maggior parte dei provider email moderni non accetta più. Le porte legacy dedicate di Forward Email (2455 e 2555) supportano specificamente questi protocolli più vecchi, garantendo la funzionalità continua per gli utenti ReadyNAS.

Per configurare l'email sui dispositivi ReadyNAS, accedi all'interfaccia web del dispositivo tramite il suo indirizzo IP. Naviga nella sezione Sistema e seleziona "Notifiche" per accedere alle opzioni di configurazione email.

Nella sezione di configurazione email, abilita le notifiche email e inserisci smtp.forwardemail.net come server SMTP. Questo è cruciale - usa le porte compatibili legacy di Forward Email invece delle porte SMTP standard.

Per connessioni SSL/TLS, configura la porta 2455 invece della porta standard 465 (consigliata). Per connessioni STARTTLS, usa la porta 2555 invece della porta 587. Queste porte speciali mantengono la compatibilità TLS 1.0 offrendo la migliore sicurezza disponibile per dispositivi legacy.
Inserisci il tuo alias Forward Email come nome utente e la password generata per l'autenticazione. I dispositivi ReadyNAS supportano l'autenticazione SMTP, che è richiesta per le connessioni Forward Email.

Configura l'indirizzo email del mittente e gli indirizzi dei destinatari in base alle tue esigenze di notifica. ReadyNAS consente più indirizzi destinatari, permettendoti di distribuire gli avvisi a diversi membri del team o account email.

Testa attentamente la configurazione, poiché i dispositivi ReadyNAS potrebbero non fornire messaggi di errore dettagliati in caso di fallimento della configurazione. Se il test standard non funziona, verifica di utilizzare le porte legacy corrette (2455 o 2555) invece delle porte SMTP moderne.

Considera le implicazioni di sicurezza nell'uso di protocolli TLS legacy. Sebbene le porte legacy di Forward Email offrano la migliore sicurezza disponibile per dispositivi più vecchi, è consigliato aggiornare a un sistema NAS moderno con supporto TLS attuale quando possibile.


## Configurazione TerraMaster NAS {#terramaster-nas-configuration}

I dispositivi TerraMaster con TOS 6.x supportano TLS moderno e funzionano bene con le porte standard di Forward Email.

> \[!NOTE]
> TerraMaster TOS 6.x offre funzionalità complete di notifica email. Assicurati che il firmware sia aggiornato per la migliore compatibilità.

1. **Accedi alle Impostazioni di Sistema**
   * Accedi all'interfaccia web di TerraMaster
   * Vai su **Pannello di Controllo** > **Notifiche**

2. **Configura le Impostazioni SMTP**
   * Server: `smtp.forwardemail.net`
   * Porta: `465` (SSL/TLS, consigliato) o `587` (STARTTLS)
   * Nome utente: Il tuo alias Forward Email
   * Password: Password generata da [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Abilita le Notifiche**
   * Seleziona i tipi di notifica che desideri ricevere
   * Testa la configurazione con la funzione di test integrata

> \[!TIP]
> I dispositivi TerraMaster funzionano meglio con la porta `465` per connessioni SSL/TLS (consigliato). Se riscontri problemi, è supportata anche la porta `587` con STARTTLS.


## Configurazione ASUSTOR NAS {#asustor-nas-configuration}

I dispositivi ASUSTOR con ADM 4.x hanno un solido supporto per le notifiche email e funzionano perfettamente con Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x include opzioni avanzate di filtro per le notifiche. Puoi personalizzare quali eventi attivano gli avvisi email.

1. **Apri le Impostazioni di Notifica**
   * Accedi all'interfaccia web ADM
   * Vai su **Impostazioni** > **Notifiche**

2. **Configura SMTP**
   * Server SMTP: `smtp.forwardemail.net`
   * Porta: `465` (SSL/TLS, consigliato) o `587` (STARTTLS)
   * Autenticazione: Abilita
   * Nome utente: Il tuo alias Forward Email
   * Password: Password generata da [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Configura i Tipi di Avviso**
   * Seleziona quali eventi di sistema devono inviare email
   * Imposta gli indirizzi dei destinatari
   * Testa la configurazione

> \[!IMPORTANT]
> I dispositivi ASUSTOR richiedono che l'autenticazione sia esplicitamente abilitata nelle impostazioni SMTP. Non dimenticare di selezionare questa opzione.


## Configurazione Buffalo TeraStation {#buffalo-terastation-configuration}

I dispositivi Buffalo TeraStation hanno capacità di notifica email limitate ma funzionali. La configurazione è semplice una volta individuate le opzioni corrette.

> \[!CAUTION]
> Gli aggiornamenti firmware per Buffalo TeraStation sono poco frequenti. Assicurati di utilizzare il firmware più recente disponibile per il tuo modello prima di configurare l'email.

1. **Accedi alla Configurazione Web**
   * Connettiti all'interfaccia web della tua TeraStation
   * Vai su **Sistema** > **Notifiche**

2. **Configura le Impostazioni Email**
   * Server SMTP: `smtp.forwardemail.net`
   * Porta: `465` (SSL/TLS, consigliato) o `587` (STARTTLS)
   * Nome utente: Il tuo alias Forward Email
   * Password: Password generata da [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Abilita la crittografia SSL/TLS

3. **Imposta le Preferenze di Notifica**
   * Scegli quali eventi attivano le email (errori disco, avvisi temperatura, ecc.)
   * Inserisci gli indirizzi email dei destinatari
   * Salva e testa la configurazione

> \[!NOTE]
> Alcuni modelli TeraStation più vecchi potrebbero avere opzioni di configurazione SMTP limitate. Consulta la documentazione del tuo modello per le capacità specifiche.
## Configurazione Western Digital My Cloud {#western-digital-my-cloud-configuration}

I dispositivi Western Digital My Cloud con OS 5 supportano le notifiche email, anche se l'interfaccia può essere un po' nascosta nelle impostazioni.

> \[!WARNING]
> Western Digital ha interrotto il supporto per molti modelli My Cloud. Verifica se il tuo dispositivo riceve ancora aggiornamenti firmware prima di fare affidamento sulle notifiche email per avvisi critici.

1. **Naviga su Impostazioni**
   * Apri la dashboard web di My Cloud
   * Vai su **Impostazioni** > **Generale** > **Notifiche**

2. **Configura i dettagli SMTP**
   * Server di posta: `smtp.forwardemail.net`
   * Porta: `465` (SSL/TLS, consigliata) o `587` (STARTTLS)
   * Nome utente: Il tuo alias Forward Email
   * Password: Password generata da [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Abilita la crittografia

3. **Configura i tipi di avviso**
   * Seleziona le categorie di notifica (avvisi di sistema, stato disco, ecc.)
   * Aggiungi gli indirizzi email dei destinatari
   * Testa la configurazione email

> \[!TIP]
> Consigliamo di usare la porta `465` con SSL/TLS. Se riscontri problemi, la porta `587` con STARTTLS è anch'essa supportata.


## Configurazione Email TrueNAS {#truenas-email-configuration}

TrueNAS (sia SCALE che CORE) offre un eccellente supporto per le notifiche email con opzioni di configurazione dettagliate.

> \[!NOTE]
> TrueNAS fornisce alcune delle funzionalità di notifica email più complete tra i sistemi NAS. Puoi configurare regole di avviso dettagliate e destinatari multipli.

1. **Accedi alle Impostazioni di Sistema**
   * Effettua il login nell'interfaccia web di TrueNAS
   * Naviga su **Sistema** > **Email**

2. **Configura le impostazioni SMTP**
   * Server di posta in uscita: `smtp.forwardemail.net`
   * Porta server di posta: `465` (consigliata) o `587`
   * Sicurezza: SSL/TLS (per 465, consigliata) o STARTTLS (per 587)
   * Nome utente: Il tuo alias Forward Email
   * Password: Password generata da [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Configura gli avvisi**
   * Vai su **Sistema** > **Servizi di Avviso**
   * Configura quali avvisi devono essere inviati via email
   * Imposta gli indirizzi destinatari e i livelli di avviso
   * Testa la configurazione con la funzione di test integrata

> \[!IMPORTANT]
> TrueNAS permette di configurare diversi livelli di avviso (INFO, NOTICE, WARNING, ERROR, CRITICAL). Scegli livelli appropriati per evitare spam email garantendo che vengano segnalati problemi critici.


## Configurazione OpenMediaVault {#openmediavault-configuration}

OpenMediaVault offre solide capacità di notifica email tramite la sua interfaccia web. Il processo di configurazione è semplice e lineare.

> \[!NOTE]
> Il sistema di notifiche di OpenMediaVault si basa su plugin. Assicurati di avere il plugin per le notifiche email installato e abilitato.

1. **Accedi alle Impostazioni di Notifica**
   * Apri l'interfaccia web di OpenMediaVault
   * Vai su **Sistema** > **Notifica** > **Email**

2. **Configura i parametri SMTP**
   * Server SMTP: `smtp.forwardemail.net`
   * Porta: `465` (SSL/TLS, consigliata) o `587` (STARTTLS)
   * Nome utente: Il tuo alias Forward Email
   * Password: Password generata da [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Abilita SSL/TLS

3. **Configura le regole di notifica**
   * Naviga su **Sistema** > **Notifica** > **Notifiche**
   * Configura quali eventi di sistema devono attivare le email
   * Imposta gli indirizzi destinatari
   * Testa la funzionalità email

> \[!TIP]
> OpenMediaVault permette di configurare orari di notifica. Puoi impostare orari di silenzio o limitare la frequenza delle notifiche per evitare di essere sommerso da avvisi.


## Configurazione Raspberry Pi NAS {#raspberry-pi-nas-configuration}

Il Raspberry Pi rappresenta un eccellente punto di ingresso nelle funzionalità NAS, offrendo una soluzione economica per ambienti domestici e piccoli uffici. Configurare un Raspberry Pi come dispositivo NAS implica la configurazione di protocolli di condivisione file, notifiche email e servizi di rete essenziali.

> \[!TIP]
> Per gli appassionati di Raspberry Pi, consigliamo vivamente di completare la configurazione NAS con [PiKVM](https://pikvm.org/) per la gestione remota del server e [Pi-hole](https://pi-hole.net/) per il blocco degli annunci a livello di rete e la gestione DNS. Questi strumenti creano un ambiente home lab completo.
### Configurazione Iniziale del Raspberry Pi {#initial-raspberry-pi-setup}

Prima di configurare i servizi NAS, assicurati che il tuo Raspberry Pi esegua l'ultima versione di Raspberry Pi OS e disponga di spazio di archiviazione adeguato. Una scheda microSD di alta qualità (Classe 10 o superiore) o un SSD USB 3.0 offrono prestazioni e affidabilità migliori per le operazioni NAS.

1. **Aggiorna il sistema** eseguendo `sudo apt update && sudo apt upgrade -y` per assicurarti che tutti i pacchetti siano aggiornati.

2. **Abilita l'accesso SSH** usando `sudo systemctl enable ssh && sudo systemctl start ssh` per l'amministrazione remota.

3. **Configura un indirizzo IP statico** modificando `/etc/dhcpcd.conf` per garantire un accesso di rete coerente.

4. **Configura lo storage esterno** collegando e montando unità USB o configurando array RAID per la ridondanza dei dati.

### Configurazione Condivisione File Samba {#samba-file-sharing-configuration}

Samba fornisce la condivisione di file compatibile con Windows, rendendo il tuo Raspberry Pi accessibile da qualsiasi dispositivo sulla tua rete. Il processo di configurazione prevede l'installazione di Samba, la creazione delle condivisioni e la configurazione dell'autenticazione utente.

Installa Samba usando `sudo apt install samba samba-common-bin` e configura il file principale di configurazione in `/etc/samba/smb.conf`. Crea le directory condivise e imposta i permessi appropriati con `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Configura le condivisioni Samba aggiungendo sezioni al file di configurazione per ogni directory condivisa. Imposta l'autenticazione utente usando `sudo smbpasswd -a username` per creare password specifiche Samba per l'accesso in rete.

> \[!IMPORTANT]
> Usa sempre password robuste per gli utenti Samba e considera di abilitare l'accesso guest solo per cartelle condivise non sensibili. Consulta la [documentazione ufficiale di Samba](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) per configurazioni di sicurezza avanzate.

### Configurazione Server FTP {#ftp-server-setup}

FTP fornisce un altro metodo per l'accesso ai file, particolarmente utile per backup automatizzati e gestione remota dei file. Installa e configura vsftpd (Very Secure FTP Daemon) per servizi FTP affidabili.

Installa vsftpd usando `sudo apt install vsftpd` e configura il servizio modificando `/etc/vsftpd.conf`. Abilita l'accesso per utenti locali, configura le impostazioni della modalità passiva e imposta le restrizioni di sicurezza appropriate.

Crea utenti FTP e configura i permessi di accesso alle directory. Considera l'uso di SFTP (SSH File Transfer Protocol) invece del tradizionale FTP per una maggiore sicurezza, poiché cripta tutte le trasmissioni di dati.

> \[!CAUTION]
> Il FTP tradizionale trasmette le password in chiaro. Usa sempre SFTP o configura FTP con crittografia TLS per trasferimenti di file sicuri. Consulta le [best practice di sicurezza di vsftpd](https://security.appspot.com/vsftpd.html) prima della distribuzione.

### Configurazione Notifiche Email {#email-notification-configuration}

Configura il tuo Raspberry Pi NAS per inviare notifiche email per eventi di sistema, avvisi di storage e stato di completamento backup. Questo comporta l'installazione e la configurazione di un mail transfer agent e l'integrazione con Forward Email.

Installa `msmtp` come client SMTP leggero usando `sudo apt install msmtp msmtp-mta`. Crea il file di configurazione in `/etc/msmtprc` con le seguenti impostazioni:

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

Configura le notifiche di sistema impostando cron job e script di monitoraggio che utilizzano `msmtp` per inviare avvisi. Crea script per il monitoraggio dello spazio su disco, avvisi di temperatura e notifiche di completamento backup.

### Funzionalità Avanzate NAS Raspberry Pi {#advanced-raspberry-pi-nas-features}

Migliora il tuo Raspberry Pi NAS con servizi aggiuntivi e capacità di monitoraggio. Installa e configura strumenti di monitoraggio di rete, soluzioni di backup automatizzate e servizi di accesso remoto.

Configura [Nextcloud](https://nextcloud.com/) per funzionalità simili al cloud con accesso ai file via web, sincronizzazione del calendario e funzionalità collaborative. Installa usando Docker o la guida ufficiale di installazione Nextcloud per Raspberry Pi.
Configura backup automatici utilizzando `rsync` e `cron` per creare backup programmati dei dati critici. Imposta notifiche email per il completamento del backup e avvisi di errore utilizzando la tua configurazione Forward Email.

Implementa il monitoraggio della rete utilizzando strumenti come [Nagios](https://www.nagios.org/) o [Zabbix](https://www.zabbix.com/) per monitorare lo stato del sistema, la connettività di rete e la disponibilità dei servizi.

> \[!NOTE]
> Per gli utenti che gestiscono infrastrutture di rete, considera l'integrazione di [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) con il tuo setup PiKVM per il controllo remoto degli interruttori fisici. Questa [guida all'integrazione Python](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) fornisce istruzioni dettagliate per automatizzare la gestione dei dispositivi fisici.

### Risoluzione dei problemi email Raspberry Pi {#raspberry-pi-email-troubleshooting}

I problemi comuni con la configurazione email su Raspberry Pi includono problemi di risoluzione DNS, restrizioni del firewall e fallimenti di autenticazione. La natura leggera dei sistemi Raspberry Pi può talvolta causare problemi di temporizzazione con le connessioni SMTP.

Se le notifiche email falliscono, controlla il file di log di `msmtp` in `/var/log/msmtp.log` per messaggi di errore dettagliati. Verifica che le tue credenziali Forward Email siano corrette e che il Raspberry Pi possa risolvere `smtp.forwardemail.net`.

Testa la funzionalità email usando la riga di comando: `echo "Test message" | msmtp recipient@example.com`. Questo aiuta a isolare problemi di configurazione da problemi specifici dell'applicazione.

Configura correttamente le impostazioni DNS in `/etc/resolv.conf` se riscontri problemi di risoluzione DNS. Considera l'uso di server DNS pubblici come `8.8.8.8` o `1.1.1.1` se il DNS locale non è affidabile.

### Ottimizzazione delle prestazioni {#performance-optimization}

Ottimizza le prestazioni del tuo Raspberry Pi NAS tramite una corretta configurazione dello storage, delle impostazioni di rete e delle risorse di sistema. Usa dispositivi di archiviazione di alta qualità e configura opzioni del file system appropriate per il tuo caso d'uso.

Abilita il boot USB 3.0 per migliori prestazioni di storage se usi dischi esterni. Configura la suddivisione della memoria GPU usando `sudo raspi-config` per allocare più RAM alle operazioni di sistema piuttosto che all'elaborazione grafica.

Monitora le prestazioni di sistema con strumenti come `htop`, `iotop` e `nethogs` per identificare colli di bottiglia e ottimizzare l'uso delle risorse. Considera l'aggiornamento a un Raspberry Pi 4 con 8GB di RAM per applicazioni NAS più esigenti.

Implementa soluzioni di raffreddamento adeguate per prevenire il thermal throttling durante operazioni intensive. Monitora la temperatura della CPU usando `/opt/vc/bin/vcgencmd measure_temp` e assicurati di avere una ventilazione adeguata.

### Considerazioni sulla sicurezza {#security-considerations}

Metti in sicurezza il tuo Raspberry Pi NAS implementando controlli di accesso appropriati, misure di sicurezza di rete e aggiornamenti di sicurezza regolari. Cambia le password di default, disabilita i servizi non necessari e configura regole firewall.

Installa e configura `fail2ban` per proteggerti dagli attacchi brute force su SSH e altri servizi. Imposta aggiornamenti di sicurezza automatici usando `unattended-upgrades` per garantire che le patch critiche di sicurezza vengano applicate tempestivamente.

Configura la segmentazione della rete per isolare il tuo NAS dagli altri dispositivi di rete quando possibile. Usa l'accesso VPN per connessioni remote invece di esporre direttamente i servizi su internet.

Esegui regolarmente il backup della configurazione e dei dati del Raspberry Pi per prevenire la perdita di dati dovuta a guasti hardware o incidenti di sicurezza. Testa le procedure di ripristino del backup per assicurarti la capacità di recupero dati.

La configurazione Raspberry Pi NAS fornisce un'eccellente base per apprendere i concetti di storage di rete offrendo al contempo funzionalità pratiche per ambienti domestici e piccoli uffici. La combinazione con Forward Email garantisce una consegna affidabile delle notifiche per il monitoraggio del sistema e gli avvisi di manutenzione.
