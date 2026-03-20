# Contournement du blocage du port 25 par le FAI {#port-25-blocked-by-isp-workaround}


## Table des matières {#table-of-contents}

* [Comment contourner le blocage du SMTP entrant sur le port 25 par le FAI](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Comment contourner le blocage du SMTP sortant sur le port 25 par le FAI](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Comment vérifier si mon FAI bloque des ports](#how-can-i-check-if-my-isp-blocks-ports)


## Comment contourner le blocage du SMTP entrant sur le port 25 par le FAI {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Si vous n'avez pas le port 25 ouvert sur l'adresse IP de votre serveur mail, alors ce guide est pour vous.

Par exemple, vous gérez un serveur mail personnalisé chez vous, et votre fournisseur d'accès Internet ("FAI") a bloqué le port 25 sortant.

Puisque vous ne pouvez pas avoir de trafic sortant sur le port 25, il est très probable que vous n'ayez pas non plus de trafic entrant sur le port 25 à cause de ce blocage.

En supposant que vous utilisez notre service pour transférer des emails, [vous pouvez contourner ce problème grâce à notre réponse FAQ ici](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Comment contourner le blocage du SMTP sortant sur le port 25 par le FAI {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Si votre FAI bloque le port 25 sortant, vous devrez trouver une solution alternative ou les contacter.


## Comment vérifier si mon FAI bloque des ports {#how-can-i-check-if-my-isp-blocks-ports}

Vous pouvez exécuter `telnet smtp.forwardemail.net 25` depuis la ligne de commande ou le terminal pour voir si votre connexion sortante sur le port 25 est bloquée.
