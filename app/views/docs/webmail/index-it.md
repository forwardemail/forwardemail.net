# Guida alla Webmail di Forward Email {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>TL;DR:</strong> La <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">webmail</a> è dove leggi e invii la posta. La <a href="/my-account/domains">dashboard web</a> è dove configuri domini, alias e password. Accedi alla webmail con un indirizzo alias e una password generata nella dashboard. La webmail è gratuita e <a href="/faq#do-you-offer-a-webmail-client">open source</a>, e la stessa app funziona nel browser, su desktop, su mobile e in un terminale.
</p>


## Indice {#table-of-contents}

* [Dove trovare la webmail](#where-to-get-webmail)
* [Webmail e dashboard web](#webmail-and-the-web-dashboard)
* [Accesso](#signing-in)
  * [Genera una password per l'alias](#generate-an-alias-password)
  * [Accedi alla webmail](#sign-in-to-webmail)
* [Usare più di un account](#using-more-than-one-account)
  * [Invia come un altro account connesso](#send-as-another-signed-in-account)
* [Invia da qualsiasi indirizzo del tuo dominio](#send-from-any-address-on-your-domain)
  * [Passo 1: Genera una password catch-all nella dashboard](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Passo 2: Salvala nella webmail](#step-2-save-it-in-webmail)
  * [Passo 3: Scegli l'indirizzo quando scrivi](#step-3-pick-the-address-when-you-compose)
  * [Cosa sapere sull'invio catch-all](#what-to-know-about-catch-all-sending)
* [Impostazioni della webmail in breve](#webmail-settings-at-a-glance)
* [Privacy e App Lock](#privacy-and-app-lock)
* [Risoluzione dei problemi](#troubleshooting)


## Dove trovare la webmail {#where-to-get-webmail}

| Piattaforma                     | Dove                                                                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Browser                         | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (nessuna installazione)    |
| Desktop (macOS, Windows, Linux) | La nostra <a href="/download">pagina di download</a>                                                                                   |
| Mobile (Android, iOS)           | La nostra <a href="/download">pagina di download</a>                                                                                   |
| Terminale                       | Il comando `forwardemail`. Vedi [Avete un'app per il terminale](/faq#do-you-have-a-terminal-app)                                       |

Sono tutte costruite dallo stesso progetto open source, quindi tutto ciò che trovi in questa guida vale per ognuna. Le impostazioni e le password salvate sono conservate su ciascun dispositivo, quindi configurale su ogni dispositivo che usi.


## Webmail e dashboard web {#webmail-and-the-web-dashboard}

Forward Email ha due posti separati in cui accedere, e usano credenziali diverse:

|                          | Dashboard web (forwardemail.net)                                                                               | Webmail (mail.forwardemail.net e le app)                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Accedi con**           | L'email e la password del tuo account Forward Email (più 2FA o una passkey)                                    | Un indirizzo alias (come `you@example.com`) e la sua password generata                  |
| **Serve per**            | Aggiungere domini, DNS, alias, fatturazione, membri del team, generare password, Impostazioni avanzate         | Leggere e inviare posta, cartelle, etichette, ricerca, calendario, contatti, filtri     |
| **Password create qui**  | Password degli alias e password catch-all                                                                      | Nessuna. La webmail usa le password che hai creato nella dashboard                      |

Una configurazione tipica è questa:

1. Nella dashboard, aggiungi il tuo dominio e configura il DNS.
2. Crea un alias con l'archiviazione IMAP attivata (per esempio `you@example.com`).
3. Genera una password per quell'alias.
4. Accedi alla webmail con quell'alias e quella password.

Per inviare posta, il tuo dominio deve anche avere l'SMTP in uscita attivato in <a href="/my-account/domains">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni avanzate <i class="fa fa-angle-right"></i> Configurazione SMTP in uscita, come per qualsiasi altro client email.


## Accesso {#signing-in}

### Genera una password per l'alias {#generate-an-alias-password}

1. Vai su <a href="/my-account/domains">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias.
2. Accanto all'alias, clicca su **Genera password**.
3. Copia la password. Viene mostrata una sola volta.

È la stessa password che useresti per IMAP, POP3, SMTP, CalDAV e CardDAV. Non serve per accedere alla dashboard web.

### Accedi alla webmail {#sign-in-to-webmail}

Apri la webmail e inserisci l'indirizzo alias completo e la password generata. Se prima vuoi solo dare un'occhiata, prova la demo dalla schermata di accesso.


## Usare più di un account {#using-more-than-one-account}

Puoi accedere a più alias contemporaneamente, anche su domini diversi. Passa dall'uno all'altro dal menu dell'account e gestiscili in **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Gli account restano sul dispositivo su cui li hai aggiunti e non vengono sincronizzati.

### Invia come un altro account connesso {#send-as-another-signed-in-account}

Quando scrivi, il menu **From** elenca tutti gli account connessi su questo dispositivo. Scegline uno per inviare da quell'indirizzo. Il messaggio viene inviato con la password di quell'account, e la copia finisce nella cartella Inviati di quell'account.


## Invia da qualsiasi indirizzo del tuo dominio {#send-from-any-address-on-your-domain}

Se possiedi un dominio, puoi inviare da qualsiasi indirizzo su di esso, come `billing@example.com` o `no-reply@example.com`, senza creare un alias e accedere per ognuno. Lo fai con una **password catch-all** per il dominio.

**Non** accedi alla webmail come account wildcard o catch-all, e non c'è nessuna funzione da attivare. Salvi la password catch-all una volta nelle impostazioni della webmail, e poi il menu From ti permette di digitare qualsiasi indirizzo di quel dominio.

### Passo 1: Genera una password catch-all nella dashboard {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Vai su <a href="/my-account/domains">Il mio account <i class="fa fa-angle-right"></i> Domini</a> e scegli il tuo dominio.
2. Apri **Impostazioni avanzate** e trova **Password universali**.
3. Clicca su **Genera password**. Lascia il campo vuoto per ottenere una password casuale e sicura, e aggiungi una descrizione se vuoi (per esempio "Webmail sul mio portatile").
4. Copia la password. Viene mostrata una sola volta.

Devi essere un amministratore del dominio per vedere questa sezione. Usa **Gestisci password** nello stesso punto per vedere o eliminare le password catch-all in seguito. Eliminarne una la fa smettere di funzionare ovunque sia salvata.

### Passo 2: Salvala nella webmail {#step-2-save-it-in-webmail}

1. Nella webmail, apri **Settings <i class="fa fa-angle-right"></i> General**.
2. Trova la scheda chiamata **Send from any address**, subito sotto **Your accounts**.
3. Clicca su **Add catch-all password**.
4. Inserisci il dominio (per esempio `example.com`) e incolla la password catch-all.
5. Clicca su **Save**. Vedrai "You can now send from any address @example.com".

Puoi salvare password per tutti i domini che vuoi. Per rimuoverne una, clicca sull'icona del cestino accanto.

### Passo 3: Scegli l'indirizzo quando scrivi {#step-3-pick-the-address-when-you-compose}

1. Inizia un nuovo messaggio.
2. Apri il menu **From**. Sotto i tuoi account connessi c'è una voce per ogni dominio salvato: **Other address @example.com…**
3. Selezionala. La riga From diventa una casella di testo seguita da `@example.com`.
4. Digita la parte prima della @ (per esempio `billing`) e invia.

Le bozze conservano l'indirizzo che hai digitato, quindi una bozza salvata si riapre con lo stesso indirizzo From.

### Cosa sapere sull'invio catch-all {#what-to-know-about-catch-all-sending}

* **Può solo inviare.** Una password catch-all funziona solo per l'invio. Non può aprire una casella di posta, quindi non puoi usarla per leggere la posta di `billing@example.com`. Per leggere le risposte, crea un alias (o un alias catch-all che inoltra a te) per quell'indirizzo.
* **Le copie inviate vanno all'account che stai usando.** Un messaggio inviato come `billing@example.com` viene archiviato nella cartella Inviati dell'account da cui l'hai scritto.
* **Funziona da ogni account sul dispositivo.** La password salvata non è legata a un solo account connesso. Qualsiasi account su quel dispositivo può usarla.
* **Resta su questo dispositivo.** La password è conservata solo sul dispositivo in cui l'hai salvata. Non viene sincronizzata, e l'abbinamento dei dispositivi tramite QR non la copia. Aggiungila di nuovo su ogni dispositivo.
* **App Lock la protegge.** Se App Lock è attivo, la password è cifrata insieme al resto dei tuoi dati locali, e le voci **Other address** sono nascoste mentre l'app è bloccata.
* **L'invio programmato non è disponibile** per gli indirizzi inviati con una password catch-all, perché quella password non può rileggere o annullare un messaggio programmato. Invia subito, oppure invia come un account connesso.
* **Una password sbagliata non ti disconnette.** Se la password catch-all è sbagliata o è stata eliminata nella dashboard, l'invio fallisce con un errore e resti connesso.


## Impostazioni della webmail in breve {#webmail-settings-at-a-glance}

| Sezione                | Cosa comprende                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| **General**            | I tuoi account, invio da qualsiasi indirizzo (password catch-all), notifiche, archiviazione          |
| **Appearance**         | Tema, layout, densità, impostazioni predefinite dell'editor, firma, carattere, link esterni          |
| **Privacy & Security** | App Lock, crittografia PGP, opzioni di privacy, segnalazione dello spam                              |
| **Folders & Labels**   | Cartelle speciali, le tue cartelle, etichette                                                        |
| **Filters**            | Filtri di posta per l'alias connesso                                                                 |
| **Calendar**           | Inizio della settimana e attività                                                                    |
| **Search**             | Indicizzazione, stato dell'indice, ricerche salvate, operatori di ricerca                            |
| **Advanced**           | Archiviazione della casella, cache locale e ripristino dell'app                                      |
| **Keyboard Shortcuts** | Tutte le scorciatoie                                                                                 |
| **About & Help**       | Versione, download dell'app desktop, feedback e link                                                 |

Le cose che appartengono al dominio o all'alias stesso, come DNS, destinatari dell'inoltro, limiti di archiviazione, risponditori automatici per le vacanze, password catch-all e scansione dello spam, si impostano nella <a href="/my-account/domains">dashboard web</a>.


## Privacy e App Lock {#privacy-and-app-lock}

La webmail conserva una copia locale della tua posta, così è veloce e funziona offline. **App Lock** (in **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) cifra questi dati locali, le tue impostazioni e le password salvate sul dispositivo, e si sblocca con una passkey o un PIN. La posta e gli aggiornamenti in tempo reale viaggiano direttamente tra l'app e Forward Email, senza servizi pubblicitari o di tracciamento nel mezzo.


## Risoluzione dei problemi {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

La webmail non ha una password per quell'indirizzo su questo dispositivo. Accedi a quell'alias, oppure salva la password catch-all del dominio in **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Se l'app è bloccata, sbloccala prima.

**La voce "Other address" non compare nel menu From.**

Controlla di aver salvato la password catch-all su questo dispositivo e che App Lock sia sbloccato.

**L'invio da un indirizzo catch-all fallisce con un errore di autenticazione.**

La password catch-all potrebbe essere stata eliminata o digitata male. Generane una nuova nella dashboard, poi rimuovi quella vecchia nella webmail e aggiungi quella nuova.

**La password della mia dashboard non funziona nella webmail.**

La webmail richiede una password dell'alias, non la password della dashboard. Vedi [Genera una password per l'alias](#generate-an-alias-password).

Ancora bloccato? Consulta le nostre <a href="/faq">FAQ</a> oppure <a href="/help">contattaci</a>.
