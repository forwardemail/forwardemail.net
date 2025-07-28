# Port 25 bloqué par la solution de contournement du FAI {#port-25-blocked-by-isp-workaround}

## Table des matières {#table-of-contents}

* [Comment contourner le blocage du SMTP entrant par le FAI sur le port 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Comment contourner le blocage du SMTP sortant par le FAI sur le port 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Comment puis-je vérifier si mon FAI bloque les ports](#how-can-i-check-if-my-isp-blocks-ports)

## Comment contourner le blocage du SMTP entrant par le FAI sur le port 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Si vous n'avez pas le port 25 ouvert sur l'adresse IP de votre serveur de messagerie, ce guide est pour vous.

Par exemple, vous utilisez un serveur de messagerie personnalisé à domicile et votre fournisseur d'accès Internet (« FAI ») a bloqué le port sortant 25.

Étant donné que vous ne pouvez pas avoir de trafic sortant sur le port 25, vous n'aurez probablement pas non plus de trafic entrant sur le port 25 en raison de ce blocage.

En supposant que vous utilisez notre service pour transférer des e-mails, [vous pouvez contourner ce problème grâce à notre réponse FAQ ici](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Comment contourner le blocage du SMTP sortant par le FAI sur le port 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Si votre FAI bloque le port sortant 25, vous devrez alors trouver une solution alternative ou le contacter.

## Comment puis-je vérifier si mon FAI bloque les ports {#how-can-i-check-if-my-isp-blocks-ports}

Vous pouvez exécuter `telnet smtp.forwardemail.net 25` à partir de la ligne de commande ou du terminal pour voir si votre connexion au port sortant 25 est bloquée.