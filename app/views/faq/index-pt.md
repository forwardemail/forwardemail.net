# Perguntas Frequentes {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Perguntas frequentes sobre Forward Email" class="rounded-lg" />


## Índice {#table-of-contents}

* [Início Rápido](#quick-start)
* [Introdução](#introduction)
  * [O que é Forward Email](#what-is-forward-email)
  * [Quem usa o Forward Email](#who-uses-forward-email)
  * [Qual é a história do Forward Email](#what-is-forward-emails-history)
  * [Quão rápido é este serviço](#how-fast-is-this-service)
* [Clientes de Email](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Dispositivos Móveis](#mobile-devices)
  * [Configuração de Relay SMTP Sendmail](#sendmail-smtp-relay-configuration)
  * [Configuração de Relay SMTP Exim4](#exim4-smtp-relay-configuration)
  * [Configuração de Cliente SMTP msmtp](#msmtp-smtp-client-configuration)
  * [Clientes de Email via Linha de Comando](#command-line-email-clients)
  * [Configuração de Email no Windows](#windows-email-configuration)
  * [Configuração de Relay SMTP Postfix](#postfix-smtp-relay-configuration)
  * [Como Enviar Email Como usando Gmail](#how-to-send-mail-as-using-gmail)
  * [Qual é o guia legado gratuito para Enviar Email Como usando Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Configuração Avançada de Roteamento Gmail](#advanced-gmail-routing-configuration)
  * [Configuração Avançada de Roteamento Outlook](#advanced-outlook-routing-configuration)
* [Resolução de Problemas](#troubleshooting)
  * [Por que não estou recebendo meus emails de teste](#why-am-i-not-receiving-my-test-emails)
  * [Como configuro meu cliente de email para funcionar com Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Por que meus emails estão indo para Spam e Lixo e como posso verificar a reputação do meu domínio](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [O que devo fazer se receber emails de spam](#what-should-i-do-if-i-receive-spam-emails)
  * [Por que meus emails de teste enviados para mim mesmo no Gmail aparecem como "suspeitos"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Posso remover o via forwardemail dot net no Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Gerenciamento de Dados](#data-management)
  * [Onde estão localizados seus servidores](#where-are-your-servers-located)
  * [Como exporto e faço backup da minha caixa de correio](#how-do-i-export-and-backup-my-mailbox)
  * [Como importo e migro minha caixa de correio existente](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Como uso meu próprio armazenamento compatível com S3 para backups](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Como converto backups SQLite para arquivos EML](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Vocês suportam auto-hospedagem](#do-you-support-self-hosting)
* [Configuração de Email](#email-configuration)
  * [Como começo e configuro o encaminhamento de email](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Posso usar múltiplos servidores e trocas MX para encaminhamento avançado](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Como configuro um respondedor de férias (resposta automática fora do escritório)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Como configuro SPF para Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Como configuro DKIM para Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Como configuro DMARC para Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Como visualizo Relatórios DMARC](#how-do-i-view-dmarc-reports)
  * [Como conecto e configuro meus contatos](#how-do-i-connect-and-configure-my-contacts)
  * [Como conecto e configuro meus calendários](#how-do-i-connect-and-configure-my-calendars)
  * [Como adiciono mais calendários e gerencio calendários existentes](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Como conecto e configuro tarefas e lembretes](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Por que não consigo criar tarefas no Lembretes do macOS](#why-cant-i-create-tasks-in-macos-reminders)
  * [Como configuro Tasks.org no Android](#how-do-i-set-up-tasksorg-on-android)
  * [Como configuro SRS para Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Como configuro MTA-STS para Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Como adiciono uma foto de perfil ao meu endereço de email](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Recursos Avançados](#advanced-features)
  * [Vocês suportam newsletters ou listas de email para marketing](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Vocês suportam envio de email via API](#do-you-support-sending-email-with-api)
  * [Vocês suportam recebimento de email via IMAP](#do-you-support-receiving-email-with-imap)
  * [Vocês suportam POP3](#do-you-support-pop3)
  * [Vocês suportam calendários (CalDAV)](#do-you-support-calendars-caldav)
  * [Vocês suportam tarefas e lembretes (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Vocês suportam contatos (CardDAV)](#do-you-support-contacts-carddav)
  * [Vocês suportam envio de email via SMTP](#do-you-support-sending-email-with-smtp)
  * [Vocês suportam OpenPGP/MIME, criptografia ponta a ponta ("E2EE") e Web Key Directory ("WKD")] (#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Vocês suportam criptografia S/MIME](#do-you-support-smime-encryption)
  * [Vocês suportam filtragem de email Sieve](#do-you-support-sieve-email-filtering)
  * [Vocês suportam MTA-STS](#do-you-support-mta-sts)
  * [Vocês suportam passkeys e WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Vocês suportam melhores práticas de email](#do-you-support-email-best-practices)
  * [Vocês suportam webhooks de bounce](#do-you-support-bounce-webhooks)
  * [Vocês suportam webhooks](#do-you-support-webhooks)
  * [Vocês suportam expressões regulares ou regex](#do-you-support-regular-expressions-or-regex)
  * [Quais são seus limites de SMTP de saída](#what-are-your-outbound-smtp-limits)
  * [Preciso de aprovação para habilitar SMTP](#do-i-need-approval-to-enable-smtp)
  * [Quais são as configurações do servidor SMTP](#what-are-your-smtp-server-configuration-settings)
  * [Quais são as configurações do servidor IMAP](#what-are-your-imap-server-configuration-settings)
  * [Quais são as configurações do servidor POP3](#what-are-your-pop3-server-configuration-settings)
  * [Como configuro autodiscovery de email para meu domínio](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Segurança](#security-1)
  * [Técnicas Avançadas de Endurecimento de Servidor](#advanced-server-hardening-techniques)
  * [Vocês possuem certificações SOC 2 ou ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Vocês usam criptografia TLS para encaminhamento de email](#do-you-use-tls-encryption-for-email-forwarding)
  * [Vocês preservam cabeçalhos de autenticação de email](#do-you-preserve-email-authentication-headers)
  * [Vocês preservam cabeçalhos originais de email e previnem spoofing](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Como vocês protegem contra spam e abuso](#how-do-you-protect-against-spam-and-abuse)
  * [Vocês armazenam conteúdo de email em disco](#do-you-store-email-content-on-disk)
  * [O conteúdo do email pode ser exposto durante falhas do sistema](#can-email-content-be-exposed-during-system-crashes)
  * [Quem tem acesso à sua infraestrutura de email](#who-has-access-to-your-email-infrastructure)
  * [Quais provedores de infraestrutura vocês usam](#what-infrastructure-providers-do-you-use)
  * [Vocês oferecem Acordo de Processamento de Dados (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Como vocês lidam com notificações de violação de dados](#how-do-you-handle-data-breach-notifications)
  * [Vocês oferecem um ambiente de teste](#do-you-offer-a-test-environment)
  * [Vocês fornecem ferramentas de monitoramento e alerta](#do-you-provide-monitoring-and-alerting-tools)
  * [Como vocês garantem alta disponibilidade](#how-do-you-ensure-high-availability)
  * [Vocês estão em conformidade com a Seção 889 da Lei de Autorização de Defesa Nacional (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Detalhes do Sistema e Técnicos](#system-and-technical-details)
  * [Vocês armazenam emails e seus conteúdos](#do-you-store-emails-and-their-contents)
  * [Como funciona seu sistema de encaminhamento de email](#how-does-your-email-forwarding-system-work)
  * [Como vocês processam um email para encaminhamento](#how-do-you-process-an-email-for-forwarding)
  * [Como vocês lidam com problemas de entrega de email](#how-do-you-handle-email-delivery-issues)
  * [Como vocês lidam com bloqueios dos seus endereços IP](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [O que são endereços postmaster](#what-are-postmaster-addresses)
  * [O que são endereços no-reply](#what-are-no-reply-addresses)
  * [Quais são os endereços IP do seu servidor](#what-are-your-servers-ip-addresses)
  * [Vocês possuem uma lista de permissões (allowlist)](#do-you-have-an-allowlist)
  * [Quais extensões de nome de domínio são permitidas por padrão](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Qual é o critério da sua lista de permissões](#what-is-your-allowlist-criteria)
  * [Quais extensões de nome de domínio podem ser usadas gratuitamente](#what-domain-name-extensions-can-be-used-for-free)
  * [Vocês possuem uma lista cinza (greylist)](#do-you-have-a-greylist)
  * [Vocês possuem uma lista de negação (denylist)](#do-you-have-a-denylist)
  * [Vocês possuem limitação de taxa (rate limiting)](#do-you-have-rate-limiting)
  * [Como vocês protegem contra backscatter](#how-do-you-protect-against-backscatter)
  * [Prevenir bounces de spammers conhecidos no MAIL FROM](#prevent-bounces-from-known-mail-from-spammers)
  * [Prevenir bounces desnecessários para proteger contra backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Como vocês determinam uma impressão digital de email](#how-do-you-determine-an-email-fingerprint)
  * [Posso encaminhar emails para portas diferentes da 25 (ex: se meu ISP bloqueou a porta 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Suporta o símbolo plus + para aliases do Gmail](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Suporta subdomínios](#does-it-support-sub-domains)
  * [Este serviço encaminha os cabeçalhos do meu email](#does-this-forward-my-emails-headers)
  * [Este serviço é bem testado](#is-this-well-tested)
  * [Vocês repassam mensagens e códigos de resposta SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Como vocês previnem spammers e garantem boa reputação de encaminhamento de email](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Como vocês realizam consultas DNS em nomes de domínio](#how-do-you-perform-dns-lookups-on-domain-names)
* [Conta e Faturamento](#account-and-billing)
  * [Vocês oferecem garantia de devolução do dinheiro em planos pagos](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Se eu mudar de plano, vocês fazem rateio e reembolsam a diferença](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Posso usar este serviço de encaminhamento de email apenas como servidor MX "fallback" ou "fallover"](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Posso desabilitar aliases específicos](#can-i-disable-specific-aliases)
  * [Posso encaminhar emails para múltiplos destinatários](#can-i-forward-emails-to-multiple-recipients)
  * [Posso ter múltiplos destinatários globais catch-all](#can-i-have-multiple-global-catch-all-recipients)
  * [Existe um limite máximo no número de endereços de email para os quais posso encaminhar por alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Posso encaminhar emails recursivamente](#can-i-recursively-forward-emails)
  * [Pessoas podem cancelar ou registrar meu encaminhamento de email sem minha permissão](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Como é gratuito](#how-is-it-free)
  * [Qual é o limite máximo de tamanho de email](#what-is-the-max-email-size-limit)
  * [Vocês armazenam logs de emails](#do-you-store-logs-of-emails)
  * [Vocês armazenam logs de erros](#do-you-store-error-logs)
  * [Vocês leem meus emails](#do-you-read-my-emails)
  * [Posso "enviar email como" no Gmail com isso](#can-i-send-mail-as-in-gmail-with-this)
  * [Posso "enviar email como" no Outlook com isso](#can-i-send-mail-as-in-outlook-with-this)
  * [Posso "enviar email como" no Apple Mail e iCloud Mail com isso](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Posso encaminhar emails ilimitados com isso](#can-i-forward-unlimited-emails-with-this)
  * [Vocês oferecem domínios ilimitados por um preço](#do-you-offer-unlimited-domains-for-one-price)
  * [Quais métodos de pagamento vocês aceitam](#which-payment-methods-do-you-accept)
* [Recursos Adicionais](#additional-resources)
## Início Rápido {#quick-start}

Para começar com o Forward Email:

1. **Crie uma conta** em [forwardemail.net/register](https://forwardemail.net/register)

2. **Adicione e verifique seu domínio** em [Minha Conta → Domínios](/my-account/domains)

3. **Adicione e configure aliases/caixas de email** em [Minha Conta → Domínios](/my-account/domains) → Aliases

4. **Teste sua configuração** enviando um email para um dos seus novos aliases

> \[!TIP]
> Alterações no DNS podem levar até 24-48 horas para se propagar globalmente, embora frequentemente entrem em vigor muito antes.

> \[!IMPORTANT]
> Para melhor entregabilidade, recomendamos configurar os registros [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) e [DMARC](#how-do-i-set-up-dmarc-for-forward-email).


## Introdução {#introduction}

### O que é o Forward Email {#what-is-forward-email}

> \[!NOTE]
> O Forward Email é perfeito para indivíduos, pequenas empresas e desenvolvedores que desejam endereços de email profissionais sem o custo e a manutenção de uma solução completa de hospedagem de email.

O Forward Email é um **provedor de serviço de email completo** e **provedor de hospedagem de email para nomes de domínio personalizados**.

É o único serviço gratuito e de código aberto, que permite usar endereços de email com domínio personalizado sem a complexidade de configurar e manter seu próprio servidor de email.

Nosso serviço encaminha emails enviados para seu domínio personalizado para sua conta de email existente – e você pode até nos usar como seu provedor dedicado de hospedagem de email.

Principais recursos do Forward Email:

* **Email com Domínio Personalizado**: Use endereços de email profissionais com seu próprio nome de domínio
* **Plano Gratuito**: Encaminhamento básico de email sem custo
* **Privacidade Aprimorada**: Não lemos seus emails nem vendemos seus dados
* **Código Aberto**: Todo nosso código está disponível no GitHub
* **Suporte SMTP, IMAP e POP3**: Capacidades completas de envio e recebimento de email
* **Criptografia de Ponta a Ponta**: Suporte para OpenPGP/MIME
* **Aliases Catch-All Personalizados**: Crie aliases de email ilimitados

Você pode nos comparar com mais de 56 outros provedores de serviço de email em [nossa página de Comparação de Email](/blog/best-email-service).

> \[!TIP]
> Saiba mais sobre o Forward Email lendo nosso [Whitepaper Técnico](/technical-whitepaper.pdf) gratuito

### Quem usa o Forward Email {#who-uses-forward-email}

Fornecemos serviço de hospedagem e encaminhamento de email para mais de 500.000 domínios e estes usuários notáveis:

| Cliente                                 | Estudo de Caso                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Academia Naval dos EUA                   | [:page_facing_up: Estudo de Caso](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                                | [:page_facing_up: Estudo de Caso](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                            |                                                                                                          |
| The Linux Foundation                     | [:page_facing_up: Estudo de Caso](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| The PHP Foundation                       |                                                                                                          |
| Fox News Radio                           |                                                                                                          |
| Disney Ad Sales                          |                                                                                                          |
| jQuery                                   | [:page_facing_up: Estudo de Caso](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                                |                                                                                                          |
| Ubuntu                                   | [:page_facing_up: Estudo de Caso](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                                  | [:page_facing_up: Estudo de Caso](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                                  | [:page_facing_up: Estudo de Caso](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Universidade de Cambridge                | [:page_facing_up: Estudo de Caso](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Universidade de Maryland                 | [:page_facing_up: Estudo de Caso](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Universidade de Washington               | [:page_facing_up: Estudo de Caso](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Universidade Tufts                       | [:page_facing_up: Estudo de Caso](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Swarthmore College                       | [:page_facing_up: Estudo de Caso](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Governo da Austrália do Sul              |                                                                                                          |
| Governo da República Dominicana          |                                                                                                          |
| Fly<span>.</span>io                      |                                                                                                          |
| RCD Hotels                               |                                                                                                          |
| Isaac Z. Schlueter (npm)                 | [:page_facing_up: Estudo de Caso](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Qual é a história do Forward Email {#what-is-forward-emails-history}

Você pode saber mais sobre o Forward Email na [nossa página Sobre](/about).

### Quão rápido é este serviço {#how-fast-is-this-service}

> \[!NOTE]
> Nosso sistema é projetado para velocidade e confiabilidade, com múltiplos servidores redundantes para garantir que seus e-mails sejam entregues prontamente.

O Forward Email entrega mensagens com atraso mínimo, tipicamente em segundos após o recebimento.

Métricas de desempenho:

* **Tempo Médio de Entrega**: Menos de 5-10 segundos do recebimento ao encaminhamento ([veja nossa página de monitoramento Tempo para Caixa de Entrada "TTI"](/tti))
* **Disponibilidade**: 99,9%+ de disponibilidade do serviço
* **Infraestrutura Global**: Servidores estrategicamente localizados para roteamento ideal
* **Escalonamento Automático**: Nosso sistema escala durante períodos de pico de e-mails

Operamos em tempo real, diferente de outros provedores que dependem de filas atrasadas.

Não gravamos em disco nem armazenamos logs – com [exceção de erros](#do-you-store-error-logs) e [SMTP de saída](#do-you-support-sending-email-with-smtp) (veja nossa [Política de Privacidade](/privacy)).

Tudo é feito em memória e [nosso código-fonte está no GitHub](https://github.com/forwardemail).


## Clientes de Email {#email-clients}

### Thunderbird {#thunderbird}

1. Crie um novo alias e gere uma senha no seu painel do Forward Email
2. Abra o Thunderbird e vá em **Editar → Configurações de Conta → Ações da Conta → Adicionar Conta de Email**
3. Insira seu nome, endereço Forward Email e senha
4. Clique em **Configurar manualmente** e insira:
   * Entrada: IMAP, `imap.forwardemail.net`, porta 993, SSL/TLS
   * Saída: SMTP, `smtp.forwardemail.net`, porta 465, SSL/TLS (recomendado; porta 587 com STARTTLS também é suportada)
5. Clique em **Concluído**

### Microsoft Outlook {#microsoft-outlook}

1. Crie um novo alias e gere uma senha no seu painel do Forward Email
2. Vá em **Arquivo → Adicionar Conta**
3. Insira seu endereço Forward Email e clique em **Conectar**
4. Escolha **Opções avançadas** e selecione **Deixe-me configurar minha conta manualmente**
5. Selecione **IMAP** e insira:
   * Entrada: `imap.forwardemail.net`, porta 993, SSL
   * Saída: `smtp.forwardemail.net`, porta 465, SSL/TLS (recomendado; porta 587 com STARTTLS também é suportada)
   * Nome de usuário: Seu endereço de e-mail completo
   * Senha: Sua senha gerada
6. Clique em **Conectar**

### Apple Mail {#apple-mail}

1. Crie um novo alias e gere uma senha no seu painel do Forward Email
2. Vá em **Mail → Preferências → Contas → +**
3. Selecione **Outra Conta de Email**
4. Insira seu nome, endereço Forward Email e senha
5. Para configurações do servidor, insira:
   * Entrada: `imap.forwardemail.net`
   * Saída: `smtp.forwardemail.net`
   * Nome de usuário: Seu endereço de e-mail completo
   * Senha: Sua senha gerada
6. Clique em **Entrar**

### eM Client {#em-client}

1. Crie um novo alias e gere uma senha no seu painel do Forward Email
2. Abra o eM Client e vá em **Menu → Contas → + Adicionar Conta**
3. Clique em **Email** e depois selecione **Outro**
4. Insira seu endereço Forward Email e clique em **Próximo**
5. Insira as seguintes configurações de servidor:
   * **Servidor de entrada**: `imap.forwardemail.net`
   * **Servidor de saída**: `smtp.forwardemail.net`
6. Insira seu endereço de e-mail completo como **Nome de usuário** e sua senha gerada como **Senha** para ambos os servidores de entrada e saída.
7. O eM Client testará a conexão. Quando passar, clique em **Próximo**.
8. Insira seu nome e escolha um nome para a conta.
9. Clique em **Concluir**.

### Dispositivos Móveis {#mobile-devices}

Para iOS:

1. Vá em **Ajustes → Mail → Contas → Adicionar Conta → Outra**
2. Toque em **Adicionar Conta de Email** e insira seus dados
3. Para configurações do servidor, use as mesmas configurações IMAP e SMTP acima

Para Android:

1. Vá em **Configurações → Contas → Adicionar Conta → Pessoal (IMAP)**
2. Insira seu endereço Forward Email e senha
3. Para configurações do servidor, use as mesmas configurações IMAP e SMTP acima

### Configuração de Relay SMTP Sendmail {#sendmail-smtp-relay-configuration}

Você pode configurar o Sendmail para retransmitir e-mails através dos servidores SMTP do Forward Email. Esta é uma configuração comum para sistemas legados ou aplicações que dependem do Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo Estimado de Configuração:</strong>
  <span>Menos de 20 minutos</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Isso requer um plano pago com acesso SMTP habilitado.
  </span>
</div>

#### Configuração {#configuration}

1. Edite seu arquivo `sendmail.mc`, normalmente localizado em `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Adicione as seguintes linhas para definir o smart host e a autenticação:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Crie o arquivo de autenticação `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Adicione suas credenciais do Forward Email no arquivo `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Gere o banco de dados de autenticação e proteja os arquivos:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Reconstrua a configuração do Sendmail e reinicie o serviço:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Testando {#testing}

Envie um email de teste para verificar a configuração:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Configuração do Relay SMTP Exim4 {#exim4-smtp-relay-configuration}

Exim4 é um MTA popular em sistemas baseados em Debian. Você pode configurá-lo para usar o Forward Email como smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo Estimado de Configuração:</strong>
  <span>Menos de 15 minutos</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Isso requer um plano pago com acesso SMTP habilitado.
  </span>
</div>

#### Configuração {#configuration-1}

1. Execute a ferramenta de configuração do Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Selecione as seguintes opções:
   * **Tipo geral de configuração de email:** email enviado por smarthost; recebido via SMTP ou fetchmail
   * **Nome do sistema de email:** your.hostname
   * **Endereços IP para escutar conexões SMTP de entrada:** 127.0.0.1 ; ::1
   * **Outros destinos para os quais o email é aceito:** (deixe em branco)
   * **Domínios para retransmitir email:** (deixe em branco)
   * **Endereço IP ou nome do host do smarthost de saída:** smtp.forwardemail.net::465
   * **Ocultar nome local do email no email de saída?** Não
   * **Manter o número de consultas DNS mínimo (Dial-on-Demand)?** Não
   * **Método de entrega para email local:** formato Mbox em /var/mail/
   * **Dividir configuração em arquivos pequenos?** Não

3. Edite o arquivo `passwd.client` para adicionar suas credenciais:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Adicione a seguinte linha:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Atualize a configuração e reinicie o Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Testando {#testing-1}

Envie um email de teste:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### Configuração do Cliente SMTP msmtp {#msmtp-smtp-client-configuration}

msmtp é um cliente SMTP leve que é útil para enviar emails a partir de scripts ou aplicações de linha de comando.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo Estimado de Configuração:</strong>
  <span>Menos de 10 minutos</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Isso requer um plano pago com acesso SMTP habilitado.
  </span>
</div>

#### Configuração {#configuration-2}

1. Crie ou edite o arquivo de configuração do msmtp em `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Adicione a seguinte configuração:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           seu-apelido@seudominio.com
   user           seu-apelido@seudominio.com
   password       sua-senha-gerada

   account default : forwardemail
   ```

3. Defina as permissões corretas para o arquivo de configuração:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Testando {#testing-2}

Envie um email de teste:

```bash
echo "Este é um email de teste do msmtp" | msmtp -a default recipient@example.com
```

### Clientes de Email via Linha de Comando {#command-line-email-clients}

Clientes de email populares via linha de comando como [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org), e [Alpine](https://alpine.x10.mx/alpine/release/) podem ser configurados para usar os servidores SMTP do Forward Email para envio de emails. A configuração será semelhante à do `msmtp`, onde você fornece os detalhes do servidor SMTP e suas credenciais nos respectivos arquivos de configuração (`.muttrc`, `.neomuttrc` ou `.pinerc`).

### Configuração de Email no Windows {#windows-email-configuration}

Para usuários Windows, você pode configurar clientes de email populares como **Microsoft Outlook** e **eM Client** usando as configurações IMAP e SMTP fornecidas na sua conta Forward Email. Para uso via linha de comando ou scripts, você pode usar o cmdlet `Send-MailMessage` do PowerShell (embora seja considerado obsoleto) ou uma ferramenta leve de relay SMTP como [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Configuração de Relay SMTP no Postfix {#postfix-smtp-relay-configuration}

Você pode configurar o Postfix para encaminhar emails através dos servidores SMTP do Forward Email. Isso é útil para aplicações de servidor que precisam enviar emails.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo Estimado de Configuração:</strong>
  <span>Menos de 15 minutos</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Isso requer um plano pago com acesso SMTP habilitado.
  </span>
</div>

#### Instalação {#installation}

1. Instale o Postfix no seu servidor:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Durante a instalação, selecione "Internet Site" quando solicitado o tipo de configuração.

#### Configuração {#configuration-3}

1. Edite o arquivo principal de configuração do Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Adicione ou modifique estas configurações:

```
# Configuração do relay SMTP
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Crie o arquivo de senha SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Adicione suas credenciais do Forward Email:

```
[smtp.forwardemail.net]:465 seu-apelido@seudominio.com:sua-senha-gerada
```

5. Proteja e gere o hash do arquivo de senha:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Reinicie o Postfix:

```bash
sudo systemctl restart postfix
```

#### Testando {#testing-3}

Teste sua configuração enviando um email de teste:

```bash
echo "Corpo do email de teste" | mail -s "Assunto do Teste" recipient@example.com
```

### Como Enviar Email Como usando Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo Estimado de Configuração:</strong>
  <span>Menos de 10 minutos</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Começando:
  </strong>
  <span>
    Se você seguiu as instruções acima em <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Como começar e configurar o encaminhamento de e-mail</a>, então pode continuar lendo abaixo.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Por favor, certifique-se de que leu nossos <a href="/terms" class="alert-link" target="_blank">Termos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidade</a> e <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites de SMTP de Saída</a> &ndash; seu uso é considerado como reconhecimento e concordância.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se você é um desenvolvedor, consulte nossa <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentação da API de e-mail</a>.
  </span>
</div>

1. Vá para <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Configuração SMTP de Saída e siga as instruções de configuração

2. Crie um novo alias para seu domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (ex. <code><hello@example.com></code>)

3. Clique em <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> ao lado do alias recém-criado. Copie para sua área de transferência e armazene com segurança a senha gerada exibida na tela.

4. Vá para [Gmail](https://gmail.com) e em [Configurações <i class="fa fa-angle-right"></i> Contas e Importação <i class="fa fa-angle-right"></i> Enviar e-mail como](https://mail.google.com/mail/u/0/#settings/accounts), clique em "Adicionar outro endereço de e-mail"

5. Quando solicitado o "Nome", insira o nome que você deseja que seu e-mail apareça como "De" (ex. "Linus Torvalds").

6. Quando solicitado o "Endereço de e-mail", insira o endereço de e-mail completo de um alias que você criou em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (ex. <code><hello@example.com></code>)

7. Desmarque "Tratar como um alias"

8. Clique em "Próxima etapa" para continuar

9. Quando solicitado o "Servidor SMTP", insira <code>smtp.forwardemail.net</code> e altere a porta para <code>465</code>

10. Quando solicitado o "Nome de usuário", insira o endereço de e-mail completo de um alias que você criou em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (ex. <code><hello@example.com></code>)

11. Quando solicitado a "Senha", cole a senha do <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> no passo 3 acima

12. Selecione o botão de opção para "Conexão segura usando SSL"

13. Clique em "Adicionar Conta" para continuar

14. Abra uma nova aba em [Gmail](https://gmail.com) e aguarde o e-mail de verificação chegar (você receberá um código de verificação que confirma que você é o proprietário do endereço de e-mail que está tentando "Enviar e-mail como")

15. Quando chegar, copie e cole o código de verificação no prompt que você recebeu no passo anterior
16. Depois de fazer isso, volte ao e-mail e clique no link para "confirmar a solicitação". Você provavelmente precisará fazer esta etapa e a etapa anterior para que o e-mail seja configurado corretamente.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Parabéns!
    </strong>
    <span>
      Você completou todas as etapas com sucesso.
    </span>
  </div>
</div>

</div>

### O que é o guia legado gratuito para Enviar Email Como usando Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> Este guia legado gratuito está obsoleto desde maio de 2023, pois <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">agora suportamos SMTP de saída</a>. Se você usar o guia abaixo, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">isso fará com que seu e-mail de saída</a> apareça como "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" no Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo Estimado de Configuração:</strong>
  <span>Menos de 10 minutos</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Começando:
  </strong>
  <span>
    Se você seguiu as instruções acima em <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Como começar e configurar o encaminhamento de e-mail</a>, então pode continuar lendo abaixo.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Você precisa ter a [Autenticação de Dois Fatores do Gmail][gmail-2fa] ativada para que isso funcione. Visite <https://www.google.com/landing/2step/> se ainda não a tiver ativado.

2. Depois que a Autenticação de Dois Fatores estiver ativada (ou se você já a tinha ativada), visite <https://myaccount.google.com/apppasswords>.

3. Quando solicitado para "Selecione o app e o dispositivo para o qual deseja gerar a senha do app":
   * Selecione "Mail" no menu suspenso "Selecionar app"
   * Selecione "Outro" no menu suspenso "Selecionar dispositivo"
   * Quando solicitado para inserir texto, digite o endereço de e-mail do seu domínio personalizado do qual você está encaminhando (ex.: <code><hello@example.com></code> - isso ajudará você a acompanhar caso use este serviço para várias contas)

4. Copie a senha para sua área de transferência que é gerada automaticamente
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Importante:
     </strong>
     <span>
       Se você estiver usando o G Suite, acesse seu painel de administrador <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Configurações do Gmail <i class="fa fa-angle-right"></i> Configurações</a> e certifique-se de marcar "Permitir que usuários enviem e-mails por meio de um servidor SMTP externo...". Haverá um atraso para que essa alteração seja ativada, então aguarde alguns minutos.
     </span>
   </div>

5. Vá para [Gmail](https://gmail.com) e em [Configurações <i class="fa fa-angle-right"></i> Contas e Importação <i class="fa fa-angle-right"></i> Enviar e-mail como](https://mail.google.com/mail/u/0/#settings/accounts), clique em "Adicionar outro endereço de e-mail"

6. Quando solicitado para "Nome", insira o nome que você quer que seu e-mail apareça como remetente (ex.: "Linus Torvalds")

7. Quando solicitado para "Endereço de e-mail", insira o endereço de e-mail com o domínio personalizado que você usou acima (ex.: <code><hello@example.com></code>)
8. Desmarque "Tratar como um alias"

9. Clique em "Próximo Passo" para continuar

10. Quando solicitado por "Servidor SMTP", insira <code>smtp.gmail.com</code> e deixe a porta como <code>587</code>

11. Quando solicitado por "Nome de usuário", insira a parte do seu endereço Gmail sem a parte <span>gmail.com</span> (por exemplo, apenas "user" se meu email for <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Importante:
      </strong>
      <span>
        Se a parte "Nome de usuário" for preenchida automaticamente, então <u><strong>você precisará alterar isso</strong></u> para a parte do nome de usuário do seu endereço Gmail.
      </span>
    </div>

12. Quando solicitado por "Senha", cole da sua área de transferência a senha que você gerou no passo 2 acima

13. Deixe o botão de opção marcado para "Conexão segura usando TLS"

14. Clique em "Adicionar Conta" para continuar

15. Abra uma nova aba em [Gmail](https://gmail.com) e aguarde o email de verificação chegar (você receberá um código de verificação que confirma que você é o proprietário do endereço de email que está tentando "Enviar Email Como")

16. Quando chegar, copie e cole o código de verificação no prompt que você recebeu no passo anterior

17. Depois de fazer isso, volte ao email e clique no link para "confirmar a solicitação". Você provavelmente precisará fazer este passo e o anterior para que o email seja configurado corretamente.

</div>

### Configuração Avançada de Roteamento do Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo Estimado de Configuração:</strong>
  <span>15-30 minutos</span>
</div>

Se você quiser configurar roteamento avançado no Gmail para que aliases que não correspondam a uma caixa de correio sejam encaminhados para os servidores de email do Forward Email, siga estes passos:

1. Faça login no seu console do Google Admin em [admin.google.com](https://admin.google.com)
2. Vá para **Apps → Google Workspace → Gmail → Roteamento**
3. Clique em **Adicionar Rota** e configure as seguintes opções:

**Configurações de Destinatário Único:**

* Selecione "Alterar destinatário do envelope" e insira seu endereço Gmail principal
* Marque "Adicionar cabeçalho X-Gm-Original-To com destinatário original"

**Padrões de Destinatário do Envelope:**

* Adicione um padrão que corresponda a todas as caixas de correio inexistentes (por exemplo, `.*@seudominio.com`)

**Configurações do Servidor de Email:**

* Selecione "Roteamento para host" e insira `mx1.forwardemail.net` como servidor principal
* Adicione `mx2.forwardemail.net` como servidor de backup
* Defina a porta para 25
* Selecione "Exigir TLS" para segurança

4. Clique em **Salvar** para criar a rota

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Esta configuração funcionará apenas para contas Google Workspace com domínios personalizados, não para contas Gmail regulares.
  </span>
</div>

### Configuração Avançada de Roteamento do Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo Estimado de Configuração:</strong>
  <span>15-30 minutos</span>
</div>

Para usuários do Microsoft 365 (antigo Office 365) que desejam configurar roteamento avançado para que aliases que não correspondam a uma caixa de correio sejam encaminhados para os servidores de email do Forward Email:

1. Faça login no centro de administração do Microsoft 365 em [admin.microsoft.com](https://admin.microsoft.com)
2. Vá para **Exchange → Fluxo de email → Regras**
3. Clique em **Adicionar uma regra** e selecione **Criar uma nova regra**
4. Nomeie sua regra (por exemplo, "Encaminhar caixas inexistentes para Forward Email")
5. Em **Aplicar esta regra se**, selecione:
   * "O endereço do destinatário corresponder a..."
   * Insira um padrão que corresponda a todos os endereços do seu domínio (por exemplo, `*@seudominio.com`)
6. Em **Fazer o seguinte**, selecione:
   * "Redirecionar a mensagem para..."
   * Escolha "O seguinte servidor de email"
   * Insira `mx1.forwardemail.net` e porta 25
   * Adicione `mx2.forwardemail.net` como servidor de backup
7. Em **Exceto se**, selecione:
   * "O destinatário for..."
   * Adicione todas as suas caixas de correio existentes que não devem ser encaminhadas
8. Defina a prioridade da regra para garantir que ela seja executada após outras regras de fluxo de email
9. Clique em **Salvar** para ativar a regra
## Solução de Problemas {#troubleshooting}

### Por que não estou recebendo meus e-mails de teste {#why-am-i-not-receiving-my-test-emails}

Se você está enviando um e-mail de teste para si mesmo, ele pode não aparecer na sua caixa de entrada porque possui o mesmo cabeçalho "Message-ID".

Este é um problema amplamente conhecido, que também afeta serviços como o Gmail.  <a href="https://support.google.com/a/answer/1703601">Aqui está a resposta oficial do Gmail sobre esse problema</a>.

Se você continuar tendo problemas, provavelmente é uma questão de propagação de DNS. Você precisará esperar um pouco mais e tentar novamente (ou tentar definir um valor TTL mais baixo nos seus registros <strong class="notranslate">TXT</strong>).

**Ainda está tendo problemas?**  Por favor, <a href="/help">entre em contato conosco</a> para que possamos ajudar a investigar o problema e encontrar uma solução rápida.

### Como configurar meu cliente de e-mail para funcionar com o Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Nosso serviço funciona com clientes de e-mail populares como:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Seu nome de usuário é o endereço de e-mail do seu alias e a senha é a gerada em <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> ("Senha Normal").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
  <span>Se você estiver usando o Thunderbird, certifique-se de que "Segurança da conexão" esteja configurada para "SSL/TLS" e o método de autenticação para "Senha normal".</span>
</div>

| Tipo |         Nome do Host        |         Protocolo        |                                            Portas                                           |
| :--: | :-------------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net`      |  SSL/TLS **Preferido**  |                                      `993` e `2993`                                      |
| SMTP | `smtp.forwardemail.net`      | SSL/TLS **Recomendado** | `465` e `2465` para SSL/TLS (recomendado) ou `587`, `2587`, `2525` e `25` para STARTTLS |

### Por que meus e-mails estão caindo na Lixeira e Spam e como posso verificar a reputação do meu domínio {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Esta seção orienta você caso seu e-mail de saída esteja usando nossos servidores SMTP (por exemplo, `smtp.forwardemail.net`) (ou encaminhado via `mx1.forwardemail.net` ou `mx2.forwardemail.net`) e esteja sendo entregue na pasta de Spam ou Lixo Eletrônico dos destinatários.

Monitoramos rotineiramente nossos [endereços IP](#what-are-your-servers-ip-addresses) contra [todas as listas de bloqueio DNS reputadas](#how-do-you-handle-your-ip-addresses-becoming-blocked), **portanto, é muito provável que seja um problema específico de reputação do domínio**.

E-mails podem cair em pastas de spam por várias razões:

1. **Autenticação Ausente**: Configure os registros [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) e [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Reputação do Domínio**: Domínios novos geralmente têm reputação neutra até estabelecerem um histórico de envio.

3. **Gatilhos de Conteúdo**: Certas palavras ou frases podem ativar filtros de spam.

4. **Padrões de Envio**: Aumentos súbitos no volume de e-mails podem parecer suspeitos.

Você pode tentar usar uma ou mais destas ferramentas para verificar a reputação e categorização do seu domínio:

#### Ferramentas de Verificação de Reputação e Listas de Bloqueio {#reputation-and-blocklist-check-tools}

| Nome da Ferramenta                         | URL                                                          | Tipo                   |
| ------------------------------------------ | ------------------------------------------------------------ | ---------------------- |
| Feedback de Categorização de Domínio Cloudflare | <https://radar.cloudflare.com/domains/feedback>              | Categorização          |
| Verificador de Reputação de IP e Domínio Spamhaus | <https://check.spamhaus.org/>                                | DNSBL                  |
| Centro de Reputação de IP e Domínio Cisco Talos | <https://talosintelligence.com/reputation_center>            | Reputação              |
| Consulta de Reputação de IP e Domínio Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| Verificação de Lista Negra MX Toolbox      | <https://mxtoolbox.com/blacklists.aspx>                      | Lista Negra            |
| Ferramentas do Postmaster do Google        | <https://www.gmail.com/postmaster/>                          | Reputação              |
| Hub de Remetentes do Yahoo                  | <https://senders.yahooinc.com/>                              | Reputação              |
| Verificação de Lista Negra MultiRBL.valli.org | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | Reputação              |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| Níveis 1, 2 e 3 do UCEPROTECT               | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| backscatterer.org do UCEPROTECT              | <https://www.backscatterer.org/>                             | Proteção contra Backscatter |
| whitelisted.org do UCEPROTECT                | <https://www.whitelisted.org/> (requer taxa)                 | DNSWL                  |

#### Formulários de Solicitação de Remoção de IP por Provedor {#ip-removal-request-forms-by-provider}

Se seu endereço IP foi bloqueado por um provedor de e-mail específico, use o formulário de remoção apropriado ou contato abaixo:

| Provedor                               | Formulário de Remoção / Contato                                                                             | Notas                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | Formulário de contato para remetentes em massa |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Portal de delistagem de IP do Office 365    |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Hub de Remetentes do Yahoo                   |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple usa Proofpoint para reputação de IP   |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | Verificação e remoção de IP no Proofpoint   |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Consulta e remoção de reputação Barracuda   |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | Solicitação de reset Cloudmark CSI           |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | Formulário de desbloqueio de IP GoDaddy     |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | Solicitação de remoção de IP Comcast         |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Contate o suporte Spectrum para remoção      |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | E-mail para solicitação de remoção           |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | E-mail para solicitação de remoção           |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | Usa Cloudfilter                              |
| Windstream                             | `abuse@windstream.net`                                                                                     | E-mail para solicitação de remoção           |
| t-online.de (Alemanha)                  | `tobr@rx.t-online.de`                                                                                      | E-mail para solicitação de remoção           |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | Use formulário de contato ou e-mail `abuse@orange.fr` |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | Formulário de contato do postmaster GMX     |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | Portal do postmaster Mail.ru                  |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | Portal do postmaster Yandex                   |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | Aplicação para whitelist do QQ Mail (Chinês) |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | Portal do postmaster Netease                  |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Contato via console Alibaba Cloud             |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | Console AWS SES > Remoção de Lista Negra      |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | Contato com suporte SendGrid                  |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | Usa RBLs de terceiros - contate RBL específico |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | Contato com suporte Fastmail                  |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Contato com suporte Zoho                      |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | Contato com suporte Proton                    |
| Tutanota                               | <https://tutanota.com/support>                                                                             | Contato com suporte Tutanota                  |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | Contato com suporte Hushmail                  |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | Contato com suporte Mailbox.org               |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | Contato com suporte Posteo                     |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | Contato com suporte DuckDuckGo                 |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | Contato com suporte Sonic                      |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | Contato com suporte Telus                      |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | Contato com suporte Vodafone                   |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | Contato com suporte Spark NZ                   |
| UOL/BOL (Brasil)                       | <https://ajuda.uol.com.br/>                                                                                | Contato com suporte UOL (Português)           |
| Libero (Itália)                         | <https://aiuto.libero.it/>                                                                                 | Contato com suporte Libero (Italiano)          |
| Telenet (Bélgica)                      | <https://www2.telenet.be/en/support/>                                                                      | Contato com suporte Telenet                    |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | Contato com suporte comercial Facebook        |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | Contato com suporte LinkedIn                   |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | Contato com suporte Groups.io                   |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | Ferramenta de remetente Vade Secure            |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Contato com suporte Cloudflare                  |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | Contato com suporte Hornetsecurity              |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | Contato via provedor de hospedagem              |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | Contato com suporte Mail2World                   |
> \[!TIP]
> Comece com um volume baixo de e-mails de alta qualidade para construir uma reputação positiva antes de enviar em volumes maiores.

> \[!IMPORTANT]
> Se seu domínio estiver em uma lista negra, cada lista negra tem seu próprio processo de remoção. Verifique os sites deles para instruções.

> \[!TIP]
> Se precisar de ajuda adicional ou descobrir que estamos listados como falso-positivo como spam por algum provedor de serviço de e-mail, por favor <a href="/help">contate-nos</a>.

### O que devo fazer se receber e-mails de spam {#what-should-i-do-if-i-receive-spam-emails}

Você deve cancelar a inscrição da lista de e-mails (se possível) e bloquear o remetente.

Por favor, não reporte a mensagem como spam, mas encaminhe-a para nosso sistema manualmente curado e focado em privacidade para prevenção de abusos.

**O endereço de e-mail para encaminhar spam é:** <abuse@forwardemail.net>

### Por que meus e-mails de teste enviados para mim mesmo no Gmail aparecem como "suspeitos" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Se você vir essa mensagem de erro no Gmail ao enviar um teste para si mesmo, ou quando uma pessoa com quem você está enviando e-mails com seu alias vê um e-mail seu pela primeira vez, então **por favor, não se preocupe** – pois isso é um recurso de segurança embutido do Gmail.

Você pode simplesmente clicar em "Parece seguro". Por exemplo, se você enviar uma mensagem de teste usando o recurso enviar e-mail como (para outra pessoa), então ela não verá essa mensagem.

No entanto, se ela vir essa mensagem, é porque normalmente estava acostumada a ver seus e-mails vindo de <john@gmail.com> em vez de <john@customdomain.com> (apenas um exemplo). O Gmail alerta os usuários apenas para garantir que tudo está seguro, não há solução alternativa.

### Posso remover o via forwardemail dot net no Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Este tópico está relacionado a um [problema amplamente conhecido no Gmail onde informações extras aparecem ao lado do nome do remetente](https://support.google.com/mail/answer/1311182).

A partir de maio de 2023, oferecemos suporte ao envio de e-mails com SMTP como um complemento para todos os usuários pagos – o que significa que você pode remover o <span class="notranslate">via forwardemail dot net</span> no Gmail.

Note que este tópico de FAQ é específico para quem usa o recurso [Como Enviar E-mail Como usando Gmail](#how-to-send-mail-as-using-gmail).

Por favor, veja a seção sobre [Vocês suportam envio de e-mail com SMTP](#do-you-support-sending-email-with-smtp) para instruções de configuração.


## Gerenciamento de Dados {#data-management}

### Onde estão localizados seus servidores {#where-are-your-servers-located}

> \[!TIP]
> Em breve podemos anunciar nossa localização de datacenter na UE hospedada em [forwardemail.eu](https://forwardemail.eu). Inscreva-se na discussão em <https://github.com/orgs/forwardemail/discussions/336> para atualizações.

Nossos servidores estão localizados principalmente em Denver, Colorado – veja <https://forwardemail.net/ips> para nossa lista completa de endereços IP.

Você pode conhecer nossos subprocessadores em nossas páginas [GDPR](/gdpr), [DPA](/dpa) e [Privacidade](/privacy).

### Como exporto e faço backup da minha caixa de correio {#how-do-i-export-and-backup-my-mailbox}

A qualquer momento você pode exportar suas caixas de correio nos formatos [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) ou [SQLite](https://en.wikipedia.org/wiki/SQLite) criptografados.

Vá para <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases <i class="fa fa-angle-right"></i> Baixar Backup e selecione seu tipo de formato de exportação preferido.

Você receberá um link para download da exportação por e-mail assim que ela for concluída.

Note que este link para download da exportação expira após 4 horas por questões de segurança.

Se precisar inspecionar seus formatos exportados EML ou Mbox, estas ferramentas open-source podem ser úteis:

| Nome            | Formato | Plataforma   | URL do GitHub                                       |
| --------------- | :-----: | ----------- | -------------------------------------------------- |
| MBox Viewer     |  Mbox   | Windows     | <https://github.com/eneam/mboxviewer>              |
| mbox-web-viewer |  Mbox   | Todas       | <https://github.com/PHMRanger/mbox-web-viewer>     |
| EmlReader       |   EML   | Windows     | <https://github.com/ayamadori/EmlReader>           |
| Email viewer    |   EML   | VSCode      | <https://github.com/joelharkes/vscode_email_viewer>|
| eml-reader      |   EML   | Todas       | <https://github.com/s0ph1e/eml-reader>             |
Additionally if you need to convert a Mbox file to EML file, then you can use <https://github.com/noelmartinon/mboxzilla>.

### Como importar e migrar minha caixa de correio existente {#how-do-i-import-and-migrate-my-existing-mailbox}

Você pode facilmente importar seu e-mail para o Forward Email (por exemplo, usando o [Thunderbird](https://www.thunderbird.net)) com as instruções abaixo:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Você deve seguir todos os passos abaixo para importar seu e-mail existente.
  </span>
</div>

1. Exporte seu e-mail do seu provedor de e-mail atual:

   | Provedor de E-mail | Formato de Exportação                         | Instruções de Exportação                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | ------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail              | MBOX                                          | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook            | PST                                           | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Dica:</strong> <span>Se você usa Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">formato de exportação PST</a>), então você pode simplesmente seguir as instruções em "Outros" abaixo. No entanto, fornecemos links abaixo para converter PST para formato MBOX/EML conforme seu sistema operacional:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba para Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst para Windows cygwin</a> – (ex: <code>readpst -u -o $OUT_DIR $IN_DIR</code> substituindo <code>$OUT_DIR</code> e <code>$IN_DIR</code> pelos caminhos do diretório de saída e entrada, respectivamente).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst para Ubuntu/Linux</a> – (ex: <code>sudo apt-get install readpst</code> e depois <code>readpst -u -o $OUT_DIR $IN_DIR</code>, substituindo <code>$OUT_DIR</code> e <code>$IN_DIR</code> pelos caminhos do diretório de saída e entrada, respectivamente).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst para macOS (via brew)</a> – (ex: <code>brew install libpst</code> e depois <code>readpst -u -o $OUT_DIR $IN_DIR</code>, substituindo <code>$OUT_DIR</code> e <code>$IN_DIR</code> pelos caminhos do diretório de saída e entrada, respectivamente).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Conversor PST para Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail         | MBOX                                          | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail           | EML                                           | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail        | MBOX/EML                                      | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota           | EML                                           | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi              | EML                                           | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho               | EML                                           | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Outros             | [Use Thunderbird](https://www.thunderbird.net) | Configure sua conta de e-mail existente no Thunderbird e então use o plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) para exportar e importar seu e-mail.  **Você também pode simplesmente copiar/colar ou arrastar/soltar e-mails entre uma conta e outra.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Baixe, instale e abra o [Thunderbird](https://www.thunderbird.net).

3. Crie uma nova conta usando o endereço de e-mail completo do seu alias (ex.: <code><you@yourdomain.com></code>) e sua senha gerada.  <strong>Se você ainda não possui uma senha gerada, então <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">consulte nossas instruções de configuração</a></strong>.

4. Baixe e instale o plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) para Thunderbird.

5. Crie uma nova pasta local no Thunderbird, e então clique com o botão direito nela → selecione a opção `ImportExportTools NG` → escolha `Import mbox file` (para formato de exportação MBOX) – ou – `Import messages` / `Import all messages from a directory` (para formato de exportação EML).

6. Arraste e solte da pasta local para uma nova pasta IMAP (ou existente) no Thunderbird para a qual deseja enviar mensagens no armazenamento IMAP com nosso serviço.  Isso garantirá que elas sejam salvas online com nosso armazenamento criptografado SQLite.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Dica:
     </strong>
     <span>
       Se você estiver com dúvidas sobre como importar no Thunderbird, pode consultar as instruções oficiais em <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> e <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Depois de concluir o processo de exportação e importação, você também pode querer ativar o encaminhamento na sua conta de e-mail existente e configurar um auto-responder para notificar os remetentes que você possui um novo endereço de e-mail (por exemplo, se você usava Gmail anteriormente e agora está usando um e-mail com seu domínio personalizado).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Parabéns!
    </strong>
    <span>
      Você completou com sucesso todas as etapas.
    </span>
  </div>
</div>

### Como uso meu próprio armazenamento compatível com S3 para backups {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Usuários de planos pagos podem configurar seu próprio provedor de armazenamento compatível com [S3](https://en.wikipedia.org/wiki/Amazon_S3) por domínio para backups IMAP/SQLite. Isso significa que seus backups criptografados da caixa de correio podem ser armazenados em sua própria infraestrutura em vez de (ou além de) nosso armazenamento padrão.

Os provedores suportados incluem [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) e qualquer outro serviço compatível com S3.

#### Configuração {#setup}

1. Crie um bucket **privado** com seu provedor compatível com S3. O bucket não deve ser acessível publicamente.
2. Crie credenciais de acesso (ID da chave de acesso e chave secreta de acesso) com permissões de leitura/gravação para o bucket.
3. Vá para <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações Avançadas <i class="fa fa-angle-right"></i> Armazenamento Compatível com S3 Personalizado.
4. Marque **"Ativar armazenamento compatível com S3 personalizado"** e preencha sua URL de endpoint, ID da chave de acesso, chave secreta de acesso, região e nome do bucket.
5. Clique em **"Testar Conexão"** para verificar suas credenciais, acesso ao bucket e permissões de gravação.
6. Clique em **"Salvar"** para aplicar as configurações.

#### Como os Backups Funcionam {#how-backups-work}

Os backups são acionados automaticamente para cada alias IMAP conectado. O servidor IMAP verifica todas as conexões ativas uma vez por hora e dispara um backup para cada alias conectado. Um bloqueio baseado em Redis impede que backups duplicados sejam executados dentro de 30 minutos um do outro, e o backup real é pulado se um backup bem-sucedido já foi concluído nas últimas 24 horas (a menos que o backup tenha sido explicitamente solicitado por um usuário para download).
Backups também podem ser acionados manualmente clicando em **"Download Backup"** para qualquer alias no painel. Backups manuais sempre são executados independentemente da janela de 24 horas.

O processo de backup funciona da seguinte forma:

1. O banco de dados SQLite é copiado usando `VACUUM INTO`, que cria um snapshot consistente sem interromper conexões ativas e preserva a criptografia do banco de dados.
2. O arquivo de backup é verificado abrindo-o para confirmar que a criptografia ainda é válida.
3. Um hash SHA-256 é calculado e comparado com o backup existente no armazenamento. Se o hash coincidir, o upload é pulado (sem alterações desde o último backup).
4. O backup é enviado para o S3 usando upload multipart via a biblioteca [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. Uma URL de download assinada (válida por 4 horas) é gerada e enviada por e-mail ao usuário.

#### Backup Formats {#backup-formats}

Três formatos de backup são suportados:

| Formato  | Extensão  | Descrição                                                                   |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | Snapshot bruto do banco de dados SQLite criptografado (padrão para backups IMAP automáticos) |
| `mbox`   | `.zip`    | ZIP protegido por senha contendo a caixa de correio no formato mbox         |
| `eml`    | `.zip`    | ZIP protegido por senha contendo arquivos `.eml` individuais por mensagem   |

> **Dica:** Se você tem arquivos de backup `.sqlite` e quer convertê-los para arquivos `.eml` localmente, use nossa ferramenta CLI independente **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Funciona no Windows, Linux e macOS e não requer conexão de rede.

#### File Naming and Key Structure {#file-naming-and-key-structure}

Ao usar **armazenamento S3 personalizado**, os arquivos de backup são armazenados com um prefixo de timestamp [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) para que cada backup seja preservado como um objeto separado. Isso fornece um histórico completo de backups no seu próprio bucket.

O formato da chave é:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Por exemplo:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

O `alias_id` é o ObjectId do MongoDB do alias. Você pode encontrá-lo na página de configurações do alias ou via API.

Ao usar o **armazenamento padrão (do sistema)**, a chave é plana (ex.: `65a31c53c36b75ed685f3fda.sqlite`) e cada backup sobrescreve o anterior.

> **Nota:** Como o armazenamento S3 personalizado retém todas as versões de backup, o uso de armazenamento crescerá com o tempo. Recomendamos configurar [regras de ciclo de vida](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) no seu bucket para expirar automaticamente backups antigos (ex.: excluir objetos com mais de 30 ou 90 dias).

#### Data Ownership and Deletion Policy {#data-ownership-and-deletion-policy}

Seu bucket S3 personalizado está totalmente sob seu controle. Nós **nunca deletamos ou modificamos** arquivos no seu bucket S3 personalizado — nem quando um alias é deletado, nem quando um domínio é removido, nem durante quaisquer operações de limpeza. Nós apenas escrevemos novos arquivos de backup no seu bucket.

Isso significa:

* **Exclusão de alias** — Quando você deleta um alias, removemos o backup apenas do nosso armazenamento padrão do sistema. Quaisquer backups previamente gravados no seu bucket S3 personalizado permanecem intactos.
* **Remoção de domínio** — Remover um domínio não afeta arquivos no seu bucket personalizado.
* **Gerenciamento de retenção** — Você é responsável por gerenciar o armazenamento no seu próprio bucket, incluindo configurar regras de ciclo de vida para expirar backups antigos.

Se você desativar o armazenamento S3 personalizado ou voltar para nosso armazenamento padrão, os arquivos existentes no seu bucket são preservados. Backups futuros simplesmente serão gravados no nosso armazenamento padrão.

#### Security {#security}

* Sua chave de acesso e chave secreta são **criptografadas em repouso** usando [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) antes de serem armazenadas em nosso banco de dados. Elas são descriptografadas apenas em tempo de execução durante operações de backup.
* Validamos automaticamente que seu bucket **não é publicamente acessível**. Se um bucket público for detectado, a configuração será rejeitada ao salvar. Se o acesso público for detectado no momento do backup, voltamos ao nosso armazenamento padrão e notificamos todos os administradores do domínio por e-mail.
* As credenciais são validadas ao salvar via uma chamada [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) para garantir que o bucket existe e as credenciais estão corretas. Se a validação falhar, o armazenamento S3 personalizado é desativado automaticamente.
* Cada arquivo de backup inclui um hash SHA-256 em seus metadados S3, que é usado para detectar bancos de dados inalterados e pular uploads redundantes.
#### Notificações de Erro {#error-notifications}

Se um backup falhar ao usar seu armazenamento S3 personalizado (por exemplo, devido a credenciais expiradas ou um problema de conectividade), todos os administradores do domínio serão notificados por e-mail. Essas notificações são limitadas a uma vez a cada 6 horas para evitar alertas duplicados. Se seu bucket for detectado como publicamente acessível no momento do backup, os administradores serão notificados uma vez por dia.

#### API {#api}

Você também pode configurar armazenamento S3 personalizado via API:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

Para testar a conexão via API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Como converter backups SQLite para arquivos EML {#how-do-i-convert-sqlite-backups-to-eml-files}

Se você baixar ou armazenar backups SQLite (seja do nosso armazenamento padrão ou do seu próprio [bucket S3 personalizado](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), pode convertê-los para arquivos `.eml` padrão usando nossa ferramenta CLI independente **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. Arquivos EML podem ser abertos com qualquer cliente de e-mail ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail), etc.) ou importados para outros servidores de e-mail.

#### Instalação {#installation-1}

Você pode baixar um binário pré-compilado (não requer [Node.js](https://github.com/nodejs/node)) ou executá-lo diretamente com [Node.js](https://github.com/nodejs/node):

**Binários pré-compilados** — Baixe a última versão para sua plataforma em [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Plataforma | Arquitetura  | Arquivo                              |
| --------- | ------------ | ----------------------------------- |
| Linux     | x64          | `convert-sqlite-to-eml-linux-x64`   |
| Linux     | arm64        | `convert-sqlite-to-eml-linux-arm64` |
| macOS     | Apple Silicon| `convert-sqlite-to-eml-darwin-arm64`|
| Windows   | x64          | `convert-sqlite-to-eml-win-x64.exe` |

> **Usuários macOS:** Após o download, pode ser necessário remover o atributo de quarentena antes de executar o binário:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Substitua `./convert-sqlite-to-eml-darwin-arm64` pelo caminho real do arquivo baixado.)

> **Usuários Linux:** Após o download, pode ser necessário tornar o binário executável:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Substitua `./convert-sqlite-to-eml-linux-x64` pelo caminho real do arquivo baixado.)

**A partir do código-fonte** (requer [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Uso {#usage}

A ferramenta suporta modos interativo e não interativo.

**Modo interativo** — execute sem argumentos e você será solicitado a fornecer todas as entradas:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Converter Backup SQLite para EML
  ================================================

  Caminho para o arquivo de backup SQLite: /path/to/backup.sqlite
  Senha IMAP/alias: ********
  Caminho de saída do ZIP [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Modo não interativo** — passe argumentos via flags na linha de comando para scripts e automação:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "sua-senha-imap" \
  --output /path/to/output.zip
```

| Flag                | Descrição                                                                     |
| ------------------- | ----------------------------------------------------------------------------- |
| `--path <path>`     | Caminho para o arquivo de backup SQLite criptografado                         |
| `--password <pass>` | Senha IMAP/alias para descriptografia                                        |
| `--output <path>`   | Caminho de saída para o arquivo ZIP (padrão: gerado automaticamente com timestamp ISO 8601) |
| `--help`            | Exibe mensagem de ajuda                                                       |
#### Formato de Saída {#output-format}

A ferramenta produz um arquivo ZIP protegido por senha (criptografado com AES-256) contendo:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

Os arquivos EML são organizados por pasta da caixa de correio. A senha do ZIP é a mesma da sua senha IMAP/alias. Cada arquivo `.eml` é uma mensagem de email padrão [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) com cabeçalhos completos, texto do corpo e anexos reconstruídos a partir do banco de dados SQLite.

#### Como Funciona {#how-it-works}

1. Abre o banco de dados SQLite criptografado usando sua senha IMAP/alias (suporta os cifradores [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) e [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. Lê a tabela Mailboxes para descobrir a estrutura das pastas.
3. Para cada mensagem, decodifica o mimeTree (armazenado como JSON comprimido com [Brotli](https://github.com/google/brotli)) da tabela Messages.
4. Reconstrói o EML completo percorrendo a árvore MIME e buscando os corpos dos anexos na tabela Attachments.
5. Empacota tudo em um arquivo ZIP protegido por senha usando [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Vocês suportam auto-hospedagem {#do-you-support-self-hosting}

Sim, a partir de março de 2025, suportamos uma opção auto-hospedada. Leia o blog [aqui](https://forwardemail.net/blog/docs/self-hosted-solution). Confira o [guia de auto-hospedagem](https://forwardemail.net/self-hosted) para começar. E para quem estiver interessado em uma versão mais detalhada passo a passo, veja nossos guias baseados em [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) ou [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Configuração de Email {#email-configuration}

### Como começo e configuro o encaminhamento de email {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo Estimado de Configuração:</strong>
  <span>Menos de 10 minutos</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Começando:
  </strong>
  <span>
    Leia cuidadosamente e siga os passos de um a oito listados abaixo. Certifique-se de substituir o endereço de email <code>user@gmail.com</code> pelo endereço de email para o qual deseja encaminhar os emails (se ainda não estiver correto). Da mesma forma, certifique-se de substituir <code>example.com</code> pelo seu nome de domínio personalizado (se ainda não estiver correto).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Se você já registrou seu nome de domínio em algum lugar, então deve pular completamente esta etapa e ir para o passo dois! Caso contrário, você pode <a href="/domain-registration" rel="noopener noreferrer">clicar aqui para registrar seu nome de domínio</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Você lembra onde registrou seu domínio? Uma vez que se lembre, siga as instruções abaixo:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Você deve abrir uma nova aba e entrar na sua conta do registrador de domínios. Você pode facilmente clicar no seu "Registrador" abaixo para fazer isso automaticamente. Nesta nova aba, você deve navegar até a página de gerenciamento de DNS no seu registrador – e fornecemos os passos detalhados de navegação abaixo na coluna "Passos para Configurar". Depois de navegar até essa página na nova aba, você pode retornar a esta aba e prosseguir para o passo três abaixo.
    <strong class="font-weight-bold">Não feche a aba aberta ainda; você vai precisar dela para os próximos passos!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Registrador</th>
      <th>Passos para Configurar</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Centro de Domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Editar Configurações de DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Zonas Hospedadas <i class="fa fa-angle-right"></i> (Selecione seu domínio)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Meus Servidores <i class="fa fa-angle-right"></i> Gerenciamento de Domínios <i class="fa fa-angle-right"></i> Gerenciador de DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>PARA ROCK: Faça login <i class="fa fa-angle-right"></i> Domínios <i class="fa fa-angle-right"></i> (Clique no ícone ▼ ao lado de gerenciar) <i class="fa fa-angle-right"></i> DNS
      <br />
      PARA LEGADO: Faça login <i class="fa fa-angle-right"></i> Domínios <i class="fa fa-angle-right"></i> Editor de Zona <i class="fa fa-angle-right"></i> (Selecione seu domínio)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Selecione seu domínio)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> (Selecione seu domínio)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Gerenciar</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Rede <i class="fa fa-angle-right"></i> Domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Mais <i class="fa fa-angle-right"></i> Gerenciar Domínio</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Na visualização em cartão, clique em gerenciar seu domínio <i class="fa fa-angle-right"></i> Na visualização em lista, clique no ícone de engrenagem <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> Registros DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Assistir</a>
      </td>
      <td>Faça login <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Gerenciar <i class="fa fa-angle-right"></i> (clique no ícone de engrenagem) <i class="fa fa-angle-right"></i> Clique em DNS &amp; Nameservers no menu à esquerda</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Painel <i class="fa fa-angle-right"></i> Domínios <i class="fa fa-angle-right"></i> Gerenciar Domínios <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Visão Geral <i class="fa fa-angle-right"></i> Gerenciar <i class="fa fa-angle-right"></i> Editor Simples <i class="fa fa-angle-right"></i> Registros</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Gerenciamento <i class="fa fa-angle-right"></i> Editar a zona</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Assistir</a>
      </td>
      <td>Faça login <i class="fa fa-angle-right"></i> Gerenciar Meus Domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Gerenciar DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Assistir</a>
      </td>
      <td>Faça login <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Configurar DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Assistir</a>
      </td>
      <td>Faça login <i class="fa fa-angle-right"></i> Lista de Domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Gerenciar <i class="fa fa-angle-right"></i> DNS Avançado</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Configurar DNS Netlify</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Gerenciador de Conta <i class="fa fa-angle-right"></i> Meus Nomes de Domínio <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Gerenciar <i class="fa fa-angle-right"></i> Alterar para onde o domínio aponta <i class="fa fa-angle-right"></i> DNS Avançado</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Assistir</a>
      </td>
      <td>Faça login <i class="fa fa-angle-right"></i> Domínios Gerenciados <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Configurações de DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Menu inicial <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i>
Configurações avançadas <i class="fa fa-angle-right"></i> Registros personalizados</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Now da Vercel</a></td>
      <td>Usando o CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Página de Domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Página de Domínios <i class="fa fa-angle-right"></i> (Clique no ícone <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Selecione Gerenciar Registros DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Faça login <i class="fa fa-angle-right"></i> Domínios <i class="fa fa-angle-right"></i> Meus Domínios</td>
    </tr>
    <tr>
      <td>Outro</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> Não vê o nome do seu registrador listado aqui? Simplesmente pesquise na Internet por "como alterar registros DNS no $REGISTRADOR" (substituindo $REGISTRADOR pelo nome do seu registrador – por exemplo, "como alterar registros DNS no GoDaddy" se você usa GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Usando a página de gerenciamento de DNS do seu registrador (a outra aba que você abriu), configure os seguintes registros "MX":
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Observe que NÃO deve haver outros registros MX configurados. Ambos os registros mostrados abaixo DEVEM existir. Certifique-se de que não há erros de digitação; e que você escreveu corretamente tanto mx1 quanto mx2. Se já existiam registros MX, por favor, exclua-os completamente.
    O valor "TTL" não precisa ser 3600, pode ser um valor menor ou maior, se necessário.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Prioridade</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vazio</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", ou vazio</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Usando a página de gerenciamento DNS do seu registrador (a outra aba que você abriu), configure o(s) seguinte(s) registro(s) <strong class="notranslate">TXT</strong>:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se você está em um plano pago, deve pular completamente esta etapa e ir para o passo cinco! Se você não está em um plano pago, seus endereços encaminhados serão publicamente pesquisáveis – vá para <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> e faça upgrade do seu domínio para um plano pago, se desejar. Se quiser saber mais sobre planos pagos, veja nossa página de <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Preços</a>. Caso contrário, você pode continuar escolhendo uma ou mais combinações da Opção A até a Opção F listadas abaixo.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opção A:
  </strong>
  <span>
    Se você está encaminhando todos os e-mails do seu domínio, (ex.: "all@example.com", "hello@example.com", etc) para um endereço específico "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vazio</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
  <span>
    Certifique-se de substituir os valores acima na coluna "Valor" pelo seu próprio endereço de e-mail. O valor "TTL" não precisa ser 3600, pode ser um valor menor ou maior, se necessário. Um valor menor de tempo de vida ("TTL") garantirá que quaisquer alterações futuras feitas nos seus registros DNS sejam propagadas pela Internet mais rapidamente – pense nisso como o tempo que ficará em cache na memória (em segundos). Você pode aprender mais sobre <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL na Wikipédia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opção B:
  </strong>
  <span>
    Se você precisa apenas encaminhar um único endereço de e-mail (ex.: <code>hello@example.com</code> para <code>user@gmail.com</code>; isso também encaminhará automaticamente "hello+test@example.com" para "user+test@gmail.com"):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opção C:
  </strong>
  <span>
    Se você estiver encaminhando múltiplos e-mails, então você deve separá-los com uma vírgula:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opção D:
  </strong>
  <span>
    Você pode configurar uma quantidade infinita de e-mails de encaminhamento – apenas certifique-se de não ultrapassar 255 caracteres em uma única linha e comece cada linha com "forward-email=". Um exemplo é fornecido abaixo:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opção E:
  </strong>
  <span>
    Você também pode especificar um nome de domínio no seu registro <strong class="notranslate">TXT</strong> para ter encaminhamento global de alias (por exemplo, "user@example.com" será encaminhado para "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=example.net</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opção F:
  </strong>
  <span>
    Você pode até usar webhooks como um alias global ou individual para encaminhar e-mails. Veja o exemplo e a seção completa sobre webhooks intitulada <a href="#do-you-support-webhooks" class="alert-link">Você suporta webhooks</a> abaixo.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opção G:
  </strong>
  <span>
    Você pode até usar expressões regulares ("regex") para corresponder aliases e para lidar com substituições para encaminhar e-mails. Veja os exemplos e a seção completa sobre regex intitulada <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Você suporta expressões regulares ou regex</a> abaixo.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Precisa de regex avançado com substituição?</strong> Veja os exemplos e a seção completa sobre regex intitulada <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Você suporta expressões regulares ou regex</a> abaixo.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemplo Simples:</strong> Se eu quiser que todos os e-mails que vão para `linus@example.com` ou `torvalds@example.com` sejam encaminhados para `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Regras de encaminhamento catch-all também podem ser descritas como "fall-through".
    Isso significa que e-mails recebidos que correspondem a pelo menos uma regra específica de encaminhamento serão usados em vez do catch-all.
    Regras específicas incluem endereços de e-mail e expressões regulares.
    <br /><br />
    Por exemplo:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    E-mails enviados para <code>hello@example.com</code> **não** serão encaminhados para <code>second@gmail.com</code> (catch-all) com esta configuração, e em vez disso serão entregues apenas para <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Usando a página de gerenciamento de DNS do seu registrador (a outra aba que você abriu), configure adicionalmente o seguinte registro <strong class="notranslate">TXT</strong>:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se você estiver usando Gmail (por exemplo, Enviar Email Como) ou G Suite, então precisará adicionar <code>include:_spf.google.com</code> ao valor acima, por exemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
  <span>
    Se você já tem uma linha similar com "v=spf1", então precisará adicionar <code>include:spf.forwardemail.net</code> logo antes de quaisquer registros existentes "include:host.com" e antes do "-all" na mesma linha, por exemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Note que há uma diferença entre "-all" e "~all". O "-" indica que a verificação SPF deve FALHAR se não corresponder, e "~" indica que a verificação SPF deve SOFTFAIL. Recomendamos usar a abordagem "-all" para prevenir falsificação de domínio.
    <br /><br />
    Você também pode precisar incluir o registro SPF para o host de onde estiver enviando e-mails (por exemplo, Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Verifique seus registros DNS usando nossa ferramenta "Verificar Registros" disponível em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configuração.

</li><li class="mb-2 mb-md-3 mb-lg-5">Envie um e-mail de teste para confirmar que funciona. Note que pode levar algum tempo para que seus registros DNS se propaguem.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
  <span>
  </span>
    Se você não está recebendo e-mails de teste, ou recebe um e-mail de teste que diz "Tenha cuidado com esta mensagem", então veja as respostas para <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Por que não estou recebendo meus e-mails de teste</a> e <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Por que meus e-mails de teste enviados para mim mesmo no Gmail aparecem como "suspeitos"</a>, respectivamente.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Se você deseja "Enviar Email Como" pelo Gmail, então você precisará <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">assistir a este vídeo</a></strong>, ou seguir os passos em <a href="#how-to-send-mail-as-using-gmail">Como Enviar Email Como Usando Gmail</a> abaixo.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Parabéns!
    </strong>
    <span>
      Você completou com sucesso todos os passos.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
  <span>
    Complementos opcionais estão listados abaixo. Note que esses complementos são completamente opcionais e podem não ser necessários. Queríamos pelo menos fornecer informações adicionais caso necessário.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Complemento Opcional:
  </strong>
  <span>
    Se você está usando o recurso <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Como Enviar Email Como usando Gmail</a>, então pode querer adicionar a si mesmo a uma lista de permissões. Veja <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">estas instruções do Gmail</a> sobre este assunto.
  </span>
</div>

### Posso usar múltiplos servidores e trocadores MX para encaminhamento avançado {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Sim, mas **você deve ter apenas um trocador MX listado em seus registros DNS**.

Não tente usar "Prioridade" como forma de configurar múltiplos trocadores MX.

Em vez disso, você precisa configurar seu trocador MX existente para encaminhar e-mails para todos os aliases que não correspondem para os trocadores do nosso serviço (`mx1.forwardemail.net` e/ou `mx2.forwardemail.net`).

Se você estiver usando Google Workspace e quiser encaminhar todos os aliases que não correspondem para o nosso serviço, veja <https://support.google.com/a/answer/6297084>.

Se você estiver usando Microsoft 365 (Outlook) e quiser encaminhar todos os aliases que não correspondem para o nosso serviço, veja <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> e <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Como configurar um respondedor de férias (resposta automática fora do escritório) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Vá para <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases e crie ou edite o alias para o qual deseja configurar um respondedor automático de férias.
Você tem a capacidade de configurar uma data de início, data de término, assunto e mensagem, e ativá-lo ou desativá-lo a qualquer momento:

* Assunto e mensagem em texto simples são atualmente suportados (usamos o pacote `striptags` internamente para remover qualquer HTML).
* O assunto é limitado a 100 caracteres.
* A mensagem é limitada a 1000 caracteres.
* A configuração requer configuração de SMTP de saída (por exemplo, você precisará configurar registros DNS DKIM, DMARC e Return-Path).
  * Vá para <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Configuração SMTP de Saída e siga as instruções de configuração.
* O respondedor de férias não pode ser ativado em nomes de domínio globais personalizados (por exemplo, [endereços descartáveis](/disposable-addresses) não são suportados).
* O respondedor de férias não pode ser ativado para aliases com curinga/catch-all (`*`) nem expressões regulares.

Ao contrário de sistemas de e-mail como `postfix` (por exemplo, que usam a extensão de filtro de férias `sieve`) – o Forward Email adiciona automaticamente sua assinatura DKIM, previne problemas de conexão ao enviar respostas de férias (por exemplo, devido a problemas comuns de conexão SSL/TLS e servidores legados mantidos), e até suporta Open WKD e criptografia PGP para respostas de férias.

<!--
* Para evitar abusos, 1 crédito SMTP de saída será deduzido para cada mensagem de respondedor de férias enviada.
  * Todas as contas pagas incluem 300 créditos por dia por padrão. Se você precisar de uma quantidade maior, por favor entre em contato conosco.
-->

1. Enviamos apenas uma vez por remetente [permitido](#do-you-have-an-allowlist) a cada 4 dias (o que é semelhante ao comportamento do Gmail).

   * Nosso cache Redis usa uma impressão digital de `alias_id` e `sender`, onde `alias_id` é o ID do alias no MongoDB e `sender` é o endereço From (se permitido) ou o domínio raiz no endereço From (se não permitido). Para simplificar, o tempo de expiração dessa impressão digital no cache é definido para 4 dias.

   * Nossa abordagem de usar o domínio raiz extraído do endereço From para remetentes não permitidos previne abusos de remetentes relativamente desconhecidos (por exemplo, atores maliciosos) que tentam inundar mensagens do respondedor de férias.

2. Enviamos apenas quando o MAIL FROM e/ou From não estiverem em branco e não contiverem (sem diferenciar maiúsculas de minúsculas) um [nome de usuário postmaster](#what-are-postmaster-addresses) (a parte antes do @ em um e-mail).

3. Não enviamos se a mensagem original tiver algum dos seguintes cabeçalhos (sem diferenciar maiúsculas de minúsculas):

   * Cabeçalho `auto-submitted` com valor diferente de `no`.
   * Cabeçalho `x-auto-response-suppress` com valor `dr`, `autoreply`, `auto-reply`, `auto_reply` ou `all`.
   * Cabeçalho `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` ou `x-auto-respond` (independente do valor).
   * Cabeçalho `precedence` com valor `bulk`, `autoreply`, `auto-reply`, `auto_reply` ou `list`.

4. Não enviamos se o endereço de e-mail MAIL FROM ou From terminar com `+donotreply`, `-donotreply`, `+noreply` ou `-noreply`.

5. Não enviamos se a parte do nome de usuário do endereço From for `mdaemon` e houver um cabeçalho `X-MDDSN-Message` (sem diferenciar maiúsculas de minúsculas).

6. Não enviamos se houver um cabeçalho `content-type` com valor `multipart/report` (sem diferenciar maiúsculas de minúsculas).

### Como configurar SPF para Forward Email {#how-do-i-set-up-spf-for-forward-email}

Usando a página de gerenciamento DNS do seu registrador, configure o seguinte registro <strong class="notranslate">TXT</strong>:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se você estiver usando Gmail (por exemplo, Enviar Email Como) ou G Suite, será necessário adicionar <code>include:_spf.google.com</code> ao valor acima, por exemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se você está usando Microsoft Outlook ou Live.com, será necessário adicionar <code>include:spf.protection.outlook.com</code> ao seu registro SPF <strong class="notranslate">TXT</strong>, por exemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
  <span>
    Se você já possui uma linha semelhante com "v=spf1", então será necessário adicionar <code>include:spf.forwardemail.net</code> logo antes de quaisquer registros "include:host.com" existentes e antes do "-all" na mesma linha, por exemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Note que há uma diferença entre "-all" e "~all". O "-" indica que a verificação SPF deve FALHAR se não corresponder, e "~" indica que a verificação SPF deve SOFTFAIL. Recomendamos usar a abordagem "-all" para prevenir falsificação de domínio.
    <br /><br />
    Você também pode precisar incluir o registro SPF para o host de onde está enviando o e-mail (por exemplo, Outlook).
  </span>
</div>

### Como configurar DKIM para Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Vá para <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Configuração SMTP de Saída e siga as instruções de configuração.

### Como configurar DMARC para Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Vá para <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Configuração SMTP de Saída e siga as instruções de configuração.

### Como visualizar Relatórios DMARC {#how-do-i-view-dmarc-reports}

Forward Email oferece um painel abrangente de Relatórios DMARC que permite monitorar o desempenho da autenticação de seus e-mails em todos os seus domínios a partir de uma única interface.

**O que são Relatórios DMARC?**

Relatórios DMARC (Domain-based Message Authentication, Reporting, and Conformance) são arquivos XML enviados pelos servidores de e-mail receptores que informam como seus e-mails estão sendo autenticados. Esses relatórios ajudam você a entender:

* Quantos e-mails estão sendo enviados do seu domínio
* Se esses e-mails estão passando na autenticação SPF e DKIM
* Quais ações os servidores receptores estão tomando (aceitar, colocar em quarentena ou rejeitar)
* Quais endereços IP estão enviando e-mails em nome do seu domínio

**Como acessar os Relatórios DMARC**

Vá para <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Relatórios DMARC</a> para visualizar seu painel. Você também pode acessar relatórios específicos de domínio em <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> clicando no botão "DMARC" ao lado de qualquer domínio.

**Recursos do Painel**

O painel de Relatórios DMARC oferece:

* **Métricas Resumidas**: Total de relatórios recebidos, total de mensagens analisadas, taxa de alinhamento SPF, taxa de alinhamento DKIM e taxa geral de aprovação
* **Gráfico de Mensagens ao Longo do Tempo**: Tendência visual do volume de e-mails e taxas de autenticação nos últimos 30 dias
* **Resumo de Alinhamento**: Gráfico de rosca mostrando a distribuição do alinhamento SPF vs DKIM
* **Disposição das Mensagens**: Gráfico de barras empilhadas mostrando como os servidores receptores trataram seus e-mails (aceitos, em quarentena ou rejeitados)
* **Tabela de Relatórios Recentes**: Lista detalhada de relatórios DMARC individuais com filtros e paginação
* **Filtro por Domínio**: Filtre relatórios por domínio específico ao gerenciar múltiplos domínios
**Por Que Isso Importa**

Para organizações que gerenciam múltiplos domínios (como empresas, organizações sem fins lucrativos ou agências), os relatórios DMARC são essenciais para:

* **Identificar remetentes não autorizados**: Detectar se alguém está falsificando seu domínio
* **Melhorar a entregabilidade**: Garantir que seus e-mails legítimos passem na autenticação
* **Monitorar a infraestrutura de e-mail**: Acompanhar quais serviços e IPs estão enviando em seu nome
* **Conformidade**: Manter visibilidade na autenticação de e-mails para auditorias de segurança

Ao contrário de outros serviços que exigem ferramentas separadas de monitoramento DMARC, o Forward Email inclui o processamento e visualização de relatórios DMARC como parte da sua conta sem custo adicional.

**Requisitos**

* Relatórios DMARC estão disponíveis apenas para planos pagos
* Seu domínio deve ter DMARC configurado (veja [Como configurar DMARC para Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Os relatórios são coletados automaticamente quando servidores de recebimento enviam para o endereço de relatório DMARC configurado

**Relatórios Semanais por E-mail**

Usuários de planos pagos recebem automaticamente resumos semanais dos relatórios DMARC por e-mail. Esses e-mails incluem:

* Estatísticas resumidas para todos os seus domínios
* Taxas de alinhamento SPF e DKIM
* Distribuição da disposição das mensagens (aceitas, em quarentena, rejeitadas)
* Principais organizações que reportam (Google, Microsoft, Yahoo, etc.)
* Endereços IP com problemas de alinhamento que podem precisar de atenção
* Links diretos para seu painel de Relatórios DMARC

Os relatórios semanais são enviados automaticamente e não podem ser desativados separadamente de outras notificações por e-mail.

### Como conectar e configurar meus contatos {#how-do-i-connect-and-configure-my-contacts}

**Para configurar seus contatos, use a URL CardDAV:** `https://carddav.forwardemail.net` (ou simplesmente `carddav.forwardemail.net` se seu cliente permitir)

### Como conectar e configurar meus calendários {#how-do-i-connect-and-configure-my-calendars}

**Para configurar seu calendário, use a URL CalDAV:** `https://caldav.forwardemail.net` (ou simplesmente `caldav.forwardemail.net` se seu cliente permitir)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Como adicionar mais calendários e gerenciar calendários existentes {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Se desejar adicionar calendários adicionais, basta adicionar uma nova URL de calendário: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**certifique-se de substituir `calendar-name` pelo nome desejado do calendário**)

Você pode alterar o nome e a cor de um calendário após a criação – basta usar seu aplicativo de calendário preferido (ex.: Apple Mail ou [Thunderbird](https://thunderbird.net)).

### Como conectar e configurar tarefas e lembretes {#how-do-i-connect-and-configure-tasks-and-reminders}

**Para configurar tarefas e lembretes, use a mesma URL CalDAV dos calendários:** `https://caldav.forwardemail.net` (ou simplesmente `caldav.forwardemail.net` se seu cliente permitir)

Tarefas e lembretes serão automaticamente separados dos eventos do calendário em sua própria coleção de calendário "Lembretes" ou "Tarefas".

**Instruções de configuração por plataforma:**

**macOS/iOS:**

1. Adicione uma nova conta CalDAV em Preferências do Sistema > Contas de Internet (ou Ajustes > Contas no iOS)
2. Use `caldav.forwardemail.net` como servidor
3. Insira seu alias Forward Email e senha gerada
4. Após a configuração, você verá as coleções "Calendário" e "Lembretes"
5. Use o app Lembretes para criar e gerenciar tarefas

**Android com Tasks.org:**

1. Instale o Tasks.org na Google Play Store ou F-Droid
2. Vá em Configurações > Sincronização > Adicionar Conta > CalDAV
3. Insira o servidor: `https://caldav.forwardemail.net`
4. Insira seu alias Forward Email e senha gerada
5. O Tasks.org descobrirá automaticamente seus calendários de tarefas

**Thunderbird:**

1. Instale o complemento Lightning se ainda não estiver instalado
2. Crie um novo calendário do tipo "CalDAV"
3. Use a URL: `https://caldav.forwardemail.net`
4. Insira suas credenciais Forward Email
5. Eventos e tarefas estarão disponíveis na interface do calendário

### Por que não consigo criar tarefas no macOS Lembretes {#why-cant-i-create-tasks-in-macos-reminders}
Se você está tendo problemas para criar tarefas no macOS Lembretes, tente estas etapas de solução de problemas:

1. **Verifique a configuração da conta**: Certifique-se de que sua conta CalDAV está configurada corretamente com `caldav.forwardemail.net`

2. **Verifique calendários separados**: Você deve ver tanto "Calendário" quanto "Lembretes" em sua conta. Se você vir apenas "Calendário", o suporte a tarefas pode não estar totalmente ativado ainda.

3. **Atualize a conta**: Tente remover e adicionar novamente sua conta CalDAV em Preferências do Sistema > Contas de Internet

4. **Verifique a conectividade com o servidor**: Teste se você consegue acessar `https://caldav.forwardemail.net` no seu navegador

5. **Verifique as credenciais**: Certifique-se de que está usando o alias de e-mail correto e a senha gerada (não a senha da sua conta)

6. **Forçar sincronização**: No app Lembretes, tente criar uma tarefa e depois atualizar manualmente a sincronização

**Problemas comuns:**

* **"Calendário de lembretes não encontrado"**: O servidor pode precisar de um momento para criar a coleção de Lembretes no primeiro acesso
* **Tarefas não sincronizam**: Verifique se ambos os dispositivos estão usando as mesmas credenciais da conta CalDAV
* **Conteúdo misto**: Certifique-se de que as tarefas estão sendo criadas no calendário "Lembretes", não no "Calendário" geral

### Como configurar o Tasks.org no Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org é um gerenciador de tarefas open-source popular que funciona perfeitamente com o suporte a tarefas CalDAV do Forward Email.

**Instalação e Configuração:**

1. **Instale o Tasks.org**:
   * Na Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * No F-Droid: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Configure a sincronização CalDAV**:
   * Abra o Tasks.org
   * Vá para ☰ Menu > Configurações > Sincronização
   * Toque em "Adicionar Conta"
   * Selecione "CalDAV"

3. **Insira as configurações do Forward Email**:
   * **URL do servidor**: `https://caldav.forwardemail.net`
   * **Nome de usuário**: Seu alias do Forward Email (ex.: `voce@seudominio.com`)
   * **Senha**: Sua senha gerada específica para o alias
   * Toque em "Adicionar Conta"

4. **Descoberta da conta**:
   * O Tasks.org irá descobrir automaticamente seus calendários de tarefas
   * Você deverá ver sua coleção "Lembretes" aparecer
   * Toque em "Assinar" para ativar a sincronização do calendário de tarefas

5. **Teste a sincronização**:
   * Crie uma tarefa de teste no Tasks.org
   * Verifique se ela aparece em outros clientes CalDAV (como o Lembretes do macOS)
   * Confirme que as alterações sincronizam em ambas as direções

**Recursos disponíveis:**

* ✅ Criação e edição de tarefas
* ✅ Datas de vencimento e lembretes
* ✅ Conclusão e status das tarefas
* ✅ Níveis de prioridade
* ✅ Subtarefas e hierarquia de tarefas
* ✅ Etiquetas e categorias
* ✅ Sincronização bidirecional com outros clientes CalDAV

**Solução de problemas:**

* Se nenhum calendário de tarefas aparecer, tente atualizar manualmente nas configurações do Tasks.org
* Certifique-se de ter pelo menos uma tarefa criada no servidor (você pode criar uma primeiro no Lembretes do macOS)
* Verifique a conectividade de rede com `caldav.forwardemail.net`

### Como configurar SRS para Forward Email {#how-do-i-set-up-srs-for-forward-email}

Nós configuramos automaticamente o [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – você não precisa fazer isso manualmente.

### Como configurar MTA-STS para Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Por favor, consulte [nossa seção sobre MTA-STS](#do-you-support-mta-sts) para mais informações.

### Como adicionar uma foto de perfil ao meu endereço de e-mail {#how-do-i-add-a-profile-picture-to-my-email-address}

Se você usa Gmail, siga os passos abaixo:

1. Acesse <https://google.com> e saia de todas as contas de e-mail
2. Clique em "Fazer login" e no menu suspenso clique em "outra conta"
3. Selecione "Usar outra conta"
4. Selecione "Criar conta"
5. Selecione "Usar meu endereço de e-mail atual em vez disso"
6. Digite seu endereço de e-mail do domínio personalizado
7. Recupere o e-mail de verificação enviado para seu endereço
8. Insira o código de verificação deste e-mail
9. Complete as informações do perfil para sua nova conta Google
10. Concorde com todas as políticas de Privacidade e Termos de Uso
11. Acesse <https://google.com> e no canto superior direito, clique no ícone do seu perfil e clique no botão "alterar"
12. Faça upload de uma nova foto ou avatar para sua conta
13. As alterações levarão aproximadamente 1-2 horas para propagar, mas às vezes podem ser muito rápidas.
14. Envie um e-mail de teste e a foto do perfil deverá aparecer.
## Recursos Avançados {#advanced-features}

### Vocês suportam newsletters ou listas de mala direta para e-mails relacionados a marketing {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Sim, você pode ler mais em <https://forwardemail.net/guides/newsletter-with-listmonk>.

Por favor, note que para manter a reputação do IP e garantir a entregabilidade, o Forward Email possui um processo de revisão manual por domínio para **aprovação de newsletter**. Envie um e-mail para <support@forwardemail.net> ou abra uma [solicitação de ajuda](https://forwardemail.net/help) para aprovação. Isso normalmente leva menos de 24 horas, com a maioria das solicitações sendo atendidas em 1-2 horas. Em breve, pretendemos tornar esse processo instantâneo com controles adicionais de spam e alertas. Esse processo garante que seus e-mails cheguem à caixa de entrada e que suas mensagens não sejam marcadas como spam.

### Vocês suportam o envio de e-mails via API {#do-you-support-sending-email-with-api}

Sim, desde maio de 2023 suportamos o envio de e-mails via API como um complemento para todos os usuários pagos.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Por favor, certifique-se de que leu nossos <a href="/terms" class="alert-link" target="_blank">Termos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidade</a> e <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites SMTP de Saída</a> &ndash; seu uso é considerado como reconhecimento e concordância.
  </span>
</div>

Por favor, consulte nossa seção sobre [E-mails](/email-api#outbound-emails) na documentação da API para opções, exemplos e mais informações.

Para enviar e-mails de saída com nossa API, você deve usar seu token de API disponível em [Minha Segurança](/my-account/security).

### Vocês suportam o recebimento de e-mails via IMAP {#do-you-support-receiving-email-with-imap}

Sim, desde 16 de outubro de 2023 suportamos o recebimento de e-mails via IMAP como um complemento para todos os usuários pagos.  **Por favor, leia nosso artigo detalhado** sobre [como funciona nosso recurso de armazenamento de caixa de correio criptografado SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Por favor, certifique-se de que leu nossos <a href="/terms" class="alert-link" target="_blank">Termos</a> e <a href="/privacy" class="alert-link" target="_blank">Política de Privacidade</a> &ndash; seu uso é considerado como reconhecimento e concordância.
  </span>
</div>

1. Crie um novo alias para seu domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (ex.: <code><hello@example.com></code>)

2. Clique em <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> ao lado do alias recém-criado. Copie para sua área de transferência e armazene com segurança a senha gerada exibida na tela.

3. Usando seu aplicativo de e-mail preferido, adicione ou configure uma conta com seu alias recém-criado (ex.: <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Dica:
     </strong>
     <span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> ou <a href="/blog/open-source" class="alert-link" target="_blank">uma alternativa open-source e focada em privacidade</a>.</span>
   </div>

4. Quando solicitado o nome do servidor IMAP, insira `imap.forwardemail.net`

5. Quando solicitado a porta do servidor IMAP, insira `993` (SSL/TLS) – veja [portas IMAP alternativas](/faq#what-are-your-imap-server-configuration-settings) se necessário
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Dica:
     </strong>
     <span>Se estiver usando Thunderbird, certifique-se de que "Segurança da conexão" esteja configurada para "SSL/TLS" e o método de autenticação para "Senha normal".</span>
   </div>
6. Quando solicitado a senha do servidor IMAP, cole a senha de <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> no passo 2 acima

7. **Salve suas configurações** – se estiver tendo problemas, por favor <a href="/help">contate-nos</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Parabéns!
    </strong>
    <span>
      Você completou todos os passos com sucesso.
    </span>
  </div>
</div>

</div>

### Vocês suportam POP3 {#do-you-support-pop3}

Sim, a partir de 4 de dezembro de 2023 suportamos [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) como um complemento para todos os usuários pagos.  **Por favor, leia nosso artigo detalhado** sobre [como funciona nosso recurso de armazenamento de caixa de correio criptografado SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Por favor, certifique-se de ter lido nossos <a href="/terms" class="alert-link" target="_blank">Termos</a> e <a href="/privacy" class="alert-link" target="_blank">Política de Privacidade</a> &ndash; seu uso é considerado como reconhecimento e concordância.
  </span>
</div>

1. Crie um novo alias para seu domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (ex. <code><hello@example.com></code>)

2. Clique em <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> ao lado do alias recém-criado. Copie para sua área de transferência e armazene com segurança a senha gerada exibida na tela.

3. Usando seu aplicativo de e-mail preferido, adicione ou configure uma conta com seu alias recém-criado (ex. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Dica:
     </strong>
     <span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, ou <a href="/blog/open-source" class="alert-link" target="_blank">uma alternativa open-source e focada em privacidade</a>.</span>
   </div>

4. Quando solicitado o nome do servidor POP3, insira `pop3.forwardemail.net`

5. Quando solicitado a porta do servidor POP3, insira `995` (SSL/TLS) – veja [portas alternativas para POP3](/faq#what-are-your-pop3-server-configuration-settings) se necessário
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Dica:
     </strong>
     <span>Se estiver usando Thunderbird, certifique-se de que "Segurança da conexão" esteja configurada para "SSL/TLS" e o método de autenticação esteja definido como "Senha normal".</span>
   </div>

6. Quando solicitado a senha do servidor POP3, cole a senha de <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> no passo 2 acima

7. **Salve suas configurações** – se estiver tendo problemas, por favor <a href="/help">contate-nos</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Parabéns!
    </strong>
    <span>
      Você completou todos os passos com sucesso.
    </span>
  </div>
</div>

</div>

### Vocês suportam calendários (CalDAV) {#do-you-support-calendars-caldav}

Sim, a partir de 5 de fevereiro de 2024 adicionamos este recurso. Nosso servidor é `caldav.forwardemail.net` e também é monitorado em nossa <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de status</a>.
Ele suporta tanto IPv4 quanto IPv6 e está disponível na porta `443` (HTTPS).

| Login    | Exemplo                    | Descrição                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome de usuário | `user@example.com`         | Endereço de e-mail de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>. |
| Senha | `************************` | Senha gerada específica para o alias.                                                                                                                                                        |

Para usar o suporte ao calendário, o **usuário** deve ser o endereço de e-mail de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> – e a **senha** deve ser uma senha gerada específica para o alias.

### Vocês suportam tarefas e lembretes (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Sim, a partir de 14 de outubro de 2025 adicionamos suporte CalDAV VTODO para tarefas e lembretes. Isso usa o mesmo servidor do nosso suporte ao calendário: `caldav.forwardemail.net`.

Nosso servidor CalDAV suporta tanto eventos de calendário (VEVENT) quanto componentes de tarefas (VTODO) usando **calendários unificados**. Isso significa que cada calendário pode conter tanto eventos quanto tarefas, proporcionando máxima flexibilidade e compatibilidade em todos os clientes CalDAV.

**Como funcionam os calendários e listas:**

* **Cada calendário suporta eventos e tarefas** - Você pode adicionar eventos, tarefas ou ambos em qualquer calendário
* **Listas do Apple Lembretes** - Cada lista que você cria no Apple Lembretes se torna um calendário separado no servidor
* **Múltiplos calendários** - Você pode criar quantos calendários precisar, cada um com seu próprio nome, cor e organização
* **Sincronização entre clientes** - Tarefas e eventos sincronizam perfeitamente entre todos os clientes compatíveis

**Clientes de tarefas suportados:**

* **macOS Lembretes** - Suporte nativo completo para criação, edição, conclusão e sincronização de tarefas
* **iOS Lembretes** - Suporte nativo completo em todos os dispositivos iOS
* **Tasks.org (Android)** - Gerenciador de tarefas open-source popular com sincronização CalDAV
* **Thunderbird** - Suporte a tarefas e calendário no cliente de e-mail desktop
* **Qualquer gerenciador de tarefas compatível com CalDAV** - Suporte padrão ao componente VTODO

**Recursos de tarefas suportados:**

* Criação, edição e exclusão de tarefas
* Datas de vencimento e datas de início
* Status de conclusão da tarefa (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Níveis de prioridade da tarefa
* Tarefas recorrentes
* Descrições e notas das tarefas
* Sincronização entre múltiplos dispositivos
* Subtarefas com propriedade RELATED-TO
* Lembretes de tarefas com VALARM

As credenciais de login são as mesmas do suporte ao calendário:

| Login    | Exemplo                    | Descrição                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome de usuário | `user@example.com`         | Endereço de e-mail de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>. |
| Senha | `************************` | Senha gerada específica para o alias.                                                                                                                                                        |

**Notas importantes:**

* **Cada lista do Lembretes é um calendário separado** - Quando você cria uma nova lista no Apple Lembretes, ela cria um novo calendário no servidor CalDAV
* **Usuários Thunderbird** - Você precisará se inscrever manualmente em cada calendário/lista que deseja sincronizar, ou usar a URL da home do calendário: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Usuários Apple** - A descoberta do calendário acontece automaticamente, então todos os seus calendários e listas aparecerão no Calendar.app e Reminders.app
* **Calendários unificados** - Todos os calendários suportam eventos e tarefas, dando flexibilidade na organização dos seus dados
### Você suporta contatos (CardDAV) {#do-you-support-contacts-carddav}

Sim, a partir de 12 de junho de 2025 adicionamos esse recurso. Nosso servidor é `carddav.forwardemail.net` e também é monitorado em nossa <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de status</a>.

Ele suporta tanto IPv4 quanto IPv6 e está disponível na porta `443` (HTTPS).

| Login    | Exemplo                    | Descrição                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome de usuário | `user@example.com`         | Endereço de email de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>. |
| Senha | `************************` | Senha gerada específica para o alias.                                                                                                                                                        |

Para usar o suporte a contatos, o **usuário** deve ser o endereço de email de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> – e a **senha** deve ser uma senha gerada específica para o alias.

### Você suporta envio de email com SMTP {#do-you-support-sending-email-with-smtp}

Sim, desde maio de 2023 suportamos o envio de email com SMTP como um complemento para todos os usuários pagos.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Por favor, certifique-se de ter lido nossos <a href="/terms" class="alert-link" target="_blank">Termos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidade</a> e <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites de SMTP de Saída</a> &ndash; seu uso é considerado reconhecimento e concordância.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se você usa Gmail, consulte nosso <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Guia Enviar Email Como com Gmail</a>. Se você é um desenvolvedor, consulte nossa <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentação da API de email</a>.
  </span>
</div>

1. Vá para <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Configuração SMTP de Saída e siga as instruções de configuração

2. Crie um novo alias para seu domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (ex. <code><hello@example.com></code>)

3. Clique em <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> ao lado do alias recém-criado. Copie para sua área de transferência e armazene com segurança a senha gerada exibida na tela.

4. Usando seu aplicativo de email preferido, adicione ou configure uma conta com seu alias recém-criado (ex. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Dica:
     </strong>
     <span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> ou <a href="/blog/open-source" class="alert-link" target="_blank">uma alternativa open-source e focada em privacidade</a>.</span>
   </div>
5. Quando solicitado o nome do servidor SMTP, insira `smtp.forwardemail.net`

6. Quando solicitado a porta do servidor SMTP, insira `465` (SSL/TLS) – veja [portas SMTP alternativas](/faq#what-are-your-smtp-server-configuration-settings) se necessário
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Dica:
     </strong>
     <span>Se você estiver usando Thunderbird, certifique-se de que "Segurança da conexão" esteja configurada para "SSL/TLS" e o método de autenticação esteja definido como "Senha normal".</span>
   </div>

7. Quando solicitado a senha do servidor SMTP, cole a senha de <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> no passo 3 acima

8. **Salve suas configurações e envie seu primeiro e-mail de teste** – se estiver tendo problemas, por favor <a href="/help">contate-nos</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Por favor, note que para manter a reputação do IP e garantir a entregabilidade, temos um processo de revisão manual por domínio para aprovação do SMTP de saída. Isso normalmente leva menos de 24 horas, com a maioria dos pedidos sendo atendidos em 1-2 horas. Em um futuro próximo, pretendemos tornar esse processo instantâneo com controles adicionais de spam e alertas. Esse processo garante que seus e-mails cheguem à caixa de entrada e que suas mensagens não sejam marcadas como spam.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Parabéns!
    </strong>
    <span>
      Você completou com sucesso todos os passos.
    </span>
  </div>
</div>

</div>

### Vocês suportam OpenPGP/MIME, criptografia de ponta a ponta ("E2EE") e Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Sim, suportamos [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [criptografia de ponta a ponta ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) e a descoberta de chaves públicas usando [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Você pode configurar o OpenPGP usando [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) ou [hospedar suas próprias chaves](https://wiki.gnupg.org/WKDHosting) (consulte [este gist para configuração do servidor WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* As consultas WKD são armazenadas em cache por 1 hora para garantir a entrega oportuna do e-mail → portanto, se você adicionar, alterar ou remover sua chave WKD, por favor envie um e-mail para `support@forwardemail.net` com seu endereço de e-mail para que possamos limpar o cache manualmente.
* Suportamos criptografia PGP para mensagens encaminhadas via consulta WKD ou usando uma chave PGP carregada em nossa interface.
* Chaves carregadas têm precedência enquanto a caixa de seleção PGP estiver habilitada/marcada.
* Mensagens enviadas para webhooks atualmente não são criptografadas com PGP.
* Se você tiver múltiplos aliases que correspondem a um endereço de encaminhamento dado (ex: combinação regex/wildcard/exata) e se mais de um deles contiver uma chave PGP carregada e tiver PGP marcado → então enviaremos um e-mail de alerta de erro e não criptografaremos a mensagem com sua chave PGP carregada. Isso é muito raro e geralmente se aplica apenas a usuários avançados com regras complexas de alias.
* **A criptografia PGP não será aplicada ao encaminhamento de e-mail através dos nossos servidores MX se o remetente tiver uma política DMARC de rejeição. Se você precisar de criptografia PGP em *todos* os e-mails, sugerimos usar nosso serviço IMAP e configurar sua chave PGP para seu alias para e-mails recebidos.**

**Você pode validar sua configuração do Web Key Directory em <https://wkd.chimbosonic.com/> (open-source) ou <https://www.webkeydirectory.com/> (proprietário).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Criptografia Automática:
  </strong>
  <span>Se você estiver usando nosso <a href="#do-you-support-sending-email-with-smtp" class="alert-link">serviço SMTP de saída</a> e enviando mensagens não criptografadas, então tentaremos automaticamente criptografar as mensagens por destinatário usando <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Você deve seguir todos os passos abaixo para habilitar o OpenPGP para seu nome de domínio personalizado.
  </span>
</div>

1. Baixe e instale o plugin recomendado para seu cliente de email abaixo:

   | Cliente de Email | Plataforma | Plugin Recomendado                                                                                                                                                                    | Notas                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | Desktop  | [Configurar OpenPGP no Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird tem suporte nativo para OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                            |
   | Gmail           | Navegador  | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licença proprietária)                                                                            | O Gmail não suporta OpenPGP, porém você pode baixar o plugin open-source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                    |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | O Apple Mail não suporta OpenPGP, porém você pode baixar o plugin open-source [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                       |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) ou [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (licença proprietária)                           | O Apple Mail não suporta OpenPGP, porém você pode baixar o plugin open-source [PGPro](https://github.com/opensourceios/PGPro/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                    |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | O cliente de email desktop do Outlook não suporta OpenPGP, porém você pode baixar o plugin open-source [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                    |
   | Outlook         | Navegador  | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licença proprietária)                                                                            | O cliente de email web do Outlook não suporta OpenPGP, porém você pode baixar o plugin open-source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                          |
   | Android         | Mobile   | [OpenKeychain](https://www.openkeychain.org/) ou [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [Clientes de email Android](/blog/open-source/android-email-clients) como [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) e [FairEmail](https://github.com/M66B/FairEmail) suportam o plugin open-source [OpenKeychain](https://www.openkeychain.org/). Você pode alternativamente usar o plugin open-source (licenciamento proprietário) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome   | Navegador  | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licença proprietária)                                                                            | Você pode baixar a extensão open-source para navegador [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Mozilla Firefox | Navegador  | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licença proprietária)                                                                            | Você pode baixar a extensão open-source para navegador [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Microsoft Edge  | Navegador  | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | Você pode baixar a extensão open-source para navegador [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                                |
   | Brave           | Navegador  | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licença proprietária)                                                                            | Você pode baixar a extensão open-source para navegador [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Balsa           | Desktop  | [Configurar OpenPGP no Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                            | Balsa tem suporte nativo para OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | KMail           | Desktop  | [Configurar OpenPGP no KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                 | KMail tem suporte nativo para OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | GNOME Evolution | Desktop  | [Configurar OpenPGP no Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                               | GNOME Evolution tem suporte nativo para OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Terminal        | Desktop  | [Configurar gpg no Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                           | Você pode usar a ferramenta open-source de linha de comando [gpg](https://www.gnupg.org/download/) para gerar uma nova chave via linha de comando.                                                                                                                                                                                                                                                                                                            |
2. Abra o plugin, crie sua chave pública e configure seu cliente de e-mail para usá-la.

3. Faça o upload da sua chave pública em <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Dica:
     </strong>
     <span>Você pode visitar <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> para gerenciar sua chave no futuro.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Complemento Opcional:
     </strong>
     <span>
       Se você estiver usando nosso serviço de <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">armazenamento criptografado (IMAP/POP3)</a> e quiser que <i>todos</i> os e-mails armazenados em seu banco de dados SQLite (já criptografado) sejam criptografados com sua chave pública, então vá para <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (ex. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Editar <i class="fa fa-angle-right"></i> OpenPGP e faça o upload da sua chave pública.
     </span>
   </div>

4. Adicione um novo registro `CNAME` ao seu nome de domínio (ex. `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Nome/Host/Alias</th>
         <th class="text-center">TTL</th>
         <th>Tipo</th>
         <th>Resposta/Valor</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td><code>openpgpkey</code></td>
         <td class="text-center">3600</td>
         <td class="notranslate">CNAME</td>
         <td><code>wkd.keys.openpgp.org</code></td>
       </tr>
     </tbody>
   </table>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Dica:
     </strong>
     <span>Se seu alias estiver usando nossos <a class="alert-link" href="/disposable-addresses" target="_blank">domínios descartáveis/vanity</a> (ex. <code>hideaddress.net</code>), então você pode pular esta etapa.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Parabéns!
    </strong>
    <span>
      Você completou todas as etapas com sucesso.
    </span>
  </div>
</div>

### Vocês suportam criptografia S/MIME {#do-you-support-smime-encryption}

Sim, suportamos criptografia [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) conforme definido na [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME fornece criptografia de ponta a ponta usando certificados X.509, amplamente suportados por clientes de e-mail corporativos.

Suportamos certificados RSA e ECC (Criptografia de Curva Elíptica):

* **Certificados RSA**: mínimo de 2048 bits, recomendado 4096 bits
* **Certificados ECC**: curvas NIST P-256, P-384 e P-521

Para configurar a criptografia S/MIME para seu alias:

1. Obtenha um certificado S/MIME de uma Autoridade Certificadora (CA) confiável ou gere um certificado autoassinado para testes.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Dica:
     </strong>
     <span>Certificados S/MIME gratuitos estão disponíveis em provedores como <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> ou <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Exporte seu certificado no formato PEM (apenas o certificado público, não a chave privada).

3. Vá para <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (ex. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Editar <i class="fa fa-angle-right"></i> S/MIME e faça o upload do seu certificado público.
4. Uma vez configurado, todos os e-mails recebidos para seu alias serão criptografados usando seu certificado S/MIME antes de serem armazenados ou encaminhados.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Nota:
     </strong>
     <span>
       A criptografia S/MIME é aplicada às mensagens recebidas que ainda não estão criptografadas. Se uma mensagem já estiver criptografada com OpenPGP ou S/MIME, ela não será recriptografada.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Importante:
     </strong>
     <span>
       A criptografia S/MIME não será aplicada ao encaminhamento de e-mails através dos nossos servidores MX se o remetente tiver uma política DMARC de rejeição. Se você precisar de criptografia S/MIME em <em>todos</em> os e-mails, sugerimos usar nosso serviço IMAP e configurar seu certificado S/MIME para seu alias para e-mails recebidos.
     </span>
   </div>

Os seguintes clientes de e-mail possuem suporte nativo a S/MIME:

| Cliente de E-mail | Plataforma | Notas                                                                                                               |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS     | Suporte nativo a S/MIME. Vá em Mail > Preferences > Accounts > sua conta > Trust para configurar certificados.      |
| Apple Mail        | iOS       | Suporte nativo a S/MIME. Vá em Settings > Mail > Accounts > sua conta > Advanced > S/MIME para configurar.          |
| Microsoft Outlook | Windows   | Suporte nativo a S/MIME. Vá em File > Options > Trust Center > Trust Center Settings > Email Security para configurar. |
| Microsoft Outlook | macOS     | Suporte nativo a S/MIME. Vá em Tools > Accounts > Advanced > Security para configurar.                              |
| Thunderbird       | Desktop   | Suporte nativo a S/MIME. Vá em Account Settings > End-To-End Encryption > S/MIME para configurar.                   |
| GNOME Evolution   | Desktop   | Suporte nativo a S/MIME. Vá em Edit > Preferences > Mail Accounts > sua conta > Security para configurar.           |
| KMail             | Desktop   | Suporte nativo a S/MIME. Vá em Settings > Configure KMail > Identities > sua identidade > Cryptography para configurar. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Parabéns!
    </strong>
    <span>
      Você configurou com sucesso a criptografia S/MIME para seu alias.
    </span>
  </div>
</div>

### Vocês suportam filtragem de e-mail Sieve {#do-you-support-sieve-email-filtering}

Sim! Suportamos filtragem de e-mail [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) conforme definido na [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve é uma linguagem de script poderosa e padronizada para filtragem de e-mails no lado do servidor que permite organizar, filtrar e responder automaticamente às mensagens recebidas.

#### Extensões Sieve suportadas {#supported-sieve-extensions}

Suportamos um conjunto abrangente de extensões Sieve:

| Extensão                    | RFC                                                                                    | Descrição                                      |
| --------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Arquivar mensagens em pastas específicas       |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | Rejeitar mensagens com um erro                  |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | Respostas automáticas de férias/ausência        |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | Intervalos detalhados para respostas de férias  |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | Definir flags IMAP (\Seen, \Flagged, etc.)      |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Testar remetente/destinatário do envelope       |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | Testar conteúdo do corpo da mensagem             |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | Armazenar e usar variáveis em scripts            |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | Comparações relacionais (maior que, menor que)  |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | Comparações numéricas                            |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | Copiar mensagens enquanto redireciona           |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | Adicionar ou deletar cabeçalhos de mensagem     |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Testar valores de data/hora                      |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Acessar ocorrências específicas de cabeçalhos   |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | Correspondência por expressões regulares        |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | Enviar notificações (ex: mailto:)                |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | Acessar informações do ambiente                  |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | Testar existência de caixa postal, criar caixas  |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | Arquivar em caixas de uso especial (\Junk, \Trash) |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | Detectar mensagens duplicadas                    |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | Testar disponibilidade de extensão              |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | Acessar partes do endereço user+detail           |
#### Extensões Não Suportadas {#extensions-not-supported}

As seguintes extensões não são atualmente suportadas:

| Extensão                                                       | Motivo                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `include`                                                       | Risco de segurança (injeção de script) e requer armazenamento global de scripts |
| `mboxmetadata` / `servermetadata`                               | Requer suporte à extensão IMAP METADATA                            |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Manipulação complexa da árvore MIME ainda não implementada         |

#### Exemplos de Scripts Sieve {#example-sieve-scripts}

**Arquivar newsletters em uma pasta:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Resposta automática durante férias:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Fora do Escritório"
    "Estou atualmente fora do escritório e responderei quando retornar.";
```

**Marcar mensagens de remetentes importantes:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Rejeitar spam com assuntos específicos:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Mensagem rejeitada devido a conteúdo de spam.";
}
```

#### Gerenciando Scripts Sieve {#managing-sieve-scripts}

Você pode gerenciar seus scripts Sieve de várias maneiras:

1. **Interface Web**: Vá para <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Apelidos <i class="fa fa-angle-right"></i> Scripts Sieve para criar e gerenciar scripts.

2. **Protocolo ManageSieve**: Conecte-se usando qualquer cliente compatível com ManageSieve (como o complemento Sieve do Thunderbird ou [sieve-connect](https://github.com/philpennock/sieve-connect)) para `imap.forwardemail.net`. Use a porta `2190` com STARTTLS (recomendado para a maioria dos clientes) ou a porta `4190` com TLS implícito.

3. **API**: Use nossa [API REST](/api#sieve-scripts) para gerenciar scripts programaticamente.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Nota:
  </strong>
  <span>
    O filtro Sieve é aplicado às mensagens recebidas antes de serem armazenadas na sua caixa de correio. Os scripts são executados em ordem de prioridade, e a primeira ação correspondente determina como a mensagem será tratada.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Segurança:
  </strong>
  <span>
    Por segurança, ações de redirecionamento são limitadas a 10 por script e 100 por dia. Respostas de férias têm limite de taxa para evitar abusos.
  </span>
</div>

### Vocês suportam MTA-STS {#do-you-support-mta-sts}

Sim, desde 2 de março de 2023 suportamos [MTA-STS](https://www.hardenize.com/blog/mta-sts). Você pode usar [este modelo](https://github.com/jpawlowski/mta-sts.template) se desejar habilitá-lo em seu domínio.

Nossa configuração pode ser encontrada publicamente no GitHub em <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Vocês suportam passkeys e WebAuthn {#do-you-support-passkeys-and-webauthn}

Sim! Desde 13 de dezembro de 2023 adicionamos suporte para passkeys [devido à alta demanda](https://github.com/orgs/forwardemail/discussions/182).

Passkeys permitem que você faça login com segurança sem precisar de senha e autenticação de dois fatores.

Você pode validar sua identidade com toque, reconhecimento facial, senha baseada no dispositivo ou PIN.

Permitimos que você gerencie até 30 passkeys ao mesmo tempo, para que possa fazer login com todos os seus dispositivos com facilidade.

Saiba mais sobre passkeys nos seguintes links:

* [Faça login em seus aplicativos e sites com passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Use passkeys para fazer login em apps e sites no iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Artigo da Wikipedia sobre Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Vocês suportam as melhores práticas de email {#do-you-support-email-best-practices}

Sim. Temos suporte integrado para SPF, DKIM, DMARC, ARC e SRS em todos os planos. Também trabalhamos extensivamente com os autores originais dessas especificações e outros especialistas em email para garantir perfeição e alta entregabilidade.

### Vocês suportam webhooks de bounce {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
    Procurando documentação sobre webhooks de email? Veja <a href="/faq#do-you-support-webhooks" class="alert-link">Vocês suportam webhooks?</a> para mais informações.
  <span>
  </span>
</div>

Sim, a partir de 14 de agosto de 2024 adicionamos esse recurso. Agora você pode ir em Minha Conta → Domínios → Configurações → URL do Webhook de Bounce e configurar uma URL `http://` ou `https://` para a qual enviaremos uma requisição `POST` sempre que emails SMTP enviados retornarem bounce.

Isso é útil para você gerenciar e monitorar seu SMTP de saída – e pode ser usado para manter assinantes, opt-out e detectar sempre que ocorrerem bounces.

Os payloads do webhook de bounce são enviados como JSON com as seguintes propriedades:

* `email_id` (String) - ID do email que corresponde a um email em Minha Conta → Emails (SMTP de saída)
* `list_id` (String) - valor do cabeçalho `List-ID` (case-insensitive), se houver, do email original enviado
* `list_unsubscribe` (String) - valor do cabeçalho `List-Unsubscribe` (case-insensitive), se houver, do email original enviado
* `feedback_id` (String) - valor do cabeçalho `Feedback-ID` (case-insensitive), se houver, do email original enviado
* `recipient` (String) - endereço de email do destinatário que retornou bounce ou erro
* `message` (String) - mensagem detalhada de erro do bounce
* `response` (String) - mensagem de resposta SMTP
* `response_code` (Number) - código de resposta SMTP analisado
* `truth_source` (String) - se o código de resposta veio de uma fonte confiável, este valor será preenchido com o nome do domínio raiz (ex.: `google.com` ou `yahoo.com`)
* `bounce` (Object) - objeto contendo as seguintes propriedades que detalham o bounce e o status de rejeição
  * `action` (String) - ação do bounce (ex.: `"reject"`)
  * `message` (String) - motivo do bounce (ex.: `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - categoria do bounce (ex.: `"block"`)
  * `code` (Number) - código de status do bounce (ex.: `554`)
  * `status` (String) - código do bounce da mensagem de resposta (ex.: `5.7.1`)
  * `line` (Number) - número da linha analisada, se houver, [da lista de parse de bounce do Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (ex.: `526`)
* `headers` (Object) - pares chave-valor dos cabeçalhos do email enviado
* `bounced_at` (String) - data formatada em [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) de quando o erro de bounce ocorreu

Por exemplo:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Aqui estão algumas notas adicionais sobre webhooks de bounce:

* Se o payload do webhook contiver um valor `list_id`, `list_unsubscribe` ou `feedback_id`, você deve tomar a ação apropriada para remover o `recipient` da lista, se necessário.
  * Se o valor de `bounce.category` for um dos seguintes: `"block"`, `"recipient"`, `"spam"` ou `"virus"`, você definitivamente deve remover o usuário da lista.
* Se precisar verificar os payloads do webhook (para garantir que eles realmente vêm do nosso servidor), você pode [resolver o endereço IP remoto do cliente para o hostname usando uma busca reversa](https://nodejs.org/api/dns.html#dnspromisesreverseip) – deve ser `smtp.forwardemail.net`.
  * Você também pode verificar o IP contra [nossos endereços IP publicados](#what-are-your-servers-ip-addresses).
  * Vá em Minha Conta → Domínios → Configurações → Chave de Verificação de Payload da Assinatura do Webhook para obter sua chave de webhook.
    * Você pode rotacionar essa chave a qualquer momento por razões de segurança.
    * Calcule e compare o valor `X-Webhook-Signature` da nossa requisição de webhook com o valor do corpo computado usando essa chave. Um exemplo de como fazer isso está disponível em [esta postagem do Stack Overflow](https://stackoverflow.com/a/68885281).
  * Veja a discussão em <https://github.com/forwardemail/free-email-forwarding/issues/235> para mais informações.
* Esperaremos até `5` segundos para que seu endpoint de webhook responda com um código de status `200`, e tentaremos novamente até `1` vez.
* Se detectarmos que sua URL de webhook de bounce apresenta erro ao tentarmos enviar uma requisição, enviaremos um email de cortesia uma vez por semana.
### Você suporta webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
    Procurando documentação sobre webhooks de bounce? Veja <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Você suporta webhooks de bounce?</a> para mais informações.
  <span>
  </span>
</div>

Sim, desde 15 de maio de 2020 adicionamos esse recurso. Você pode simplesmente adicionar webhook(s) exatamente como faria com qualquer destinatário! Por favor, certifique-se de que o protocolo "http" ou "https" esteja prefixado na URL do webhook.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Proteção de Privacidade Aprimorada:
  </strong>
  <span>
    Se você está em um plano pago (que oferece proteção de privacidade aprimorada), então por favor vá para <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> e clique em "Aliases" ao lado do seu domínio para configurar seus webhooks. Se quiser saber mais sobre planos pagos, veja nossa página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preços</a>. Caso contrário, você pode continuar seguindo as instruções abaixo.
  </span>
</div>

Se você está no plano gratuito, basta adicionar um novo registro DNS <strong class="notranslate">TXT</strong> conforme mostrado abaixo:

Por exemplo, se eu quiser que todos os e-mails enviados para `alias@example.com` sejam encaminhados para um novo endpoint de teste [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Ou talvez você queira que todos os e-mails enviados para `example.com` sejam encaminhados para este endpoint:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Aqui estão notas adicionais sobre webhooks:**

* Se você precisar verificar os payloads do webhook (para garantir que eles realmente vêm do nosso servidor), então você pode [resolver o endereço IP remoto do cliente e o hostname do cliente usando uma busca reversa](https://nodejs.org/api/dns.html#dnspromisesreverseip) – deve ser `mx1.forwardemail.net` ou `mx2.forwardemail.net`.
  * Você também pode verificar o IP contra [nossos endereços IP publicados](#what-are-your-servers-ip-addresses).
  * Se você estiver em um plano pago, vá para Minha Conta → Domínios → Configurações → Chave de Verificação de Payload da Assinatura do Webhook para obter sua chave de webhook.
    * Você pode rotacionar essa chave a qualquer momento por razões de segurança.
    * Calcule e compare o valor `X-Webhook-Signature` da nossa requisição webhook com o valor do corpo computado usando essa chave. Um exemplo de como fazer isso está disponível em [esta postagem do Stack Overflow](https://stackoverflow.com/a/68885281).
  * Veja a discussão em <https://github.com/forwardemail/free-email-forwarding/issues/235> para mais informações.
* Se um webhook não responder com um código de status `200`, então armazenaremos sua resposta no [log de erros criado](#do-you-store-error-logs) – o que é útil para depuração.
* As requisições HTTP do webhook serão tentadas até 3 vezes a cada tentativa de conexão SMTP, com um timeout máximo de 60 segundos por requisição POST ao endpoint. **Note que isso não significa que ele só tenta 3 vezes**, na verdade ele tentará continuamente ao longo do tempo enviando um código SMTP 421 (que indica ao remetente para tentar novamente depois) após a 3ª tentativa falha de requisição HTTP POST. Isso significa que o e-mail será tentado continuamente por dias até que um código de status 200 seja alcançado.
* Tentaremos automaticamente com base nos códigos de status e erro padrão usados no [método retry do superagent](https://ladjs.github.io/superagent/#retrying-requests) (somos mantenedores).
* Agrupamos as requisições HTTP do webhook para o mesmo endpoint em uma única requisição em vez de múltiplas para economizar recursos e acelerar o tempo de resposta. Por exemplo, se você enviar um e-mail para <webhook1@example.com>, <webhook2@example.com> e <webhook3@example.com>, e todos estiverem configurados para atingir o mesmo URL *exato* do endpoint, então apenas uma requisição será feita. Agrupamos por correspondência exata do endpoint com igualdade estrita.
* Note que usamos o método "simpleParser" da biblioteca [mailparser](https://nodemailer.com/extras/mailparser/) para analisar a mensagem em um objeto amigável ao JSON.
* O valor do e-mail bruto como String é fornecido na propriedade "raw".
* Os resultados de autenticação são fornecidos nas propriedades "dkim", "spf", "arc", "dmarc" e "bimi".
* Os cabeçalhos do e-mail analisados são fornecidos na propriedade "headers" – mas também note que você pode usar "headerLines" para facilitar a iteração e análise.
* Os destinatários agrupados para este webhook são agrupados juntos e fornecidos na propriedade "recipients".
* As informações da sessão SMTP são fornecidas na propriedade "session". Isso contém informações sobre o remetente da mensagem, horário de chegada da mensagem, HELO e hostname do cliente. O valor do hostname do cliente como `session.clientHostname` é ou o FQDN (de uma busca PTR reversa) ou é `session.remoteAddress` entre colchetes (ex.: `"[127.0.0.1]"`).
* Se você precisar de uma forma rápida de obter o valor de `X-Original-To`, então pode usar o valor de `session.recipient` (veja o exemplo abaixo). O cabeçalho `X-Original-To` é um cabeçalho que adicionamos às mensagens para depuração com o destinatário original (antes do encaminhamento mascarado) da mensagem.
* Se você precisar remover as propriedades `attachments` e/ou `raw` do corpo do payload, basta adicionar `?attachments=false`, `?raw=false` ou `?attachments=false&raw=false` ao seu endpoint webhook como parâmetro de querystring (ex.: `https://example.com/webhook?attachments=false&raw=false`).
* Se houver anexos, eles serão adicionados ao Array `attachments` com valores Buffer. Você pode analisá-los de volta para conteúdo usando uma abordagem com JavaScript como:
  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
  <span>
  </span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### Você suporta expressões regulares ou regex {#do-you-support-regular-expressions-or-regex}

Sim, a partir de 27 de setembro de 2021 adicionamos esse recurso. Você pode simplesmente escrever expressões regulares ("regex") para corresponder aliases e realizar substituições.

Aliases suportados por expressões regulares são aqueles que começam com `/` e terminam com `/` e seus destinatários são endereços de e-mail ou webhooks. Os destinatários também podem incluir suporte a substituição regex (ex.: `$1`, `$2`).

Suportamos duas flags de expressões regulares, incluindo `i` e `g`. A flag case-insensitive `i` é um padrão permanente e sempre aplicada. A flag global `g` pode ser adicionada por você ao acrescentar `/g` ao final da expressão.

Observe que também suportamos nosso <a href="#can-i-disable-specific-aliases">recurso de alias desabilitado</a> para a parte do destinatário com nosso suporte a regex.

Expressões regulares não são suportadas em <a href="/disposable-addresses" target="_blank">domínios vanity globais</a> (pois isso poderia ser uma vulnerabilidade de segurança).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Proteção Avançada de Privacidade:
  </strong>
  <span>
    Se você está em um plano pago (que oferece proteção avançada de privacidade), por favor acesse <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> e clique em "Aliases" ao lado do seu domínio para configurar aliases, incluindo aqueles com expressões regulares. Se quiser saber mais sobre planos pagos, veja nossa página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preços</a>.
  </span>
</div>

#### Exemplos para Proteção Avançada de Privacidade {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome do Alias</th>
      <th>Efeito</th>
      <th>Teste</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>E-mails para `linus@example.com` ou `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">ver teste no RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>E-mails para `24highst@example.com` ou `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">ver teste no RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
    Para testar essas expressões em <a href="https://regexr.com" class="alert-link">RegExr</a>, escreva a expressão na caixa superior e depois digite um alias de exemplo na caixa de texto abaixo. Se corresponder, ficará azul.
  <span>
  </span>
</div>

#### Exemplos para o plano gratuito {#examples-for-the-free-plan}

Se você está no plano gratuito, basta adicionar um novo registro DNS <strong class="notranslate">TXT</strong> usando um ou mais dos exemplos fornecidos abaixo:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemplo Simples:</strong> Se eu quiser que todos os e-mails enviados para `linus@example.com` ou `torvalds@example.com` sejam encaminhados para `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vazio</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemplo de Substituição Nome Sobrenome:</strong> Imagine que todos os endereços de e-mail da sua empresa seguem o padrão `firstname.lastname@example.com`. Se eu quiser que todos os e-mails que seguem o padrão `firstname.lastname@example.com` sejam encaminhados para `firstname.lastname@company.com` com suporte a substituição (<a href="https://regexr.com/66hnu" class="alert-link">ver teste no RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemplo de Substituição com Símbolo de Mais:</strong> Se eu quiser que todos os e-mails que vão para `info@example.com` ou `support@example.com` sejam encaminhados para `user+info@gmail.com` ou `user+support@gmail.com` respectivamente (com suporte a substituição) (<a href="https://regexr.com/66ho7" class="alert-link">ver teste no RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemplo de Substituição de Querystring para Webhook:</strong> Talvez você queira que todos os e-mails que vão para `example.com` sejam enviados para um <a href="#do-you-support-webhooks" class="alert-link">webhook</a> e tenham uma chave de querystring dinâmica "to" com o valor da parte do nome de usuário do endereço de e-mail (<a href="https://regexr.com/66ho4" class="alert-link">ver teste no RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemplo de rejeição silenciosa:</strong> Se você quiser que todos os e-mails que correspondam a um determinado padrão sejam desativados e rejeitados silenciosamente (aparece para o remetente como se a mensagem tivesse sido enviada com sucesso, mas na verdade não vai para lugar nenhum) com código de status `250` (veja <a href="#can-i-disable-specific-aliases" class="alert-link">Posso desativar aliases específicos</a>), então simplesmente use a mesma abordagem com um único ponto de exclamação "!". Isso indica ao remetente que a mensagem foi entregue com sucesso, mas na verdade não foi para lugar nenhum (ex: buraco negro ou `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemplo de rejeição suave:</strong> Se você quiser que todos os e-mails que correspondam a um determinado padrão sejam desativados e rejeitados suavemente com código de status `421` (veja <a href="#can-i-disable-specific-aliases" class="alert-link">Posso desativar aliases específicos</a>), então simplesmente use a mesma abordagem com um ponto de exclamação duplo "!!". Isso indica ao remetente para tentar reenviar o e-mail, e os e-mails para esse alias serão reenviados por aproximadamente 5 dias e depois rejeitados permanentemente.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemplo de rejeição definitiva:</strong> Se você quiser que todos os e-mails que correspondam a um determinado padrão sejam desativados e rejeitados definitivamente com o código de status `550` (veja <a href="#can-i-disable-specific-aliases" class="alert-link">Posso desativar aliases específicos</a>), então simplesmente use a mesma abordagem com três pontos de exclamação "!!!". Isso indica ao remetente um erro permanente e os e-mails não serão reenviados, eles serão rejeitados para esse alias.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
    Curioso sobre como escrever uma expressão regular ou precisa testar sua substituição? Você pode acessar o site gratuito de teste de expressões regulares <a href="https://regexr.com" class="alert-link">RegExr</a> em <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Quais são os seus limites de SMTP de saída {#what-are-your-outbound-smtp-limits}

Limitamos usuários e domínios a 300 mensagens SMTP de saída por 1 dia. Isso equivale a uma média de mais de 9000 e-mails em um mês calendário. Se você precisar exceder essa quantidade ou tiver e-mails consistentemente grandes, por favor [entre em contato conosco](https://forwardemail.net/help).

### Preciso de aprovação para ativar o SMTP {#do-i-need-approval-to-enable-smtp}

Sim, por favor, note que para manter a reputação do IP e garantir a entregabilidade, o Forward Email possui um processo de revisão manual por domínio para aprovação do SMTP de saída. Envie um e-mail para <support@forwardemail.net> ou abra uma [solicitação de ajuda](https://forwardemail.net/help) para aprovação. Isso normalmente leva menos de 24 horas, com a maioria dos pedidos sendo atendidos em 1-2 horas. Em breve, pretendemos tornar esse processo instantâneo com controles adicionais de spam e alertas. Esse processo garante que seus e-mails cheguem à caixa de entrada e que suas mensagens não sejam marcadas como spam.

### Quais são as configurações do seu servidor SMTP {#what-are-your-smtp-server-configuration-settings}

Nosso servidor é `smtp.forwardemail.net` e também é monitorado em nossa <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de status</a>.

Ele suporta tanto IPv4 quanto IPv6 e está disponível nas portas `465` e `2465` para SSL/TLS (recomendado) e `587`, `2587`, `2525` e `25` para TLS (STARTTLS).

**A partir de outubro de 2025**, agora suportamos conexões **TLS 1.0 legadas** nas portas `2455` (SSL/TLS) e `2555` (STARTTLS) para dispositivos mais antigos, como impressoras, scanners, câmeras e clientes de e-mail legados que não suportam versões modernas do TLS. Essas portas são fornecidas como alternativa ao Gmail, Yahoo, Outlook e outros provedores que descontinuaram o suporte para protocolos TLS mais antigos.

> \[!CAUTION]
> **Suporte TLS 1.0 Legado (Portas 2455 e 2555)**: Essas portas usam o protocolo TLS 1.0 obsoleto, que possui vulnerabilidades de segurança conhecidas (BEAST, POODLE). Use essas portas somente se seu dispositivo absolutamente não puder suportar TLS 1.2 ou superior. Recomendamos fortemente atualizar o firmware do seu dispositivo ou mudar para clientes de e-mail modernos sempre que possível. Essas portas destinam-se exclusivamente à compatibilidade com hardware legado (impressoras antigas, scanners, câmeras, dispositivos IoT).

|                                     Protocolo                                     | Nome do Host            |            Portas           |        IPv4        |        IPv6        | Notas                                  |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Preferido**                             | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | TLS 1.2+ moderno (Recomendado)         |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Suportado (prefira a porta SSL/TLS `465`) |
|                             `SSL/TLS` **Apenas Legado**                          | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 apenas para dispositivos antigos |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Apenas Legado** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 apenas para dispositivos antigos |
| Login    | Exemplo                   | Descrição                                                                                                                                                                                |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Endereço de email de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>. |
| Password | `************************` | Alias                                                                                                                                                                                    |

Para enviar email de saída com SMTP, o **usuário SMTP** deve ser o endereço de email de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> – e a **senha SMTP** deve ser uma senha gerada específica para o alias.

Por favor, consulte [Vocês suportam o envio de email com SMTP](#do-you-support-sending-email-with-smtp) para instruções passo a passo.

### Quais são as configurações do seu servidor IMAP {#what-are-your-imap-server-configuration-settings}

Nosso servidor é `imap.forwardemail.net` e também é monitorado em nossa <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de status</a>.

Ele suporta tanto IPv4 quanto IPv6 e está disponível nas portas `993` e `2993` para SSL/TLS.

|         Protocolo        | Nome do Host            |     Portas    |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferido** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Login    | Exemplo                   | Descrição                                                                                                                                                                                |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Endereço de email de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>. |
| Password | `************************` | Senha gerada específica para o alias.                                                                                                                                                    |

Para conectar-se via IMAP, o **usuário IMAP** deve ser o endereço de email de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> – e a **senha IMAP** deve ser uma senha gerada específica para o alias.

Por favor, consulte [Vocês suportam o recebimento de email com IMAP](#do-you-support-receiving-email-with-imap) para instruções passo a passo.

### Quais são as configurações do seu servidor POP3 {#what-are-your-pop3-server-configuration-settings}

Nosso servidor é `pop3.forwardemail.net` e também é monitorado em nossa <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de status</a>.

Ele suporta tanto IPv4 quanto IPv6 e está disponível nas portas `995` e `2995` para SSL/TLS.

|         Protocolo        | Nome do Host            |     Portas    |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferido** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Login    | Exemplo                   | Descrição                                                                                                                                                                                |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Endereço de email de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>. |
| Password | `************************` | Senha gerada específica para o alias.                                                                                                                                                     |

Para conectar com POP3, o **usuário POP3** deve ser o endereço de email de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> – e a **senha IMAP** deve ser uma senha gerada específica para o alias.

Por favor, consulte [Você suporta POP3](#do-you-support-pop3) para instruções passo a passo.

### Como configurar a autodetecção de email para meu domínio {#how-do-i-set-up-email-autodiscovery-for-my-domain}

A autodetecção de email permite que clientes de email como **Thunderbird**, **Apple Mail**, **Microsoft Outlook** e dispositivos móveis detectem automaticamente as configurações corretas dos servidores IMAP, SMTP, POP3, CalDAV e CardDAV quando um usuário adiciona sua conta de email. Isso é definido pelo [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (email) e [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) e utiliza registros DNS SRV.

Forward Email publica registros de autodetecção em `forwardemail.net`. Você pode adicionar registros SRV diretamente ao seu domínio ou usar uma abordagem mais simples com CNAME.

#### Opção A: registros CNAME (mais simples) {#option-a-cname-records-simplest}

Adicione estes dois registros CNAME ao DNS do seu domínio. Isso delega a autodetecção aos servidores do Forward Email:

|  Tipo | Nome/Host      | Destino/Valor                  |
| :---: | -------------- | ----------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net` |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

O registro `autoconfig` é usado pelo **Thunderbird** e outros clientes baseados em Mozilla. O registro `autodiscover` é usado pelo **Microsoft Outlook**.

#### Opção B: registros SRV (direto) {#option-b-srv-records-direct}

Se preferir adicionar os registros diretamente (ou se seu provedor DNS não suportar CNAME em subdomínios), adicione estes registros SRV ao seu domínio:

| Tipo | Nome/Host           | Prioridade | Peso | Porta | Destino/Valor              | Propósito                              |
| :--: | ------------------- | :--------: | :--: | :---: | -------------------------- | ------------------------------------- |
|  SRV | `_imaps._tcp`       |     0      |  1   |  993  | `imap.forwardemail.net`    | IMAP sobre SSL/TLS (preferido)        |
|  SRV | `_imap._tcp`        |     0      |  0   |   0   | `.`                        | IMAP em texto simples desativado      |
|  SRV | `_submissions._tcp` |     0      |  1   |  465  | `smtp.forwardemail.net`    | Envio SMTP (SSL/TLS, recomendado)     |
|  SRV | `_submission._tcp`  |     5      |  1   |  587  | `smtp.forwardemail.net`    | Envio SMTP (STARTTLS)                  |
|  SRV | `_pop3s._tcp`       |    10      |  1   |  995  | `pop3.forwardemail.net`    | POP3 sobre SSL/TLS                     |
|  SRV | `_pop3._tcp`        |     0      |  0   |   0   | `.`                        | POP3 em texto simples desativado      |
|  SRV | `_caldavs._tcp`     |     0      |  1   |  443  | `caldav.forwardemail.net`  | CalDAV sobre TLS (calendários)         |
|  SRV | `_caldav._tcp`      |     0      |  0   |   0   | `.`                        | CalDAV em texto simples desativado    |
|  SRV | `_carddavs._tcp`    |     0      |  1   |  443  | `carddav.forwardemail.net` | CardDAV sobre TLS (contatos)           |
|  SRV | `_carddav._tcp`     |     0      |  0   |   0   | `.`                        | CardDAV em texto simples desativado   |
> \[!NOTE]
> IMAP tem um valor de prioridade menor (0) que POP3 (10), o que indica aos clientes de email para preferirem IMAP em vez de POP3 quando ambos estão disponíveis. Os registros com um destino de `.` (um único ponto) indicam que as versões em texto simples (não criptografadas) desses protocolos estão intencionalmente desativadas conforme [RFC 6186 Seção 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). Os registros SRV CalDAV e CardDAV seguem [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) para autodiscovery de calendário e contatos.

#### Quais clientes de email suportam autodiscovery? {#which-email-clients-support-autodiscovery}

| Cliente            | Email                                            | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | registros CNAME ou SRV `autoconfig`               | registros XML ou SRV `autoconfig` (RFC 6764) |
| Apple Mail (macOS) | registros SRV (RFC 6186)                          | registros SRV (RFC 6764)                     |
| Apple Mail (iOS)   | registros SRV (RFC 6186)                          | registros SRV (RFC 6764)                     |
| Microsoft Outlook  | CNAME `autodiscover` ou SRV `_autodiscover._tcp` | Não suportado                              |
| GNOME (Evolution)  | registros SRV (RFC 6186)                          | registros SRV (RFC 6764)                     |
| KDE (KMail)        | registros SRV (RFC 6186)                          | registros SRV (RFC 6764)                     |
| eM Client          | `autoconfig` ou `autodiscover`                    | registros SRV (RFC 6764)                     |

> \[!TIP]
> Para a melhor compatibilidade entre todos os clientes, recomendamos usar a **Opção A** (registros CNAME) combinada com os registros SRV da **Opção B**. A abordagem CNAME sozinha cobre a maioria dos clientes de email. Os registros SRV CalDAV/CardDAV garantem que clientes de calendário e contatos também possam descobrir automaticamente as configurações do seu servidor.


## Segurança {#security-1}

### Técnicas Avançadas de Fortalecimento de Servidor {#advanced-server-hardening-techniques}

> \[!TIP]
> Saiba mais sobre nossa infraestrutura de segurança em [nossa página de Segurança](/security).

Forward Email implementa inúmeras técnicas de fortalecimento de servidor para garantir a segurança da nossa infraestrutura e dos seus dados:

1. **Segurança de Rede**:
   * Firewall com regras rigorosas usando IP tables
   * Fail2ban para proteção contra força bruta
   * Auditorias regulares de segurança e testes de penetração
   * Acesso administrativo somente via VPN

2. **Fortalecimento do Sistema**:
   * Instalação mínima de pacotes
   * Atualizações regulares de segurança
   * SELinux em modo enforcing
   * Acesso root via SSH desabilitado
   * Autenticação somente por chave

3. **Segurança da Aplicação**:
   * Cabeçalhos Content Security Policy (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * Cabeçalhos de proteção contra XSS
   * Cabeçalhos de opções de frame e política de referenciador
   * Auditorias regulares de dependências

4. **Proteção de Dados**:
   * Criptografia completa do disco com LUKS
   * Gerenciamento seguro de chaves
   * Backups regulares com criptografia
   * Práticas de minimização de dados

5. **Monitoramento e Resposta**:
   * Detecção de intrusão em tempo real
   * Escaneamento automático de segurança
   * Registro e análise centralizados
   * Procedimentos de resposta a incidentes

> \[!IMPORTANT]
> Nossas práticas de segurança são continuamente atualizadas para enfrentar ameaças e vulnerabilidades emergentes.

> \[!TIP]
> Para máxima segurança, recomendamos usar nosso serviço com criptografia de ponta a ponta via OpenPGP.

### Vocês possuem certificações SOC 2 ou ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email opera em infraestrutura fornecida por subprocessadores certificados para garantir conformidade com os padrões da indústria.

Forward Email não possui diretamente certificações SOC 2 Tipo II ou ISO 27001. No entanto, o serviço opera em infraestrutura fornecida por subprocessadores certificados:

* **DigitalOcean**: certificado SOC 2 Tipo II e SOC 3 Tipo II (auditado pela Schellman & Company LLC), certificado ISO 27001 em múltiplos data centers. Detalhes: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: certificado SOC 2+ (HIPAA), certificações ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detalhes: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: compatível com SOC 2 (contate diretamente a DataPacket para obter a certificação), provedor de infraestrutura de nível empresarial (localização em Denver). Detalhes: <https://www.datapacket.com/datacenters/denver>

Forward Email segue as melhores práticas do setor para auditorias de segurança e se envolve regularmente com pesquisadores independentes de segurança. Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Você usa criptografia TLS para encaminhamento de e-mail {#do-you-use-tls-encryption-for-email-forwarding}

Sim. O Forward Email aplica rigorosamente TLS 1.2+ para todas as conexões (HTTPS, SMTP, IMAP, POP3) e implementa MTA-STS para suporte aprimorado ao TLS. A implementação inclui:

* Aplicação de TLS 1.2+ para todas as conexões de e-mail
* Troca de chaves ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) para segredo perfeito à frente
* Suites de cifra modernas com atualizações regulares de segurança
* Suporte a HTTP/2 para melhor desempenho e segurança
* HSTS (HTTP Strict Transport Security) com pré-carregamento nos principais navegadores
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** para aplicação rigorosa do TLS

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementação do MTA-STS**: O Forward Email implementa aplicação rigorosa do MTA-STS no código-fonte. Quando ocorrem erros TLS e o MTA-STS está aplicado, o sistema retorna códigos de status SMTP 421 para garantir que os e-mails sejam reenviados posteriormente em vez de serem entregues de forma insegura. Detalhes da implementação:

* Detecção de erro TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Aplicação do MTA-STS no helper send-email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validação por terceiros: <https://www.hardenize.com/report/forwardemail.net/1750312779> mostra classificações "Good" para todas as medidas de TLS e segurança de transporte.

### Você preserva os cabeçalhos de autenticação de e-mail {#do-you-preserve-email-authentication-headers}

Sim. O Forward Email implementa e preserva de forma abrangente os cabeçalhos de autenticação de e-mail:

* **SPF (Sender Policy Framework)**: Implementado e preservado corretamente
* **DKIM (DomainKeys Identified Mail)**: Suporte completo com gerenciamento adequado de chaves
* **DMARC**: Aplicação de política para e-mails que falham na validação SPF ou DKIM
* **ARC**: Embora não detalhado explicitamente, as pontuações perfeitas de conformidade do serviço sugerem um tratamento abrangente dos cabeçalhos de autenticação

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validação: O teste de e-mail do Internet.nl mostra pontuação 100/100 especificamente para a implementação de "SPF, DKIM e DMARC". A avaliação Hardenize confirma classificações "Good" para SPF e DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Você preserva os cabeçalhos originais do e-mail e previne falsificação {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> O Forward Email implementa proteção sofisticada contra falsificação para prevenir abuso de e-mail.

O Forward Email preserva os cabeçalhos originais do e-mail enquanto implementa proteção abrangente contra falsificação através do código-fonte MX:

* **Preservação de Cabeçalhos**: Os cabeçalhos originais de autenticação são mantidos durante o encaminhamento
* **Proteção contra Falsificação**: Aplicação da política DMARC impede falsificação de cabeçalhos rejeitando e-mails que falham na validação SPF ou DKIM
* **Prevenção de Injeção de Cabeçalhos**: Validação e sanitização de entrada usando a biblioteca striptags
* **Proteção Avançada**: Detecção sofisticada de phishing com detecção de falsificação, prevenção de personificação e sistemas de notificação ao usuário

**Detalhes da Implementação MX**: A lógica principal de processamento de e-mail é tratada pelo código do servidor MX, especificamente:

* Manipulador principal de dados MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtragem arbitrária de e-mails (anti-falsificação): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

O helper `isArbitrary` implementa regras sofisticadas anti-falsificação incluindo detecção de personificação de domínio, frases bloqueadas e vários padrões de phishing.
### Como você se protege contra spam e abuso {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementa uma proteção abrangente em múltiplas camadas:

* **Limitação de Taxa**: Aplicada a tentativas de autenticação, endpoints de API e conexões SMTP
* **Isolamento de Recursos**: Entre usuários para evitar impacto de usuários com alto volume
* **Proteção contra DDoS**: Proteção em múltiplas camadas através do sistema Shield da DataPacket e Cloudflare
* **Escalonamento Automático**: Ajuste dinâmico de recursos baseado na demanda
* **Prevenção de Abuso**: Verificações específicas para prevenção de abuso por usuário e bloqueio baseado em hash para conteúdo malicioso
* **Autenticação de Email**: Protocolos SPF, DKIM, DMARC com detecção avançada de phishing

Fontes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (detalhes da proteção contra DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Você armazena o conteúdo do email no disco {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email usa uma arquitetura de conhecimento zero que impede que o conteúdo do email seja gravado no disco.

* **Arquitetura de Conhecimento Zero**: Caixas de correio SQLite criptografadas individualmente significam que o Forward Email não pode acessar o conteúdo do email
* **Processamento em Memória**: O processamento do email ocorre inteiramente na memória, evitando armazenamento em disco
* **Sem Registro de Conteúdo**: "Nós não registramos nem armazenamos conteúdo ou metadados de email no disco"
* **Criptografia em Sandbox**: As chaves de criptografia nunca são armazenadas no disco em texto simples

**Evidência no Código MX**: O servidor MX processa emails inteiramente na memória sem gravar conteúdo no disco. O manipulador principal de processamento de email demonstra essa abordagem em memória: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fontes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Resumo)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detalhes sobre conhecimento zero)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Criptografia em sandbox)

### O conteúdo do email pode ser exposto durante falhas do sistema {#can-email-content-be-exposed-during-system-crashes}

Não. Forward Email implementa salvaguardas abrangentes contra exposição de dados relacionada a falhas:

* **Core Dumps Desativados**: Evita exposição de memória durante falhas
* **Memória Swap Desativada**: Completamente desativada para evitar extração de dados sensíveis de arquivos de swap
* **Arquitetura em Memória**: O conteúdo do email existe apenas na memória volátil durante o processamento
* **Proteção das Chaves de Criptografia**: As chaves nunca são armazenadas no disco em texto simples
* **Segurança Física**: Discos criptografados com LUKS v2 impedem acesso físico aos dados
* **Armazenamento USB Desativado**: Impede extração não autorizada de dados

**Tratamento de Erros para Problemas do Sistema**: Forward Email usa funções auxiliares `isCodeBug` e `isTimeoutError` para garantir que, se ocorrerem problemas de conectividade com banco de dados, problemas de rede/DNS/lista negra ou problemas de conectividade upstream, o sistema retorne códigos SMTP 421 para garantir que os emails sejam reenviados posteriormente em vez de serem perdidos ou expostos.

Detalhes da implementação:

* Classificação de erros: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Tratamento de erro de timeout no processamento MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Quem tem acesso à sua infraestrutura de email {#who-has-access-to-your-email-infrastructure}

Forward Email implementa controles de acesso abrangentes para sua equipe mínima de engenharia de 2-3 pessoas com requisitos rigorosos de 2FA:

* **Controle de Acesso Baseado em Função**: Para contas da equipe com permissões baseadas em recursos
* **Princípio do Menor Privilégio**: Aplicado em todos os sistemas
* **Segregação de Funções**: Entre papéis operacionais
* **Gerenciamento de Usuários**: Usuários separados para deploy e devops com permissões distintas
* **Login Root Desativado**: Obriga acesso através de contas devidamente autenticadas
* **2FA Rigoroso**: Sem 2FA via SMS devido ao risco de ataques MiTM - apenas tokens baseados em app ou hardware
* **Registro Abrangente de Auditoria**: Com redação de dados sensíveis
* **Detecção Automática de Anomalias**: Para padrões de acesso incomuns
* **Revisões Regulares de Segurança**: Dos logs de acesso
* **Prevenção contra Ataques Evil Maid**: Armazenamento USB desativado e outras medidas de segurança física
Fontes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Controles de Autorização)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Segurança de Rede)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Prevenção contra ataque evil maid)

### Quais provedores de infraestrutura você utiliza {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email utiliza múltiplos subprocessadores de infraestrutura com certificações abrangentes de conformidade.

Detalhes completos estão disponíveis em nossa página de conformidade com o GDPR: <https://forwardemail.net/gdpr>

**Principais Subprocessadores de Infraestrutura:**

| Provedor         | Certificado no Framework de Privacidade de Dados | Página de Conformidade com GDPR                                                        |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ Sim                                            | <https://www.cloudflare.com/trust-hub/gdpr/>                                          |
| **DataPacket**   | ❌ Não                                            | <https://www.datapacket.com/privacy-policy>                                           |
| **DigitalOcean** | ❌ Não                                            | <https://www.digitalocean.com/legal/gdpr>                                             |
| **GitHub**       | ✅ Sim                                            | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Não                                            | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                       |

**Certificações Detalhadas:**

**DigitalOcean**

* SOC 2 Tipo II & SOC 3 Tipo II (auditado pela Schellman & Company LLC)
* ISO 27001 certificado em múltiplos data centers
* Compatível com PCI-DSS
* Certificado CSA STAR Nível 1
* Certificado APEC CBPR PRP
* Detalhes: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Certificado SOC 2+ (HIPAA)
* Compatível com PCI Merchant
* Certificado CSA STAR Nível 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detalhes: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* Compatível com SOC 2 (contate diretamente a DataPacket para obter certificação)
* Infraestrutura de nível empresarial (localização em Denver)
* Proteção contra DDoS através da pilha de cibersegurança Shield
* Suporte técnico 24/7
* Rede global com 58 data centers
* Detalhes: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Certificado no Framework de Privacidade de Dados (EU-EUA, Suíça-EUA e Extensão do Reino Unido)
* Hospedagem de código-fonte, CI/CD e gerenciamento de projetos
* Acordo de Proteção de Dados do GitHub disponível
* Detalhes: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Processadores de Pagamento:**

* **Stripe**: Certificado no Framework de Privacidade de Dados - <https://stripe.com/legal/privacy-center>
* **PayPal**: Não certificado no DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Vocês oferecem um Acordo de Processamento de Dados (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Sim, o Forward Email oferece um Acordo de Processamento de Dados (DPA) abrangente que pode ser assinado junto com nosso contrato empresarial. Uma cópia do nosso DPA está disponível em: <https://forwardemail.net/dpa>

**Detalhes do DPA:**

* Cobre conformidade com GDPR e os frameworks EU-US/Swiss-US Privacy Shield
* Aceito automaticamente ao concordar com nossos Termos de Serviço
* Não requer assinatura separada para o DPA padrão
* Arranjos personalizados de DPA disponíveis através da Licença Empresarial

**Framework de Conformidade com GDPR:**
Nosso DPA detalha a conformidade com o GDPR, bem como os requisitos internacionais para transferência de dados. Informações completas estão disponíveis em: <https://forwardemail.net/gdpr>

Para clientes empresariais que necessitam de termos personalizados no DPA ou acordos contratuais específicos, estes podem ser tratados através do nosso programa **Licença Empresarial (US$250/mês)**.

### Como vocês lidam com notificações de violação de dados {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> A arquitetura zero-knowledge do Forward Email limita significativamente o impacto de violações.
* **Exposição Limitada de Dados**: Não pode acessar o conteúdo de e-mails criptografados devido à arquitetura de conhecimento zero
* **Coleta Mínima de Dados**: Apenas informações básicas do assinante e registros limitados de IP para segurança
* **Estruturas de Subprocessadores**: DigitalOcean, GitHub e Vultr mantêm procedimentos de resposta a incidentes em conformidade com o GDPR

**Informações do Representante GDPR:**
Forward Email nomeou representantes GDPR em conformidade com o Artigo 27:

**Representante da UE:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Representante do Reino Unido:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Para clientes empresariais que exigem SLAs específicos de notificação de violação, estes devem ser discutidos como parte de um acordo de **Licença Empresarial**.

Fontes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Você oferece um ambiente de teste {#do-you-offer-a-test-environment}

A documentação técnica do Forward Email não descreve explicitamente um modo sandbox dedicado. No entanto, abordagens potenciais para testes incluem:

* **Opção de Auto-Hospedagem**: Capacidades abrangentes de auto-hospedagem para criação de ambientes de teste
* **Interface API**: Potencial para testes programáticos de configurações
* **Código Aberto**: Código 100% open-source permite que clientes examinem a lógica de encaminhamento
* **Múltiplos Domínios**: Suporte para múltiplos domínios pode possibilitar a criação de domínios de teste

Para clientes empresariais que exigem capacidades formais de sandbox, isso deve ser discutido como parte de um acordo de **Licença Empresarial**.

Fonte: <https://github.com/forwardemail/forwardemail.net> (Detalhes do ambiente de desenvolvimento)

### Você fornece ferramentas de monitoramento e alerta {#do-you-provide-monitoring-and-alerting-tools}

Forward Email oferece monitoramento em tempo real com algumas limitações:

**Disponível:**

* **Monitoramento de Entrega em Tempo Real**: Métricas de desempenho visíveis publicamente para os principais provedores de e-mail
* **Alertas Automáticos**: Equipe de engenharia alertada quando os tempos de entrega excedem 10 segundos
* **Monitoramento Transparente**: Sistemas de monitoramento 100% open-source
* **Monitoramento de Infraestrutura**: Detecção automática de anomalias e registro abrangente de auditoria

**Limitações:**

* Webhooks voltados para clientes ou notificações de status de entrega baseadas em API não são explicitamente documentados

Para clientes empresariais que exigem webhooks detalhados de status de entrega ou integrações personalizadas de monitoramento, essas capacidades podem estar disponíveis através de acordos de **Licença Empresarial**.

Fontes:

* <https://forwardemail.net> (Exibição de monitoramento em tempo real)
* <https://github.com/forwardemail/forwardemail.net> (Implementação do monitoramento)

### Como você garante alta disponibilidade {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implementa redundância abrangente através de múltiplos provedores de infraestrutura.

* **Infraestrutura Distribuída**: Múltiplos provedores (DigitalOcean, Vultr, DataPacket) em regiões geográficas
* **Balanceamento de Carga Geográfico**: Balanceamento de carga geolocalizado baseado em Cloudflare com failover automático
* **Escalonamento Automático**: Ajuste dinâmico de recursos baseado na demanda
* **Proteção DDoS em Múltiplas Camadas**: Através do sistema Shield da DataPacket e Cloudflare
* **Redundância de Servidores**: Múltiplos servidores por região com failover automático
* **Replicação de Banco de Dados**: Sincronização de dados em tempo real entre múltiplas localidades
* **Monitoramento e Alertas**: Monitoramento 24/7 com resposta automática a incidentes

**Compromisso de Uptime**: Disponibilidade do serviço superior a 99,9% com monitoramento transparente disponível em <https://forwardemail.net>

Fontes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Você está em conformidade com a Seção 889 do National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email está totalmente em conformidade com a Seção 889 através da seleção cuidadosa de parceiros de infraestrutura.

Sim, o Forward Email está **em conformidade com a Seção 889**. A Seção 889 do National Defense Authorization Act (NDAA) proíbe agências governamentais de usar ou contratar entidades que utilizem equipamentos de telecomunicações e vigilância por vídeo de empresas específicas (Huawei, ZTE, Hikvision, Dahua e Hytera).
**Como o Forward Email Alcança a Conformidade com a Seção 889:**

O Forward Email depende exclusivamente de dois provedores principais de infraestrutura, nenhum dos quais utiliza equipamentos proibidos pela Seção 889:

1. **Cloudflare**: Nosso parceiro principal para serviços de rede e segurança de e-mail
2. **DataPacket**: Nosso provedor principal para infraestrutura de servidores (utilizando exclusivamente equipamentos da Arista Networks e Cisco)
3. **Provedores de Backup**: Nossos provedores de backup Digital Ocean e Vultr são adicionalmente confirmados por escrito como estando em conformidade com a Seção 889.

**Compromisso da Cloudflare**: A Cloudflare declara explicitamente em seu Código de Conduta para Terceiros que não utiliza equipamentos de telecomunicações, produtos de vigilância por vídeo ou serviços de quaisquer entidades proibidas pela Seção 889.

**Caso de Uso Governamental**: Nossa conformidade com a Seção 889 foi validada quando a **US Naval Academy** selecionou o Forward Email para suas necessidades de encaminhamento seguro de e-mails, exigindo documentação de nossos padrões de conformidade federal.

Para detalhes completos sobre nossa estrutura de conformidade governamental, incluindo regulamentações federais mais amplas, leia nosso estudo de caso abrangente: [Serviço de Email do Governo Federal em Conformidade com a Seção 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Detalhes do Sistema e Técnicos {#system-and-technical-details}

### Vocês armazenam e-mails e seus conteúdos {#do-you-store-emails-and-their-contents}

Não, não gravamos em disco nem armazenamos logs – com a [exceção de erros](#do-you-store-error-logs) e [SMTP de saída](#do-you-support-sending-email-with-smtp) (veja nossa [Política de Privacidade](/privacy)).

Tudo é feito em memória e [nosso código-fonte está no GitHub](https://github.com/forwardemail).

### Como funciona o seu sistema de encaminhamento de e-mails {#how-does-your-email-forwarding-system-work}

O e-mail depende do [protocolo SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Este protocolo consiste em comandos enviados a um servidor (geralmente rodando na porta 25). Há uma conexão inicial, depois o remetente indica de quem é o e-mail ("MAIL FROM"), seguido para quem ele está sendo enviado ("RCPT TO"), e finalmente os cabeçalhos e o corpo do e-mail em si ("DATA"). O fluxo do nosso sistema de encaminhamento de e-mails é descrito em relação a cada comando do protocolo SMTP abaixo:

* Conexão Inicial (sem nome de comando, ex. `telnet example.com 25`) - Esta é a conexão inicial. Verificamos remetentes que não estão em nossa [lista de permissões](#do-you-have-an-allowlist) contra nossa [lista de bloqueios](#do-you-have-a-denylist). Finalmente, se um remetente não estiver na lista de permissões, verificamos se ele foi [colocado em lista cinza](#do-you-have-a-greylist).

* `HELO` - Indica uma saudação para identificar o FQDN do remetente, endereço IP ou nome do manipulador de e-mail. Este valor pode ser falsificado, então não confiamos nesses dados e usamos a busca reversa do nome do host do endereço IP da conexão.

* `MAIL FROM` - Indica o endereço do remetente do envelope do e-mail. Se um valor for inserido, deve ser um endereço de e-mail válido conforme RFC 5322. Valores vazios são permitidos. Aqui [verificamos backscatter](#how-do-you-protect-against-backscatter) e também verificamos o MAIL FROM contra nossa [lista de bloqueios](#do-you-have-a-denylist). Finalmente, verificamos remetentes que não estão na lista de permissões para limitação de taxa (veja a seção sobre [Limitação de Taxa](#do-you-have-rate-limiting) e [lista de permissões](#do-you-have-an-allowlist) para mais informações).

* `RCPT TO` - Indica o(s) destinatário(s) do e-mail. Devem ser endereços de e-mail válidos conforme RFC 5322. Permitimos até 50 destinatários no envelope por mensagem (isso é diferente do cabeçalho "Para" de um e-mail). Também verificamos um endereço válido do [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") aqui para proteger contra falsificação com nosso nome de domínio SRS.

* `DATA` - Esta é a parte central do nosso serviço que processa um e-mail. Veja a seção [Como vocês processam um e-mail para encaminhamento](#how-do-you-process-an-email-for-forwarding) abaixo para mais detalhes.
### Como você processa um email para encaminhamento {#how-do-you-process-an-email-for-forwarding}

Esta seção descreve nosso processo relacionado ao comando do protocolo SMTP `DATA` na seção [Como funciona seu sistema de encaminhamento de email](#how-does-your-email-forwarding-system-work) acima – é como processamos os cabeçalhos, corpo, segurança do email, determinamos para onde ele precisa ser entregue e como lidamos com as conexões.

1. Se a mensagem exceder o tamanho máximo de 50mb, ela será rejeitada com um código de erro 552.

2. Se a mensagem não contiver um cabeçalho "From", ou se algum dos valores no cabeçalho "From" não for um endereço de email válido conforme RFC 5322, ela será rejeitada com um código de erro 550.

3. Se a mensagem tiver mais de 25 cabeçalhos "Received", será determinado que ela ficou presa em um loop de redirecionamento, e será rejeitada com um código de erro 550.

4. Usando a impressão digital do email (veja a seção sobre [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), verificaremos se a mensagem foi tentada ser reenviada por mais de 5 dias (o que corresponde ao [comportamento padrão do postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), e se for o caso, ela será rejeitada com um código de erro 550.

5. Armazenamos em memória os resultados da varredura do email usando o [Spam Scanner](https://spamscanner.net).

6. Se houver quaisquer resultados arbitrários do Spam Scanner, a mensagem será rejeitada com um código de erro 554. Resultados arbitrários incluem apenas o teste GTUBE no momento desta escrita. Veja <https://spamassassin.apache.org/gtube/> para mais informações.

7. Adicionaremos os seguintes cabeçalhos à mensagem para fins de depuração e prevenção de abuso:

   * `Received` - adicionamos este cabeçalho padrão Received com IP e host de origem, tipo de transmissão, informações da conexão TLS, data/hora e destinatário.
   * `X-Original-To` - o destinatário original da mensagem:
     * Isso é útil para determinar onde um email foi originalmente entregue (além do cabeçalho "Received").
     * É adicionado por destinatário no momento do encaminhamento IMAP e/ou mascarado (para proteger a privacidade).
   * `X-Forward-Email-Website` - contém um link para nosso site <https://forwardemail.net>
   * `X-Forward-Email-Version` - a versão atual [SemVer](https://semver.org/) do `package.json` da nossa base de código.
   * `X-Forward-Email-Session-ID` - um valor de ID de sessão usado para fins de depuração (aplica-se apenas em ambientes não produtivos).
   * `X-Forward-Email-Sender` - uma lista separada por vírgulas contendo o endereço original MAIL FROM do envelope (se não estiver em branco), o FQDN PTR reverso do cliente (se existir) e o endereço IP do remetente.
   * `X-Forward-Email-ID` - aplicável apenas para SMTP de saída e correlaciona-se ao ID do email armazenado em Minha Conta → Emails
   * `X-Report-Abuse` - com o valor `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - com o valor `abuse@forwardemail.net`.
   * `X-Complaints-To` - com o valor `abuse@forwardemail.net`.

8. Em seguida, verificamos a mensagem para [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) e [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Se a mensagem falhar no DMARC e o domínio tiver uma política de rejeição (ex.: `p=reject` [estava na política DMARC](https://wikipedia.org/wiki/DMARC)), ela será rejeitada com um código de erro 550. Normalmente, a política DMARC de um domínio pode ser encontrada no registro <strong class="notranslate">TXT</strong> do subdomínio `_dmarc` (ex.: `dig _dmarc.example.com txt`).
   * Se a mensagem falhar no SPF e o domínio tiver uma política de falha rígida (ex.: `-all` estava na política SPF em vez de `~all` ou nenhuma política), ela será rejeitada com um código de erro 550. Normalmente, a política SPF de um domínio pode ser encontrada no registro <strong class="notranslate">TXT</strong> do domínio raiz (ex.: `dig example.com txt`). Veja esta seção para mais informações sobre [enviar email como no Gmail](#can-i-send-mail-as-in-gmail-with-this) referente ao SPF.
9. Agora processamos os destinatários da mensagem conforme coletados a partir do comando `RCPT TO` na seção [Como funciona o seu sistema de encaminhamento de email](#how-does-your-email-forwarding-system-work) acima. Para cada destinatário, realizamos as seguintes operações:

   * Consultamos os registros <strong class="notranslate">TXT</strong> do nome de domínio (a parte após o símbolo `@`, por exemplo, `example.com` se o endereço de email for `test@example.com`). Por exemplo, se o domínio for `example.com`, fazemos uma consulta DNS como `dig example.com txt`.
   * Analisamos todos os registros <strong class="notranslate">TXT</strong> que começam com `forward-email=` (planos gratuitos) ou `forward-email-site-verification=` (planos pagos). Note que analisamos ambos, para processar emails enquanto um usuário está atualizando ou rebaixando planos.
   * A partir desses registros <strong class="notranslate">TXT</strong> analisados, iteramos sobre eles para extrair a configuração de encaminhamento (conforme descrito na seção [Como começar e configurar o encaminhamento de email](#how-do-i-get-started-and-set-up-email-forwarding) acima). Note que suportamos apenas um valor `forward-email-site-verification=`, e se mais de um for fornecido, ocorrerá um erro 550 e o remetente receberá um bounce para esse destinatário.
   * Recursivamente iteramos sobre a configuração de encaminhamento extraída para determinar o encaminhamento global, encaminhamento baseado em regex e todas as outras configurações de encaminhamento suportadas – que agora são conhecidas como nossos "Endereços de Encaminhamento".
   * Para cada Endereço de Encaminhamento, suportamos uma consulta recursiva (que iniciará esta série de operações novamente para o endereço dado). Se uma correspondência recursiva for encontrada, o resultado pai será removido dos Endereços de Encaminhamento, e os filhos adicionados.
   * Os Endereços de Encaminhamento são analisados para garantir unicidade (pois não queremos enviar duplicatas para um endereço ou gerar conexões SMTP adicionais desnecessárias).
   * Para cada Endereço de Encaminhamento, consultamos seu nome de domínio em nosso endpoint de API `/v1/max-forwarded-addresses` (para determinar quantos endereços o domínio está autorizado a encaminhar email por alias, por exemplo, 10 por padrão – veja a seção sobre [limite máximo de encaminhamento por alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Se esse limite for excedido, ocorrerá um erro 550 e o remetente receberá um bounce para esse destinatário.
   * Consultamos as configurações do destinatário original em nosso endpoint de API `/v1/settings`, que suporta uma consulta para usuários pagos (com fallback para usuários gratuitos). Isso retorna um objeto de configuração para configurações avançadas de `port` (Número, por exemplo, `25`), `has_adult_content_protection` (Booleano), `has_phishing_protection` (Booleano), `has_executable_protection` (Booleano) e `has_virus_protection` (Booleano).
   * Com base nessas configurações, verificamos os resultados do Scanner de Spam e, se ocorrerem erros, a mensagem é rejeitada com o código de erro 554 (por exemplo, se `has_virus_protection` estiver habilitado, verificaremos os resultados do Scanner de Spam para vírus). Note que todos os usuários do plano gratuito estarão optados para verificações contra conteúdo adulto, phishing, executáveis e vírus. Por padrão, todos os usuários do plano pago também estão optados, mas essa configuração pode ser alterada na página de Configurações para um domínio no painel do Forward Email).

10. Para cada Endereço de Encaminhamento processado do destinatário, realizamos as seguintes operações:

    * O endereço é verificado contra nossa [lista de negação](#do-you-have-a-denylist), e se estiver listado, ocorrerá um código de erro 421 (indica ao remetente para tentar novamente mais tarde).
    * Se o endereço for um webhook, definimos um Booleano para operações futuras (veja abaixo – agrupamos webhooks semelhantes para fazer uma única requisição POST em vez de múltiplas para entrega).
    * Se o endereço for um endereço de email, analisamos o host para operações futuras (veja abaixo – agrupamos hosts semelhantes para fazer uma conexão única em vez de múltiplas conexões individuais para entrega).
11. Se não houver destinatários e não houver rejeições, então respondemos com um erro 550 de "Destinatários inválidos".

12. Se houver destinatários, então iteramos sobre eles (agrupados pelo mesmo host) e entregamos os e-mails. Veja a seção [Como você lida com problemas de entrega de e-mail](#how-do-you-handle-email-delivery-issues) abaixo para mais detalhes.

    * Se ocorrerem erros ao enviar os e-mails, então os armazenaremos na memória para processamento posterior.
    * Usaremos o código de erro mais baixo (se houver) do envio dos e-mails – e usaremos esse código como resposta ao comando `DATA`. Isso significa que e-mails não entregues normalmente serão reenviados pelo remetente original, enquanto e-mails que já foram entregues não serão reenviados na próxima vez que a mensagem for enviada (pois usamos [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Se não ocorrerem erros, então enviaremos um código de status SMTP 250 de sucesso.
    * Uma rejeição é determinada como qualquer tentativa de entrega que resulte em um código de status >= 500 (falhas permanentes).

13. Se não ocorreram rejeições (falhas permanentes), então retornaremos um código de status SMTP do menor código de erro de falhas não permanentes (ou um código 250 de sucesso se não houver nenhum).

14. Se ocorreram rejeições, então enviaremos e-mails de rejeição em segundo plano após retornar o menor de todos os códigos de erro para o remetente. No entanto, se o menor código de erro for >= 500, então não enviaremos nenhum e-mail de rejeição. Isso porque, se o fizéssemos, os remetentes receberiam um e-mail de rejeição duplo (por exemplo, um do seu MTA de saída, como Gmail – e também um nosso). Veja a seção sobre [Como você protege contra backscatter](#how-do-you-protect-against-backscatter) abaixo para mais detalhes.

### Como você lida com problemas de entrega de e-mail {#how-do-you-handle-email-delivery-issues}

Observe que faremos uma reescrita "Friendly-From" nos e-mails se e somente se a política DMARC do remetente não estiver passando E nenhuma assinatura DKIM estiver alinhada com o cabeçalho "From". Isso significa que alteraremos o cabeçalho "From" na mensagem, definiremos "X-Original-From" e também definiremos um "Reply-To" se ele ainda não estiver definido. Também re-selaremos o selo ARC na mensagem após alterar esses cabeçalhos.

Também usamos análise inteligente das mensagens de erro em todos os níveis da nossa pilha – em nosso código, requisições DNS, internos do Node.js, requisições HTTP (por exemplo, 408, 413 e 429 são mapeados para o código de resposta SMTP 421 se o destinatário for um webhook) e respostas do servidor de e-mail (por exemplo, respostas com "defer" ou "slowdown" seriam re-tentadas como erros 421).

Nossa lógica é à prova de falhas e também tentará novamente para erros SSL/TLS, problemas de conexão e mais. O objetivo da prova de falhas é maximizar a entregabilidade para todos os destinatários em uma configuração de encaminhamento.

Se o destinatário for um webhook, então permitiremos um tempo limite de 60 segundos para a requisição ser concluída com até 3 tentativas (totalizando 4 requisições antes de uma falha). Observe que analisamos corretamente os códigos de erro 408, 413 e 429 e os mapeamos para um código de resposta SMTP 421.

Caso contrário, se o destinatário for um endereço de e-mail, tentaremos enviar o e-mail com TLS oportunista (tentamos usar STARTTLS se estiver disponível no servidor de e-mail do destinatário). Se ocorrer um erro SSL/TLS ao tentar enviar o e-mail, tentaremos enviar o e-mail sem TLS (sem usar STARTTLS).

Se ocorrerem erros de DNS ou de conexão, retornaremos ao comando `DATA` um código de resposta SMTP 421, caso contrário, se houver erros de nível >= 500, serão enviadas rejeições.

Se detectarmos que um servidor de e-mail para o qual estamos tentando entregar bloqueou um ou mais dos nossos endereços IP de troca de e-mail (por exemplo, pela tecnologia que usam para adiar spammers), enviaremos um código de resposta SMTP 421 para que o remetente tente reenviar a mensagem mais tarde (e seremos alertados sobre o problema para que possamos tentar resolvê-lo antes da próxima tentativa).

### Como você lida com seus endereços IP sendo bloqueados {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Monitoramos rotineiramente todas as principais listas de negação DNS e, se algum dos nossos endereços IP de troca de correio ("MX") estiver listado em uma lista de negação importante, retiraremos ele do registro DNS A relevante de round robin, se possível, até que o problema seja resolvido.

No momento em que este texto foi escrito, também estamos listados em várias listas de permissão DNS, e levamos a sério o monitoramento das listas de negação. Se você notar algum problema antes que tenhamos a chance de resolvê-lo, por favor, nos notifique por escrito em <support@forwardemail.net>.

Nossos endereços IP são publicamente disponíveis, [veja esta seção abaixo para mais informações](#what-are-your-servers-ip-addresses).

### O que são endereços postmaster {#what-are-postmaster-addresses}

Para evitar devoluções mal direcionadas e o envio de mensagens de resposta automática para caixas de correio não monitoradas ou inexistentes, mantemos uma lista de nomes de usuário semelhantes a mailer-daemon:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [e qualquer endereço no-reply](#what-are-no-reply-addresses)

Veja [RFC 5320 Seção 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) para mais informações sobre como listas como essas são usadas para criar sistemas de email eficientes.

### O que são endereços no-reply {#what-are-no-reply-addresses}

Nomes de usuário de email iguais a qualquer um dos seguintes (insensível a maiúsculas/minúsculas) são considerados endereços no-reply:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

Esta lista é mantida [como um projeto open-source no GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Quais são os endereços IP do seu servidor {#what-are-your-servers-ip-addresses}

Publicamos nossos endereços IP em <https://forwardemail.net/ips>.

### Vocês têm uma lista de permissão {#do-you-have-an-allowlist}

Sim, temos uma [lista de extensões de nomes de domínio](#what-domain-name-extensions-are-allowlisted-by-default) que são permitidas por padrão e uma lista de permissão dinâmica, em cache e rotativa baseada em [critérios rigorosos](#what-is-your-allowlist-criteria).

Todos os domínios, emails e endereços IP usados por clientes pagantes são automaticamente verificados contra nossa lista de negação a cada hora – o que alerta os administradores que podem intervir manualmente se necessário.

Além disso, se um dos seus domínios ou seus endereços de email estiverem em lista de negação (por exemplo, por envio de spam, vírus ou devido a ataques de personificação) – então os administradores do domínio (você) e os administradores da nossa equipe serão notificados por email imediatamente. Recomendamos fortemente que você [configure DMARC](#how-do-i-set-up-dmarc-for-forward-email) para evitar isso.

### Quais extensões de nomes de domínio são permitidas por padrão {#what-domain-name-extensions-are-allowlisted-by-default}

As seguintes extensões de nomes de domínio são consideradas permitidas por padrão (independentemente de estarem ou não na Umbrella Popularity List):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
  <li class="list-inline-item"><code class="notranslate">dni.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fed.us</code></li>
  <li class="list-inline-item"><code class="notranslate">isa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">kids.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ak.us</code></li>
  <li class="list-inline-item"><code class="notranslate">al.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ar.us</code></li>
  <li class="list-inline-item"><code class="notranslate">as.us</code></li>
  <li class="list-inline-item"><code class="notranslate">az.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ca.us</code></li>
  <li class="list-inline-item"><code class="notranslate">co.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ct.us</code></li>
  <li class="list-inline-item"><code class="notranslate">dc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">de.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fl.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ga.us</code></li>
  <li class="list-inline-item"><code class="notranslate">gu.us</code></li>
  <li class="list-inline-item"><code class="notranslate">hi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ia.us</code></li>
  <li class="list-inline-item"><code class="notranslate">id.us</code></li>
  <li class="list-inline-item"><code class="notranslate">il.us</code></li>
  <li class="list-inline-item"><code class="notranslate">in.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ks.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ky.us</code></li>
  <li class="list-inline-item"><code class="notranslate">la.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ma.us</code></li>
  <li class="list-inline-item"><code class="notranslate">md.us</code></li>
  <li class="list-inline-item"><code class="notranslate">me.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mo.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ne.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nj.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nm.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ny.us</code></li>
  <li class="list-inline-item"><code class="notranslate">oh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ok.us</code></li>
  <li class="list-inline-item"><code class="notranslate">or.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pr.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ri.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.au</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.at</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.br</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">school.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">health.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.in</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.in</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">es.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.es</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.th</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.th</code></li>
  <li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
  <li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">go.id</code></li>
  <li class="list-inline-item"><code class="notranslate">go.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">go.ke</code></li>
  <li class="list-inline-item"><code class="notranslate">go.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">go.th</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.es</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.af</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.al</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.am</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.au</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.az</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.be</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gov.by</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.co</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.il</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.im</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.in</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.it</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.je</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.my</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.np</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.py</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.se</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.si</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.za</code></li>
  <li class="list-inline-item"><code class="notranslate">government.pn</code></li>
  <li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gv.at</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">police.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>
Além disso, esses [domínios de topo de marca e corporativos](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) são permitidos por padrão (por exemplo, `apple` para `applecard.apple` para extratos bancários do Apple Card):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
A partir de 18 de março de 2025, também adicionamos estes territórios ultramarinos franceses a esta lista ([conforme esta solicitação no GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

A partir de 8 de julho de 2025, adicionamos estes países específicos da Europa:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

Em outubro de 2025, também adicionamos <code class="notranslate">cz</code> (República Tcheca) devido à demanda.

Especificamente, não incluímos `ru` e `ua` devido à alta atividade de spam.

### Qual é o seu critério para a lista de permissões {#what-is-your-allowlist-criteria}

Temos uma lista estática de [extensões de nomes de domínio permitidas por padrão](#what-domain-name-extensions-are-allowlisted-by-default) – e também mantemos uma lista dinâmica, em cache, rolante, baseada nos seguintes critérios rigorosos:

* O domínio raiz do remetente deve ser de uma [extensão de nome de domínio que corresponda à lista que oferecemos em nosso plano gratuito](#what-domain-name-extensions-can-be-used-for-free) (com a adição de `biz` e `info`). Também incluímos correspondências parciais de `edu`, `gov` e `mil`, como `xyz.gov.au` e `xyz.edu.au`.
* O domínio raiz do remetente deve estar entre os 100.000 principais resultados únicos de domínios raiz analisados da [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* O domínio raiz do remetente deve estar entre os 50.000 principais resultados de domínios raiz únicos que aparecem em pelo menos 4 dos últimos 7 dias da UPL (~50%+).
* O domínio raiz do remetente não deve ser [classificado](https://radar.cloudflare.com/categorization-feedback/) como conteúdo adulto ou malware pela Cloudflare.
* O domínio raiz do remetente deve ter registros A ou MX configurados.
* O domínio raiz do remetente deve ter registros A, registros MX, registro DMARC com `p=reject` ou `p=quarantine`, ou um registro SPF com qualificador `-all` ou `~all`.

Se este critério for satisfeito, o domínio raiz do remetente será armazenado em cache por 7 dias. Note que nosso trabalho automatizado é executado diariamente – portanto, esta é uma lista de permissões rolante em cache que é atualizada diariamente.

Nosso trabalho automatizado fará o download dos últimos 7 dias de UPLs na memória, descompactará e então analisará na memória de acordo com os critérios rigorosos acima.

Domínios populares na época desta redação, como Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify e outros – estão, claro, incluídos.
Se você for um remetente que não está em nossa lista de permissões, então na primeira vez que seu domínio raiz FQDN ou endereço IP enviar um e-mail, você será [limitado por taxa](#do-you-have-rate-limiting) e [colocado na lista cinza](#do-you-have-a-greylist). Note que esta é uma prática padrão adotada como um padrão de e-mail. A maioria dos clientes de servidores de e-mail tentará reenviar se receberem um erro de limite de taxa ou lista cinza (por exemplo, um código de status de erro 421 ou nível 4xx).

**Observe que remetentes específicos como `a@gmail.com`, `b@xyz.edu` e `c@gov.au` ainda podem ser [negados](#do-you-have-a-denylist)** (por exemplo, se detectarmos automaticamente spam, phishing ou malware desses remetentes).

### Quais extensões de nome de domínio podem ser usadas gratuitamente {#what-domain-name-extensions-can-be-used-for-free}

A partir de 31 de março de 2023, aplicamos uma nova regra geral de spam para proteger nossos usuários e serviço.

Esta nova regra permite apenas as seguintes extensões de nome de domínio para serem usadas em nosso plano gratuito:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### Você tem uma greylist {#do-you-have-a-greylist}

Sim, usamos uma política de [greylisting de email](https://en.wikipedia.org/wiki/Greylisting_\(email\)) muito flexível. O greylisting só se aplica a remetentes que não estão na nossa allowlist e permanece em nosso cache por 30 dias.

Para qualquer remetente novo, armazenamos uma chave em nosso banco de dados Redis por 30 dias com um valor definido como o horário inicial de chegada da sua primeira solicitação. Em seguida, rejeitamos o email com um código de status de retry 450 e só permitimos a passagem após 5 minutos terem se passado.

Se eles esperarem com sucesso por 5 minutos a partir desse horário inicial de chegada, então seus emails serão aceitos e eles não receberão mais esse código de status 450.

A chave consiste no domínio raiz FQDN ou no endereço IP do remetente. Isso significa que qualquer subdomínio que passar pela greylist também passará para o domínio raiz, e vice-versa (é isso que queremos dizer com uma política "muito flexível").

Por exemplo, se um email vier de `test.example.com` antes de vermos um email vindo de `example.com`, então qualquer email de `test.example.com` e/ou `example.com` terá que esperar 5 minutos a partir do horário inicial de chegada da conexão. Não fazemos com que tanto `test.example.com` quanto `example.com` esperem seus próprios períodos de 5 minutos (nossa política de greylisting se aplica no nível do domínio raiz).

Note que o greylisting não se aplica a nenhum remetente em nossa [allowlist](#do-you-have-an-allowlist) (por exemplo, Meta, Amazon, Netflix, Google, Microsoft no momento desta escrita).

### Você tem uma denylist {#do-you-have-a-denylist}

Sim, operamos nossa própria denylist e a atualizamos automaticamente em tempo real e manualmente com base em spam e atividade maliciosa detectada.

Também puxamos todos os endereços IP da denylist UCEPROTECT Nível 1 em <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> a cada hora e os inserimos em nossa denylist com expiração de 7 dias.

Remetentes encontrados na denylist receberão um código de erro 421 (indica ao remetente para tentar novamente mais tarde) se [não estiverem na allowlist](#do-you-have-an-allowlist).

Ao usar um código de status 421 em vez de 554, potenciais falsos positivos podem ser aliviados em tempo real e a mensagem pode ser entregue com sucesso na próxima tentativa.

**Isso é diferente de outros serviços de email**, onde se você for colocado em uma blocklist, ocorre uma falha permanente e definitiva. Muitas vezes é difícil pedir para remetentes tentarem reenviar mensagens (especialmente de grandes organizações), e portanto essa abordagem dá cerca de 5 dias a partir da tentativa inicial de email para que o remetente, destinatário ou nós possamos intervir e resolver o problema (solicitando a remoção da denylist).

Todas as solicitações de remoção da denylist são monitoradas em tempo real por administradores (por exemplo, para que falsos positivos recorrentes possam ser permanentemente adicionados à allowlist pelos administradores).

Solicitações de remoção da denylist podem ser feitas em <https://forwardemail.net/denylist>. Usuários pagos têm suas solicitações de remoção processadas instantaneamente, enquanto usuários não pagos devem aguardar os administradores processarem sua solicitação.

Remetentes detectados enviando spam ou conteúdo de vírus serão adicionados à denylist da seguinte forma:

1. A [impressão digital inicial da mensagem](#how-do-you-determine-an-email-fingerprint) é greylistada ao detectar spam ou blocklist de um remetente "confiável" (por exemplo, `gmail.com`, `microsoft.com`, `apple.com`).
   * Se o remetente estava na allowlist, a mensagem é greylistada por 1 hora.
   * Se o remetente não está na allowlist, a mensagem é greylistada por 6 horas.
2. Extraímos chaves para a denylist a partir das informações do remetente e da mensagem, e para cada uma dessas chaves criamos (se ainda não existir) um contador, incrementamos em 1 e armazenamos em cache por 24 horas.
   * Para remetentes na allowlist:
     * Adicionamos uma chave para o endereço de email do envelope "MAIL FROM" se ele passou SPF ou não tiver SPF, e não for [um nome de usuário postmaster](#what-are-postmaster-addresses) ou [um nome de usuário no-reply](#what-are-no-reply-addresses).
     * Se o cabeçalho "From" estava na allowlist, então adicionamos uma chave para o endereço de email do cabeçalho "From" se ele passou SPF ou passou e alinhou DKIM.
     * Se o cabeçalho "From" não estava na allowlist, então adicionamos uma chave para o endereço de email do cabeçalho "From" e seu domínio raiz analisado.
   * Para remetentes não na allowlist:
     * Adicionamos uma chave para o endereço de email do envelope "MAIL FROM" se ele passou SPF.
     * Se o cabeçalho "From" estava na allowlist, então adicionamos uma chave para o endereço de email do cabeçalho "From" se ele passou SPF ou passou e alinhou DKIM.
     * Se o cabeçalho "From" não estava na allowlist, então adicionamos uma chave para o endereço de email do cabeçalho "From" e seu domínio raiz analisado.
     * Adicionamos uma chave para o endereço IP remoto do remetente.
     * Adicionamos uma chave para o hostname resolvido do cliente por lookup reverso do endereço IP do remetente (se houver).
     * Adicionamos uma chave para o domínio raiz do hostname resolvido do cliente (se houver, e se for diferente do hostname resolvido do cliente).
3. Se o contador atingir 5 para um remetente e chave não na allowlist, então adicionamos a chave à denylist por 30 dias e um email é enviado para nossa equipe de abuso. Esses números podem mudar e atualizações serão refletidas aqui conforme monitoramos abusos.
4. Se o contador atingir 10 para um remetente e chave na allowlist, então adicionamos a chave à denylist por 7 dias e um email é enviado para nossa equipe de abuso. Esses números podem mudar e atualizações serão refletidas aqui conforme monitoramos abusos.
> **NOTA:** Em um futuro próximo, introduziremos monitoramento de reputação. O monitoramento de reputação calculará quando negar a lista de um remetente com base em um limite percentual (em vez de um contador rudimentar como mencionado acima).

### Você tem limitação de taxa {#do-you-have-rate-limiting}

A limitação de taxa do remetente é feita pelo domínio raiz extraído de uma pesquisa PTR reversa no endereço IP do remetente – ou, se isso não resultar em nada, então simplesmente usa o endereço IP do remetente. Note que nos referimos a isso como `Sender` abaixo.

Nossos servidores MX têm limites diários para o correio recebido para [armazenamento IMAP criptografado](/blog/docs/best-quantum-safe-encrypted-email-service):

* Em vez de limitar a taxa do correio recebido em uma base individual de alias (ex.: `you@yourdomain.com`) – limitamos pela própria nome de domínio do alias (ex.: `yourdomain.com`). Isso impede que `Senders` inundem as caixas de entrada de todos os aliases em seu domínio de uma só vez.
* Temos limites gerais que se aplicam a todos os `Senders` em nosso serviço independentemente do destinatário:
  * `Senders` que consideramos "confiáveis" como fonte de verdade (ex.: `gmail.com`, `microsoft.com`, `apple.com`) são limitados a enviar 100 GB por dia.
  * `Senders` que estão [na lista de permissão](#do-you-have-an-allowlist) são limitados a enviar 10 GB por dia.
  * Todos os outros `Senders` são limitados a enviar 1 GB e/ou 1000 mensagens por dia.
* Temos um limite específico por `Sender` e `yourdomain.com` de 1 GB e/ou 1000 mensagens diárias.

Os servidores MX também limitam mensagens encaminhadas para um ou mais destinatários por meio de limitação de taxa – mas isso se aplica apenas a `Senders` que não estão na [lista de permissão](#do-you-have-an-allowlist):

* Permitimos até 100 conexões por hora, por domínio raiz FQDN resolvido do `Sender` (ou) endereço IP remoto do `Sender` (se não houver PTR reverso disponível), e por destinatário do envelope. Armazenamos a chave para limitação de taxa como um hash criptográfico em nosso banco de dados Redis.

* Se você estiver enviando e-mail através do nosso sistema, por favor, certifique-se de ter um PTR reverso configurado para todos os seus endereços IP (caso contrário, cada domínio raiz FQDN único ou endereço IP do qual você enviar será limitado na taxa).

* Note que se você enviar através de um sistema popular como Amazon SES, então você não será limitado na taxa, pois (no momento desta escrita) o Amazon SES está listado em nossa lista de permissão.

* Se você estiver enviando de um domínio como `test.abc.123.example.com`, então o limite de taxa será imposto em `example.com`. Muitos spammers usam centenas de subdomínios para contornar filtros comuns de spam que limitam taxa apenas por nomes de host únicos em vez de domínios raiz FQDN únicos.

* `Senders` que excederem o limite de taxa serão rejeitados com um erro 421.

Nossos servidores IMAP e SMTP limitam seus aliases a não terem mais de `60` conexões simultâneas ao mesmo tempo.

Nossos servidores MX limitam `Senders` [não na lista de permissão](#do-you-have-an-allowlist) a estabelecerem mais de 10 conexões simultâneas (com expiração de cache de 3 minutos para o contador, que espelha nosso tempo limite de socket de 3 minutos).

### Como você protege contra backscatter {#how-do-you-protect-against-backscatter}

Rebotes mal direcionados ou spam de rebote (conhecido como "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") podem causar reputação negativa para endereços IP do remetente.

Tomamos duas medidas para proteger contra backscatter, que são detalhadas nas seções seguintes [Prevenir rebotes de spammers conhecidos do MAIL FROM](#prevent-bounces-from-known-mail-from-spammers) e [Prevenir rebotes desnecessários para proteger contra backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) abaixo.

### Prevenir rebotes de spammers conhecidos do MAIL FROM {#prevent-bounces-from-known-mail-from-spammers}

Extraímos a lista de [Backscatter.org](https://www.backscatterer.org/) (alimentado por [UCEPROTECT](https://www.uceprotect.net/)) em <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> a cada hora e a alimentamos em nosso banco de dados Redis (também comparamos a diferença antecipadamente; caso algum IP tenha sido removido e precise ser respeitado).
Se o MAIL FROM estiver em branco OU for igual (case-insensitive) a qualquer um dos [endereços postmaster](#what-are-postmaster-addresses) (a parte antes do @ em um e-mail), então verificamos se o IP do remetente corresponde a algum desta lista.

Se o IP do remetente estiver listado (e não estiver em nossa [lista de permissões](#do-you-have-an-allowlist)), então enviamos um erro 554 com a mensagem `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Seremos alertados se um remetente estiver tanto na lista Backscatterer quanto em nossa lista de permissões para que possamos resolver o problema, se necessário.

As técnicas descritas nesta seção aderem à recomendação "SAFE MODE" em <https://www.backscatterer.org/?target=usage> – onde só verificamos o IP do remetente se certas condições já foram atendidas.

### Prevenir rejeições desnecessárias para proteger contra backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Rejeições (bounces) são e-mails que indicam que o encaminhamento do e-mail falhou completamente para o destinatário e o e-mail não será reenviado.

Uma razão comum para ser listado na lista Backscatterer é rejeições mal direcionadas ou spam de rejeição, então devemos proteger contra isso de algumas maneiras:

1. Só enviamos quando ocorrem erros com código >= 500 (quando e-mails tentados a serem encaminhados falharam, por exemplo, o Gmail responde com um erro de nível 500).

2. Enviamos apenas uma vez e somente uma vez (usamos uma chave de impressão digital de rejeição calculada e armazenamos em cache para evitar envios duplicados). A impressão digital da rejeição é uma chave que é a impressão digital da mensagem combinada com um hash do endereço de rejeição e seu código de erro). Veja a seção sobre [Impressão Digital](#how-do-you-determine-an-email-fingerprint) para mais detalhes sobre como a impressão digital da mensagem é calculada. Impressões digitais de rejeições enviadas com sucesso expirarão após 7 dias em nosso cache Redis.

3. Só enviamos quando o MAIL FROM e/ou From não estiverem em branco e não contiverem (case-insensitive) um [nome de usuário postmaster](#what-are-postmaster-addresses) (a parte antes do @ em um e-mail).

4. Não enviamos se a mensagem original tiver algum dos seguintes cabeçalhos (case-insensitive):

   * Cabeçalho `auto-submitted` com valor diferente de `no`.
   * Cabeçalho `x-auto-response-suppress` com valor `dr`, `autoreply`, `auto-reply`, `auto_reply` ou `all`
   * Cabeçalho `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` ou `x-auto-respond` (independente do valor).
   * Cabeçalho `precedence` com valor `bulk`, `autoreply`, `auto-reply`, `auto_reply` ou `list`.

5. Não enviamos se o endereço de e-mail MAIL FROM ou From terminar com `+donotreply`, `-donotreply`, `+noreply` ou `-noreply`.

6. Não enviamos se a parte do nome de usuário do endereço de e-mail From for `mdaemon` e tiver um cabeçalho case-insensitive `X-MDDSN-Message`.

7. Não enviamos se houver um cabeçalho case-insensitive `content-type` com valor `multipart/report`.

### Como você determina a impressão digital de um e-mail {#how-do-you-determine-an-email-fingerprint}

A impressão digital de um e-mail é usada para determinar a unicidade de um e-mail e para evitar que mensagens duplicadas sejam entregues e [rejeições duplicadas](#prevent-unnecessary-bounces-to-protect-against-backscatter) sejam enviadas.

A impressão digital é calculada a partir da seguinte lista:

* Nome de host FQDN resolvido pelo cliente ou endereço IP
* Valor do cabeçalho `Message-ID` (se houver)
* Valor do cabeçalho `Date` (se houver)
* Valor do cabeçalho `From` (se houver)
* Valor do cabeçalho `To` (se houver)
* Valor do cabeçalho `Cc` (se houver)
* Valor do cabeçalho `Subject` (se houver)
* Valor do `Body` (se houver)

### Posso encaminhar e-mails para portas diferentes da 25 (por exemplo, se meu ISP bloqueou a porta 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Sim, desde 5 de maio de 2020 adicionamos esse recurso. Atualmente o recurso é específico por domínio, e não por alias. Se você precisar que seja específico por alias, por favor entre em contato conosco para informar suas necessidades.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Proteção Avançada de Privacidade:
  </strong>
  <span>
    Se você está em um plano pago (que oferece proteção avançada de privacidade), por favor vá para <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>, clique em "Configurar" ao lado do seu domínio e depois clique em "Configurações". Se quiser saber mais sobre planos pagos, veja nossa página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preços</a>. Caso contrário, você pode continuar seguindo as instruções abaixo.
  </span>
</div>
Se você está no plano gratuito, então simplesmente adicione um novo registro DNS <strong class="notranslate">TXT</strong> conforme mostrado abaixo, mas altere a porta de 25 para a porta de sua escolha.

Por exemplo, se eu quiser que todos os e-mails que vão para `example.com` sejam encaminhados para a porta SMTP dos destinatários alias 1337 em vez de 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
    O cenário mais comum para configuração de encaminhamento com porta personalizada é quando você quer encaminhar todos os e-mails que vão para example.com para uma porta diferente em example.com, diferente da porta padrão SMTP 25. Para configurar isso, simplesmente adicione o seguinte registro <strong class="notranslate">TXT</strong> catch-all.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Ele suporta o símbolo de mais + para aliases do Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

Sim, absolutamente.

### Ele suporta subdomínios {#does-it-support-sub-domains}

Sim, absolutamente. Em vez de usar "@", ".", ou em branco como nome/host/alias, você simplesmente usa o nome do subdomínio como valor.

Se você quiser que `foo.example.com` encaminhe e-mails, então insira `foo` como valor do nome/host/alias nas suas configurações DNS (para ambos registros MX e <strong class="notranslate">TXT</strong>).

### Isso encaminha os cabeçalhos dos meus e-mails {#does-this-forward-my-emails-headers}

Sim, absolutamente.

### Isso é bem testado {#is-this-well-tested}

Sim, há testes escritos com [ava](https://github.com/avajs/ava) e também possui cobertura de código.

### Vocês repassam mensagens e códigos de resposta SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

Sim, absolutamente. Por exemplo, se você está enviando um e-mail para `hello@example.com` e ele está registrado para encaminhar para `user@gmail.com`, então a mensagem e o código de resposta SMTP do servidor SMTP "gmail.com" serão retornados em vez do servidor proxy em "mx1.forwardemail.net" ou "mx2.forwardemail.net".

### Como vocês previnem spammers e garantem uma boa reputação de encaminhamento de e-mails {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Veja nossas seções sobre [Como funciona seu sistema de encaminhamento de e-mails](#how-does-your-email-forwarding-system-work), [Como vocês lidam com problemas de entrega de e-mails](#how-do-you-handle-email-delivery-issues), e [Como vocês lidam com o bloqueio dos seus endereços IP](#how-do-you-handle-your-ip-addresses-becoming-blocked) acima.

### Como vocês realizam consultas DNS em nomes de domínio {#how-do-you-perform-dns-lookups-on-domain-names}

Criamos um projeto de software open-source :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) e o usamos para consultas DNS. Os servidores DNS padrão usados são `1.1.1.1` e `1.0.0.1`, e as consultas DNS são feitas através de [DNS sobre HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") na camada de aplicação.

:tangerine: [Tangerine](https://github.com/tangerine) usa o serviço DNS para consumidores focado em privacidade da [CloudFlare por padrão][cloudflare-dns].


## Conta e Faturamento {#account-and-billing}

### Vocês oferecem garantia de reembolso nos planos pagos {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Sim! Reembolsos automáticos ocorrem quando você faz upgrade, downgrade ou cancela sua conta dentro de 30 dias a partir do início do seu plano. Isso se aplica apenas para clientes pela primeira vez.
### Se eu mudar de plano, vocês fazem prorrateio e reembolsam a diferença {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Não fazemos prorrateio nem reembolsamos a diferença quando você muda de plano. Em vez disso, convertemos a duração restante a partir da data de expiração do seu plano atual para a duração relativa mais próxima do seu novo plano (arredondada para baixo por mês).

Observe que, se você fizer upgrade ou downgrade entre planos pagos dentro de uma janela de 30 dias desde o início do plano pago, reembolsaremos automaticamente o valor total do seu plano atual.

### Posso usar este serviço de encaminhamento de e-mail apenas como um servidor MX "fallback" ou "fallover" {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Não, não é recomendado, pois você só pode usar um servidor de troca de e-mails por vez. Fallbacks geralmente nunca são tentados novamente devido a configurações incorretas de prioridade e servidores de e-mail que não respeitam a verificação de prioridade MX.

### Posso desativar aliases específicos {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se você estiver em um plano pago, deve ir para <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases <i class="fa fa-angle-right"></i> Editar Alias <i class="fa fa-angle-right"></i> Desmarcar a caixa "Ativo" <i class="fa fa-angle-right"></i> Continuar.
  </span>
</div>

Sim, basta editar seu registro DNS <strong class="notranslate">TXT</strong> e prefixar o alias com um, dois ou três pontos de exclamação (veja abaixo).

Observe que você *deve* preservar o mapeamento ":" pois isso é necessário caso decida desativar isso no futuro (e também é usado para importação se você fizer upgrade para um de nossos planos pagos).

**Para rejeição silenciosa (aparece para o remetente como se a mensagem tivesse sido enviada com sucesso, mas na verdade não vai para lugar algum) (código de status `250`):** Se você prefixar um alias com "!" (um ponto de exclamação) ele retornará um código de status `250` bem-sucedido para remetentes tentando enviar para esse endereço, mas os e-mails em si não irão para lugar algum (ex.: um buraco negro ou `/dev/null`).

**Para rejeição suave (código de status `421`):** Se você prefixar um alias com "!!" (dois pontos de exclamação) ele retornará um código de erro temporário `421` para remetentes tentando enviar para esse endereço, e os e-mails geralmente serão tentados novamente por até 5 dias antes de serem rejeitados e devolvidos.

**Para rejeição definitiva (código de status `550`):** Se você prefixar um alias com "!!!" (três pontos de exclamação) ele retornará um código de erro permanente `550` para remetentes tentando enviar para esse endereço e os e-mails serão rejeitados e devolvidos.

Por exemplo, se eu quiser que todos os e-mails que vão para `alias@example.com` parem de ser encaminhados para `user@gmail.com` e sejam rejeitados e devolvidos (ex.: usar três pontos de exclamação):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
  <span>
    Você também pode reescrever o endereço do destinatário encaminhado para simplesmente "nobody@forwardemail.net", que o direcionará para ninguém, como no exemplo abaixo.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
  <span>
    Se você quiser aumentar a segurança, também pode remover a parte ":user@gmail.com" (ou ":nobody@forwardemail.net"), deixando apenas "!!!alias" como no exemplo abaixo.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### Posso encaminhar e-mails para múltiplos destinatários {#can-i-forward-emails-to-multiple-recipients}

Sim, absolutamente. Basta especificar múltiplos destinatários nos seus registros <strong class="notranslate">TXT</strong>.

Por exemplo, se eu quiser que um e-mail enviado para `hello@example.com` seja encaminhado para `user+a@gmail.com` e `user+b@gmail.com`, então meu registro <strong class="notranslate">TXT</strong> ficaria assim:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Ou, você pode especificá-los em duas linhas separadas, como esta:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Fica a seu critério!

### Posso ter múltiplos destinatários globais catch-all {#can-i-have-multiple-global-catch-all-recipients}

Sim, você pode. Basta especificar múltiplos destinatários globais catch-all nos seus registros <strong class="notranslate">TXT</strong>.

Por exemplo, se eu quiser que todo e-mail enviado para `*@example.com` (o asterisco significa que é um curinga, ou seja, catch-all) seja encaminhado para `user+a@gmail.com` e `user+b@gmail.com`, então meu registro <strong class="notranslate">TXT</strong> ficaria assim:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Ou, você pode especificá-los em duas linhas separadas, como esta:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Resposta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", ou em branco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
Depende de você!

### Existe um limite máximo para o número de endereços de email para os quais posso encaminhar por alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Sim, o limite padrão é 10. Isso NÃO significa que você pode ter apenas 10 aliases no seu nome de domínio. Você pode ter quantos aliases quiser (uma quantidade ilimitada). Significa que você só pode encaminhar um alias para 10 endereços de email únicos. Você poderia ter `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (de 1 a 10) – e qualquer email para `hello@example.com` seria encaminhado para `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (de 1 a 10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Dica:
  </strong>
  <span>
    Precisa de mais de 10 destinatários por alias? Envie-nos um email e teremos prazer em aumentar o limite da sua conta.
  </span>
</div>

### Posso encaminhar emails recursivamente {#can-i-recursively-forward-emails}

Sim, você pode, porém ainda deve respeitar o limite máximo. Se você tem `hello:linus@example.com` e `linus:user@gmail.com`, então emails para `hello@example.com` seriam encaminhados para `linus@example.com` e `user@gmail.com`. Note que um erro será gerado se você tentar encaminhar emails recursivamente além do limite máximo.

### As pessoas podem cancelar ou registrar meu encaminhamento de email sem minha permissão {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Usamos verificação de registros MX e <strong class="notranslate">TXT</strong>, portanto, se você adicionar os respectivos registros MX e <strong class="notranslate">TXT</strong> deste serviço, então você está registrado. Se você removê-los, então você está cancelado. Você tem a propriedade do seu domínio e gerenciamento de DNS, então se alguém tem acesso a isso, então isso é um problema.

### Como é gratuito {#how-is-it-free}

Forward Email oferece um nível gratuito por meio de uma combinação de desenvolvimento open-source, infraestrutura eficiente e planos pagos opcionais que suportam o serviço.

Nosso nível gratuito é suportado por:

1. **Desenvolvimento Open Source**: Nossa base de código é open source, permitindo contribuições da comunidade e operação transparente.

2. **Infraestrutura Eficiente**: Otimizamos nossos sistemas para lidar com encaminhamento de email com recursos mínimos.

3. **Planos Premium Pagos**: Usuários que precisam de recursos adicionais como envio SMTP, recebimento IMAP ou opções avançadas de privacidade assinam nossos planos pagos.

4. **Limites de Uso Razoáveis**: O nível gratuito possui políticas de uso justo para evitar abusos.

> \[!NOTE]
> Estamos comprometidos em manter o encaminhamento básico de email gratuito enquanto oferecemos recursos premium para usuários com necessidades mais avançadas.

> \[!TIP]
> Se você achar nosso serviço valioso, considere fazer upgrade para um plano pago para apoiar o desenvolvimento e manutenção contínuos.

### Qual é o limite máximo de tamanho de email {#what-is-the-max-email-size-limit}

O limite padrão é de 50MB, que inclui conteúdo, cabeçalhos e anexos. Note que serviços como Gmail e Outlook permitem apenas limite de 25MB, e se você ultrapassar o limite ao enviar para endereços nesses provedores, receberá uma mensagem de erro.

Um erro com o código de resposta apropriado é retornado se o limite de tamanho do arquivo for excedido.

### Vocês armazenam logs de emails {#do-you-store-logs-of-emails}

Não, não escrevemos no disco nem armazenamos logs – com a [exceção de erros](#do-you-store-error-logs) e [SMTP de saída](#do-you-support-sending-email-with-smtp) (veja nossa [Política de Privacidade](/privacy)).

Tudo é feito em memória e [nosso código-fonte está no GitHub](https://github.com/forwardemail).

### Vocês armazenam logs de erros {#do-you-store-error-logs}

**Sim. Você pode acessar os logs de erros em [Minha Conta → Logs](/my-account/logs) ou [Minha Conta → Domínios](/my-account/domains).**

Desde fevereiro de 2023, armazenamos logs de erros para códigos de resposta SMTP `4xx` e `5xx` por um período de 7 dias – que contêm o erro SMTP, envelope e cabeçalhos do email (nós **não** armazenamos o corpo do email nem anexos).
Os logs de erro permitem que você verifique e-mails importantes ausentes e mitigue falsos positivos de spam para [seus domínios](/my-account/domains). Eles também são um ótimo recurso para depurar problemas com [webhooks de e-mail](#do-you-support-webhooks) (já que os logs de erro contêm a resposta do endpoint do webhook).

Os logs de erro para [limitação de taxa](#do-you-have-rate-limiting) e [greylisting](#do-you-have-a-greylist) não são acessíveis, pois a conexão termina cedo (por exemplo, antes que os comandos `RCPT TO` e `MAIL FROM` possam ser transmitidos).

Veja nossa [Política de Privacidade](/privacy) para mais informações.

### Você lê meus e-mails {#do-you-read-my-emails}

Não, absolutamente não. Veja nossa [Política de Privacidade](/privacy).

Muitos outros serviços de encaminhamento de e-mail armazenam e podem potencialmente ler seu e-mail. Não há razão para que e-mails encaminhados precisem ser armazenados em disco – e por isso arquitetamos a primeira solução open-source que faz tudo na memória.

Acreditamos que você deve ter direito à privacidade e a respeitamos estritamente. O código que é implantado no servidor é [software open-source no GitHub](https://github.com/forwardemail) para transparência e para construir confiança.

### Posso "enviar e-mail como" no Gmail com isso {#can-i-send-mail-as-in-gmail-with-this}

Sim! A partir de 2 de outubro de 2018 adicionamos esse recurso. Veja [Como Enviar E-mail Como usando o Gmail](#how-to-send-mail-as-using-gmail) acima!

Você também deve configurar o registro SPF para o Gmail na sua configuração DNS no registro <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se você estiver usando Gmail (por exemplo, Enviar E-mail Como) ou G Suite, será necessário adicionar <code>include:_spf.google.com</code> ao seu registro SPF <strong class="notranslate">TXT</strong>, por exemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Posso "enviar e-mail como" no Outlook com isso {#can-i-send-mail-as-in-outlook-with-this}

Sim! A partir de 2 de outubro de 2018 adicionamos esse recurso. Basta consultar estes dois links da Microsoft abaixo:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Você também deve configurar o registro SPF para o Outlook na sua configuração DNS no registro <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se você estiver usando Microsoft Outlook ou Live.com, será necessário adicionar <code>include:spf.protection.outlook.com</code> ao seu registro SPF <strong class="notranslate">TXT</strong>, por exemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Posso "enviar e-mail como" no Apple Mail e iCloud Mail com isso {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Se você é assinante do iCloud+, pode usar um domínio personalizado. [Nosso serviço também é compatível com Apple Mail](#apple-mail).

Por favor, consulte <https://support.apple.com/en-us/102540> para mais informações.

### Posso encaminhar e-mails ilimitados com isso {#can-i-forward-unlimited-emails-with-this}

Sim, entretanto remetentes "relativamente desconhecidos" são limitados a 100 conexões por hora por hostname ou IP. Veja a seção sobre [Limitação de Taxa](#do-you-have-rate-limiting) e [Greylisting](#do-you-have-a-greylist) acima.

Por "relativamente desconhecidos", queremos dizer remetentes que não aparecem na [lista de permissões](#do-you-have-an-allowlist).

Se esse limite for excedido, enviamos um código de resposta 421 que informa ao servidor de e-mail do remetente para tentar novamente mais tarde.

### Vocês oferecem domínios ilimitados por um preço único {#do-you-offer-unlimited-domains-for-one-price}

Sim. Independentemente do plano que você esteja, você pagará apenas uma taxa mensal – que cobre todos os seus domínios.
### Quais métodos de pagamento vocês aceitam {#which-payment-methods-do-you-accept}

Forward Email aceita os seguintes métodos de pagamento únicos ou mensais/trimestrais/anuais:

1. **Cartões de Crédito/Débito/Transferências Bancárias**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, etc.
2. **PayPal**: Conecte sua conta PayPal para pagamentos fáceis
3. **Criptomoeda**: Aceitamos pagamentos via pagamentos em stablecoin da Stripe nas redes Ethereum, Polygon e Solana

> \[!NOTE]
> Armazenamos informações limitadas de pagamento em nossos servidores, que incluem apenas identificadores de pagamento e referências às transações, clientes, assinaturas e IDs de pagamento do [Stripe](https://stripe.com/global) e [PayPal](https://www.paypal.com).

> \[!TIP]
> Para máxima privacidade, considere usar pagamentos em criptomoeda.

Todos os pagamentos são processados com segurança através do Stripe ou PayPal. Seus dados de pagamento nunca são armazenados em nossos servidores.


## Recursos Adicionais {#additional-resources}

> \[!TIP]
> Nossos artigos abaixo são atualizados regularmente com novos guias, dicas e informações técnicas. Volte sempre para conferir o conteúdo mais recente.

* [Estudos de Caso & Documentação para Desenvolvedores](/blog/docs)
* [Recursos](/resources)
* [Guias](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
