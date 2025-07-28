# Porta 25 bloqueada pela solução alternativa do ISP {#port-25-blocked-by-isp-workaround}

## Índice {#table-of-contents}

* [Como contornar o bloqueio do ISP de SMTP de entrada na porta 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Como contornar o bloqueio do SMTP de saída pelo ISP na porta 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Como posso verificar se meu ISP bloqueia portas](#how-can-i-check-if-my-isp-blocks-ports)

## Como contornar o bloqueio do ISP por SMTP de entrada na porta 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Se você não tiver a porta 25 aberta no endereço IP do seu servidor de e-mail, este guia é para você.

Por exemplo, você está executando um servidor de e-mail personalizado em casa, e seu Provedor de Serviços de Internet ("ISP") bloqueou a porta de saída 25.

Como você não pode ter tráfego de saída na porta 25, provavelmente também não terá tráfego de entrada na porta 25 devido a esse bloqueio.

Supondo que você esteja usando nosso serviço para encaminhar e-mails, [você pode contornar esse problema por meio de nossa resposta de FAQ aqui](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Como contornar o bloqueio do ISP por SMTP de saída na porta 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Se o seu ISP bloquear a porta de saída 25, você terá que encontrar uma solução alternativa ou entrar em contato com ele.

## Como posso verificar se meu ISP bloqueia as portas {#how-can-i-check-if-my-isp-blocks-ports}

Você pode executar `telnet smtp.forwardemail.net 25` na linha de comando ou no terminal para verificar se sua conexão de saída na porta 25 está bloqueada.