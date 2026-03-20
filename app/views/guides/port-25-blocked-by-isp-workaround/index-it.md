# Porta 25 bloccata dall'ISP soluzione alternativa {#port-25-blocked-by-isp-workaround}


## Indice {#table-of-contents}

* [Come aggirare il blocco ISP della porta 25 SMTP in ingresso](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Come aggirare il blocco ISP della porta 25 SMTP in uscita](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Come posso verificare se il mio ISP blocca le porte](#how-can-i-check-if-my-isp-blocks-ports)


## Come aggirare il blocco ISP della porta 25 SMTP in ingresso {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Se non hai la porta 25 aperta sull'indirizzo IP del tuo server di posta, allora questa guida fa per te.

Ad esempio, stai gestendo un server di posta personalizzato a casa, e il tuo Internet Service Provider ("ISP") ha bloccato la porta 25 in uscita.

Poiché non puoi avere traffico in uscita sulla porta 25, molto probabilmente non avrai nemmeno traffico in ingresso sulla porta 25 a causa di questo blocco.

Supponendo che tu stia usando il nostro servizio per inoltrare le email, [puoi aggirare questo problema tramite la nostra risposta FAQ qui](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Come aggirare il blocco ISP della porta 25 SMTP in uscita {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Se il tuo ISP blocca la porta 25 in uscita, allora dovrai trovare una soluzione alternativa o contattarli.


## Come posso verificare se il mio ISP blocca le porte {#how-can-i-check-if-my-isp-blocks-ports}

Puoi eseguire `telnet smtp.forwardemail.net 25` da riga di comando o terminale per vedere se la tua connessione in uscita sulla porta 25 è bloccata.
