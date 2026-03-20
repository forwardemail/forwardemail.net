# Porta 25 bloqueada pelo ISP solução alternativa {#port-25-blocked-by-isp-workaround}


## Índice {#table-of-contents}

* [Como contornar o bloqueio do ISP para SMTP de entrada na porta 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Como contornar o bloqueio do ISP para SMTP de saída na porta 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Como posso verificar se meu ISP bloqueia portas](#how-can-i-check-if-my-isp-blocks-ports)


## Como contornar o bloqueio do ISP para SMTP de entrada na porta 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Se você não tem a porta 25 aberta no endereço IP do seu servidor de e-mail, então este guia é para você.

Por exemplo, você está executando um servidor de e-mail personalizado em casa, e seu Provedor de Serviços de Internet ("ISP") bloqueou a porta 25 de saída.

Como você não pode ter tráfego de saída na porta 25, então provavelmente também não terá tráfego de entrada na porta 25 devido a esse bloqueio.

Assumindo que você está usando nosso serviço para encaminhar e-mails, [você pode contornar esse problema através da resposta em nosso FAQ aqui](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Como contornar o bloqueio do ISP para SMTP de saída na porta 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Se seu ISP bloqueia a porta 25 de saída, então você terá que encontrar uma solução alternativa ou contatá-los.


## Como posso verificar se meu ISP bloqueia portas {#how-can-i-check-if-my-isp-blocks-ports}

Você pode executar `telnet smtp.forwardemail.net 25` no prompt de comando ou terminal para ver se sua conexão de saída na porta 25 está bloqueada.
