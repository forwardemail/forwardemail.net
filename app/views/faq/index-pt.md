# Perguntas frequentes {#frequently-asked-questions}

<img carregando="preguiçoso" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Índice {#table-of-contents}

* [Início rápido](#quick-start)
* [Introdução](#introduction)
  * [O que é encaminhamento de e-mail](#what-is-forward-email)
  * [Quem usa o Forward Email](#who-uses-forward-email)
  * [Qual é a história do Forward Email](#what-is-forward-emails-history)
  * [Quão rápido é esse serviço?](#how-fast-is-this-service)
* [Clientes de e-mail](#email-clients)
  * [Pássaro Trovão](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Correio da Apple](#apple-mail)
  * [Dispositivos móveis](#mobile-devices)
  * [Como enviar e-mails usando o Gmail](#how-to-send-mail-as-using-gmail)
  * [Qual é o guia gratuito legado para Enviar e-mail como usando o Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Configuração avançada de roteamento do Gmail](#advanced-gmail-routing-configuration)
  * [Configuração avançada de roteamento do Outlook](#advanced-outlook-routing-configuration)
* [Solução de problemas](#troubleshooting)
  * [Por que não estou recebendo meus e-mails de teste?](#why-am-i-not-receiving-my-test-emails)
  * [Como configuro meu cliente de e-mail para trabalhar com o Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Por que meus e-mails estão indo para Spam e Lixo Eletrônico e como posso verificar a reputação do meu domínio?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [O que devo fazer se receber e-mails de spam](#what-should-i-do-if-i-receive-spam-emails)
  * [Por que meus e-mails de teste enviados para mim no Gmail estão sendo exibidos como "suspeitos"?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Posso remover o via forwardemail dot net no Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Gestão de Dados](#data-management)
  * [Onde estão localizados seus servidores](#where-are-your-servers-located)
  * [Como faço para exportar e fazer backup da minha caixa de correio](#how-do-i-export-and-backup-my-mailbox)
  * [Como faço para importar e migrar minha caixa de correio existente](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Você oferece suporte à auto-hospedagem?](#do-you-support-self-hosting)
* [Configuração de e-mail](#email-configuration)
  * [Como faço para começar e configurar o encaminhamento de e-mail](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Posso usar várias trocas e servidores MX para encaminhamento avançado?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Como configuro uma resposta automática de férias (resposta automática de ausência do escritório)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Como configuro o SPF para encaminhamento de e-mail](#how-do-i-set-up-spf-for-forward-email)
  * [Como configuro o DKIM para encaminhamento de e-mail](#how-do-i-set-up-dkim-for-forward-email)
  * [Como configuro o DMARC para encaminhamento de e-mail](#how-do-i-set-up-dmarc-for-forward-email)
  * [Como conecto e configuro meus contatos](#how-do-i-connect-and-configure-my-contacts)
  * [Como conecto e configuro meus calendários](#how-do-i-connect-and-configure-my-calendars)
  * [Como adicionar mais calendários e gerenciar calendários existentes](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Como configuro o SRS para encaminhamento de e-mail](#how-do-i-set-up-srs-for-forward-email)
  * [Como configuro o MTA-STS para encaminhamento de e-mail](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Como adiciono uma foto de perfil ao meu endereço de e-mail](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Recursos avançados](#advanced-features)
  * [Você oferece suporte a boletins informativos ou listas de mala direta para e-mail marketing relacionado?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Você oferece suporte ao envio de e-mail com API?](#do-you-support-sending-email-with-api)
  * [Você oferece suporte para receber e-mails com IMAP?](#do-you-support-receiving-email-with-imap)
  * [Você suporta POP3?](#do-you-support-pop3)
  * [Você oferece suporte a calendários (CalDAV)](#do-you-support-calendars-caldav)
  * [Você suporta contatos (CardDAV)](#do-you-support-contacts-carddav)
  * [Você oferece suporte para envio de e-mail com SMTP](#do-you-support-sending-email-with-smtp)
  * [Você oferece suporte a OpenPGP/MIME, criptografia de ponta a ponta ("E2EE") e Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Você apoia o MTA-STS](#do-you-support-mta-sts)
  * [Você oferece suporte a chaves de acesso e WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [Você apoia as melhores práticas de e-mail?](#do-you-support-email-best-practices)
  * [Você oferece suporte a webhooks de rejeição?](#do-you-support-bounce-webhooks)
  * [Você oferece suporte a webhooks?](#do-you-support-webhooks)
  * [Você oferece suporte a expressões regulares ou regex?](#do-you-support-regular-expressions-or-regex)
  * [Quais são os seus limites de SMTP de saída?](#what-are-your-outbound-smtp-limits)
  * [Preciso de aprovação para habilitar o SMTP](#do-i-need-approval-to-enable-smtp)
  * [Quais são as configurações do seu servidor SMTP](#what-are-your-smtp-server-configuration-settings)
  * [Quais são as configurações do seu servidor IMAP](#what-are-your-imap-server-configuration-settings)
  * [Quais são as configurações do seu servidor POP3?](#what-are-your-pop3-server-configuration-settings)
  * [Configuração de retransmissão SMTP do Postfix](#postfix-smtp-relay-configuration)
* [Segurança](#security)
  * [Técnicas avançadas de reforço de servidor](#advanced-server-hardening-techniques)
  * [Você possui certificações SOC 2 ou ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Você usa criptografia TLS para encaminhamento de e-mail](#do-you-use-tls-encryption-for-email-forwarding)
  * [Você preserva os cabeçalhos de autenticação de e-mail?](#do-you-preserve-email-authentication-headers)
  * [Você preserva os cabeçalhos de e-mail originais e evita falsificações?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Como você se protege contra spam e abuso](#how-do-you-protect-against-spam-and-abuse)
  * [Você armazena conteúdo de e-mail em disco?](#do-you-store-email-content-on-disk)
  * [O conteúdo do e-mail pode ser exposto durante falhas do sistema?](#can-email-content-be-exposed-during-system-crashes)
  * [Quem tem acesso à sua infraestrutura de e-mail](#who-has-access-to-your-email-infrastructure)
  * [Quais provedores de infraestrutura você usa](#what-infrastructure-providers-do-you-use)
  * [Você oferece um Contrato de Processamento de Dados (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Como você lida com notificações de violação de dados](#how-do-you-handle-data-breach-notifications)
  * [Você oferece um ambiente de teste](#do-you-offer-a-test-environment)
  * [Você fornece ferramentas de monitoramento e alerta?](#do-you-provide-monitoring-and-alerting-tools)
  * [Como você garante alta disponibilidade](#how-do-you-ensure-high-availability)
  * [Você está em conformidade com a Seção 889 da Lei de Autorização de Defesa Nacional (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Detalhes técnicos e do sistema](#system-and-technical-details)
  * [Você armazena e-mails e seus conteúdos](#do-you-store-emails-and-their-contents)
  * [Como funciona o seu sistema de encaminhamento de e-mail](#how-does-your-email-forwarding-system-work)
  * [Como você processa um e-mail para encaminhamento](#how-do-you-process-an-email-for-forwarding)
  * [Como você lida com problemas de entrega de e-mail](#how-do-you-handle-email-delivery-issues)
  * [Como você lida com o bloqueio dos seus endereços IP](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [O que são endereços de postmaster](#what-are-postmaster-addresses)
  * [O que são endereços sem resposta](#what-are-no-reply-addresses)
  * [Quais são os endereços IP do seu servidor?](#what-are-your-servers-ip-addresses)
  * [Você tem uma lista de permissões?](#do-you-have-an-allowlist)
  * [Quais extensões de nome de domínio são permitidas por padrão](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Quais são os seus critérios de lista de permissões?](#what-is-your-allowlist-criteria)
  * [Quais extensões de nome de domínio podem ser usadas gratuitamente](#what-domain-name-extensions-can-be-used-for-free)
  * [Você tem uma lista cinza?](#do-you-have-a-greylist)
  * [Você tem uma lista de negação?](#do-you-have-a-denylist)
  * [Você tem limitação de taxa](#do-you-have-rate-limiting)
  * [Como você se protege contra a retrodispersão](#how-do-you-protect-against-backscatter)
  * [Evite rejeições de spammers conhecidos](#prevent-bounces-from-known-mail-from-spammers)
  * [Evite saltos desnecessários para proteger contra retrodispersão](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Como você determina uma impressão digital de e-mail](#how-do-you-determine-an-email-fingerprint)
  * [Posso encaminhar e-mails para portas diferentes da 25 (por exemplo, se meu ISP bloqueou a porta 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Ele suporta o símbolo de mais + para aliases do Gmail?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Ele suporta subdomínios?](#does-it-support-sub-domains)
  * [Isso encaminha os cabeçalhos do meu e-mail](#does-this-forward-my-emails-headers)
  * [Isso é bem testado](#is-this-well-tested)
  * [Você passa mensagens e códigos de resposta SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Como você previne spammers e garante uma boa reputação de encaminhamento de e-mail](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Como você realiza pesquisas de DNS em nomes de domínio](#how-do-you-perform-dns-lookups-on-domain-names)
* [Conta e Faturamento](#account-and-billing)
  * [Vocês oferecem garantia de devolução de dinheiro em planos pagos?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Se eu mudar de plano, vocês fazem a diferença proporcionalmente e me reembolsam?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Posso usar este serviço de encaminhamento de e-mail como um servidor MX "fallback" ou "fallover"?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Posso desabilitar aliases específicos](#can-i-disable-specific-aliases)
  * [Posso encaminhar e-mails para vários destinatários?](#can-i-forward-emails-to-multiple-recipients)
  * [Posso ter vários destinatários globais abrangentes](#can-i-have-multiple-global-catch-all-recipients)
  * [Existe um limite máximo para o número de endereços de e-mail para os quais posso encaminhar por alias?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Posso encaminhar e-mails recursivamente](#can-i-recursively-forward-emails)
  * [As pessoas podem cancelar o registro ou registrar meu encaminhamento de e-mail sem minha permissão?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Como é grátis?](#how-is-it-free)
  * [Qual é o limite máximo de tamanho de e-mail?](#what-is-the-max-email-size-limit)
  * [Você armazena registros de e-mails](#do-you-store-logs-of-emails)
  * [Você armazena logs de erros](#do-you-store-error-logs)
  * [Você lê meus e-mails?](#do-you-read-my-emails)
  * [Posso "enviar e-mail como" no Gmail com este](#can-i-send-mail-as-in-gmail-with-this)
  * [Posso "enviar e-mail como" no Outlook com este](#can-i-send-mail-as-in-outlook-with-this)
  * [Posso "enviar e-mail como" no Apple Mail e no iCloud Mail com este](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Posso encaminhar e-mails ilimitados com isso](#can-i-forward-unlimited-emails-with-this)
  * [Você oferece domínios ilimitados por um preço único](#do-you-offer-unlimited-domains-for-one-price)
  * [Quais métodos de pagamento você aceita?](#which-payment-methods-do-you-accept)
* [Recursos adicionais](#additional-resources)

## Início rápido {#quick-start}

Para começar a usar o Encaminhamento de e-mail:

1. **Crie uma conta** em [forwardemail.net/register](https://forwardemail.net/register)

2. **Adicione e verifique seu domínio** em [Minha Conta → Domínios](/my-account/domains)

3. **Adicione e configure aliases/caixas de correio de e-mail** em [Minha Conta → Domínios](/my-account/domains) → Aliases

4. **Teste sua configuração** enviando um e-mail para um de seus novos aliases

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

## Introdução {#introduction}

### O que é encaminhamento de e-mail {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email é um **provedor de serviços de e-mail completo** e **provedor de hospedagem de e-mail para nomes de domínio personalizados**.

É o único serviço gratuito e de código aberto e permite que você use endereços de e-mail de domínio personalizado sem a complexidade de configurar e manter seu próprio servidor de e-mail.

Nosso serviço encaminha e-mails enviados para seu domínio personalizado para sua conta de e-mail existente – e você pode até nos usar como seu provedor dedicado de hospedagem de e-mail.

Principais recursos do Forward Email:

* **E-mail com domínio personalizado**: Use endereços de e-mail profissionais com seu próprio nome de domínio
* **Nível gratuito**: Encaminhamento básico de e-mails sem custo
* **Privacidade aprimorada**: Não lemos seus e-mails nem vendemos seus dados
* **Código aberto**: Toda a nossa base de código está disponível no GitHub
* **Suporte a SMTP, IMAP e POP3**: Recursos completos de envio e recebimento de e-mails
* **Criptografia de ponta a ponta**: Suporte para OpenPGP/MIME
* **Aliases personalizados catch-all**: Crie aliases de e-mail ilimitados

Você pode nos comparar a mais de 56 outros provedores de serviços de e-mail em [nossa página de comparação de e-mail](/blog/best-email-service).

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### Quem usa o encaminhamento de e-mail {#who-uses-forward-email}

Oferecemos serviços de hospedagem e encaminhamento de e-mail para mais de 500.000 domínios e estes usuários notáveis:

| Cliente | Estudo de caso |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Academia Naval dos EUA | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Canônico | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Jogos da Netflix |  |
| A Fundação Linux | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| A Fundação PHP |  |
| Rádio Fox News |  |
| Vendas de anúncios da Disney |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Na humanidade | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| A Universidade de Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| A Universidade de Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| A Universidade de Washington | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Universidade Tufts | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Faculdade Swarthmore | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Governo da Austrália do Sul |  |
| Governo da República Dominicana |  |
| Fly<span>.</span>io |  |
| Hotéis RCD |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Qual é o histórico do Forward Email {#what-is-forward-emails-history}

Você pode aprender mais sobre Encaminhar e-mail em [nossa página Sobre](/about).

### Quão rápido é este serviço {#how-fast-is-this-service}

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

O Forward Email entrega mensagens com atraso mínimo, normalmente em segundos após o recebimento.

Métricas de desempenho:

* **Tempo médio de entrega**: Menos de 5 a 10 segundos do recebimento ao encaminhamento ([veja nossa página de monitoramento de tempo para caixa de entrada "TTI"](/tti))
* **Tempo de atividade**: Disponibilidade do serviço acima de 99,9%
* **Infraestrutura global**: Servidores estrategicamente localizados para roteamento otimizado
* **Escalonamento automático**: Nosso sistema é escalonado durante os períodos de pico de e-mails

Operamos em tempo real, diferentemente de outros provedores que dependem de filas atrasadas.

Não gravamos em disco nem armazenamos logs – com [exceção de erros](#do-you-store-error-logs) e [SMTP de saída](#do-you-support-sending-email-with-smtp) (veja nosso [política de Privacidade](/privacy)).

Tudo é feito na memória e [nosso código fonte está no GitHub](https://github.com/forwardemail).

## Clientes de e-mail {#email-clients}

__URL_PROTEGIDA_463__ Thunderbird {__URL_PROTEGIDA_464__

1. Crie um novo alias e gere uma senha no seu painel de Encaminhamento de E-mails.
2. Abra o Thunderbird e acesse **Editar → Configurações da Conta → Ações da Conta → Adicionar Conta de E-mail**.
3. Insira seu nome, endereço de Encaminhamento de E-mails e senha.
4. Clique em **Configurar Manualmente** e insira:
* Entrada: IMAP, `imap.forwardemail.net`, porta 993, SSL/TLS
* Saída: SMTP, `smtp.forwardemail.net`, porta 587, STARTTLS
5. Clique em **Concluído**

__URL_PROTEGIDA_465__ Microsoft Outlook {__URL_PROTEGIDA_466__

1. Crie um novo alias e gere uma senha no seu painel de Encaminhamento de E-mails.
2. Acesse **Arquivo → Adicionar Conta**
3. Insira seu endereço de Encaminhamento de E-mails e clique em **Conectar**
4. Escolha **Opções Avançadas** e selecione **Permitir que eu configure minha conta manualmente**
5. Selecione **IMAP** e insira:
* Entrada: `imap.forwardemail.net`, porta 993, SSL
* Saída: `smtp.forwardemail.net`, porta 587, TLS
* Nome de Usuário: Seu endereço de e-mail completo
* Senha: Sua senha gerada
6. Clique em **Conectar**

__URL_PROTEGIDA_467__ Apple Mail {__URL_PROTEGIDA_468__

1. Crie um novo alias e gere uma senha no seu painel de Encaminhamento de E-mails.
2. Acesse **E-mail → Preferências → Contas → +**
3. Selecione **Outra Conta de E-mail**
4. Insira seu nome, endereço de Encaminhamento de E-mails e senha.
5. Para as configurações do servidor, insira:
* Entrada: `imap.forwardemail.net`
* Saída: `smtp.forwardemail.net`
* Nome de usuário: Seu endereço de e-mail completo.
* Senha: Sua senha gerada.
6. Clique em **Entrar**

### Dispositivos móveis {#mobile-devices}

Para iOS:

1. Acesse **Configurações → E-mail → Contas → Adicionar Conta → Outros**
2. Toque em **Adicionar Conta de E-mail** e insira seus dados
3. Para as configurações do servidor, use as mesmas configurações de IMAP e SMTP acima.

Para Android:

1. Acesse **Configurações → Contas → Adicionar Conta → Pessoal (IMAP)**
2. Insira seu endereço de e-mail e senha para encaminhamento de e-mail
3. Para as configurações do servidor, use as mesmas configurações de IMAP e SMTP acima.

### Como enviar e-mails usando o Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo estimado de configuração:</strong>
<span>Menos de 10 minutos</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Primeiros passos:
</strong>
<span>
Se você seguiu as instruções acima em <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Como começar e configurar o encaminhamento de e-mail</a>, pode continuar lendo abaixo.
</span>
</div>

<div id="enviar-e-mail-como-conteúdo">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Leia nossos <a href="/terms" class="alert-link" target="_blank">Termos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidade</a> e <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites de SMTP de Saída</a> — seu uso é considerado reconhecimento e concordância.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se você for um desenvolvedor, consulte nossa <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentação da API de e-mail</a>.
</span>
</div>

1. Acesse <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Configuração de SMTP de Saída e siga as instruções de configuração

2. Crie um novo alias para seu domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (por exemplo, <code><hello@example.com></code>)

3. Clique em <strong class="text-success"><i class="fa fa-key"></i>Gerar Senha</strong> ao lado do alias recém-criado. Copie para a sua área de transferência e armazene com segurança a senha gerada, exibida na tela.

4. Vá para [Gmail](https://gmail.com) e em [Configurações <i class="fa fa-angle-right"></i> Contas e importação <i class="fa fa-angle-right"></i> Enviar e-mail como](https://mail.google.com/mail/u/0/#settings/accounts), clique em "Adicionar outro endereço de e-mail"

5. Quando solicitado "Nome", digite o nome pelo qual você deseja que seu e-mail seja visto como "De" (por exemplo, "Linus Torvalds").

6. Quando solicitado o "Endereço de e-mail", insira o endereço de e-mail completo de um alias que você criou em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (por exemplo, <code><hello@example.com></code>)

7. Desmarque "Tratar como um alias"

8. Clique em “Próxima etapa” para prosseguir

9. Quando solicitado "Servidor SMTP", digite <code>smtp.forwardemail.net</code> e deixe a porta como <code>587</code>

10. Quando solicitado o "Nome de usuário", insira o endereço de e-mail completo de um alias que você criou em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (por exemplo, <code><hello@example.com></code>)

11. Quando solicitado "Senha", cole a senha de <strong class="text-success"><i class="fa fa-key"></i> Gerar senha</strong> na etapa 3 acima

12. Deixe o botão de opção "Conexão segura usando TLS" marcado

13. Clique em "Adicionar conta" para prosseguir

14. Abra uma nova aba em [Gmail](https://gmail.com) e aguarde seu e-mail de verificação chegar (você receberá um código de verificação que confirma que você é o proprietário do endereço de e-mail para o qual está tentando "Enviar e-mail como")

15. Assim que chegar, copie e cole o código de verificação no prompt que você recebeu na etapa anterior

16. Após fazer isso, volte ao e-mail e clique no link para "confirmar a solicitação". Você provavelmente precisará seguir esta etapa e a anterior para que o e-mail seja configurado corretamente.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Parabéns!
</strong>
<span>
Você concluiu todas as etapas com sucesso.
</span>
</div>
</div>

</div>

### Qual é o guia gratuito antigo para Enviar e-mail como usando o Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> Este guia gratuito antigo foi descontinuado em maio de 2023, pois <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we agora oferece suporte a SMTP de saída</a>. Se você usar o guia abaixo, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this fará com que seu e-mail de saída</a> exiba "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" no Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo estimado de configuração:</strong>
<span>Menos de 10 minutos</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Primeiros passos:
</strong>
<span>
Se você seguiu as instruções acima em <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Como começar e configurar o encaminhamento de e-mail</a>, pode continuar lendo abaixo.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Como enviar e-mails usando o Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="guia-livre-de-legado">

1. Você precisa ter a [Autenticação de Dois Fatores do Gmail][gmail-2fa] habilitada para que isso funcione. Visite <https://www.google.com/landing/2step/> se ainda não a tiver habilitado.

2. Depois que a autenticação de dois fatores estiver habilitada (ou se você já a tiver habilitado), visite <https://myaccount.google.com/apppasswords>.

3. Quando solicitado a inserir "Selecione o aplicativo e o dispositivo para os quais deseja gerar a senha do aplicativo":
* Selecione "E-mail" no menu suspenso "Selecionar aplicativo"
* Selecione "Outro" no menu suspenso "Selecionar dispositivo"
* Quando solicitado a inserir o texto, insira o endereço de e-mail do seu domínio personalizado de onde você está encaminhando (por exemplo, <code><hello@example.com></code> - isso ajudará você a manter o controle caso use este serviço para várias contas)

4. Copie a senha gerada automaticamente para a área de transferência.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se você usa o G Suite, acesse o painel de administração <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Aplicativos <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Configurações do Gmail <i class="fa fa-angle-right"></i> Configurações</a> e marque a opção "Permitir que usuários enviem e-mails por meio de um servidor SMTP externo...". Haverá um atraso para que essa alteração seja ativada, portanto, aguarde alguns minutos.
</span>
</div>

5. Vá para [Gmail](https://gmail.com) e em [Configurações <i class="fa fa-angle-right"></i> Contas e importação <i class="fa fa-angle-right"></i> Enviar e-mail como](https://mail.google.com/mail/u/0/#settings/accounts), clique em "Adicionar outro endereço de e-mail"

6. Quando solicitado "Nome", digite o nome que você deseja que seu e-mail seja visto como "De" (por exemplo, "Linus Torvalds")

7. Quando solicitado o "Endereço de e-mail", digite o endereço de e-mail com o domínio personalizado usado acima (por exemplo, <code><hello@example.com></code>)

8. Desmarque "Tratar como um alias"

9. Clique em “Próxima etapa” para prosseguir

10. Quando solicitado "Servidor SMTP", digite <code>smtp.gmail.com</code> e deixe a porta como <code>587</code>

11. Quando solicitado o "Nome de usuário", insira a parte do seu endereço do Gmail sem a parte <span>gmail.com</span> (por exemplo, apenas "usuário" se meu e-mail for <span><usuário@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se a parte "Nome de usuário" for preenchida automaticamente, <u><strong>você precisará alterá-la</strong></u> para a parte do nome de usuário do seu endereço do Gmail.
</span>
</div>

12. Quando solicitado a "Senha", cole da sua área de transferência a senha que você gerou na etapa 2 acima

13. Deixe o botão de opção "Conexão segura usando TLS" marcado

14. Clique em "Adicionar conta" para prosseguir

15. Abra uma nova aba em [Gmail](https://gmail.com) e aguarde seu e-mail de verificação chegar (você receberá um código de verificação que confirma que você é o proprietário do endereço de e-mail para o qual está tentando "Enviar e-mail como")

16. Assim que chegar, copie e cole o código de verificação no prompt que você recebeu na etapa anterior

17. Após fazer isso, volte ao e-mail e clique no link para "confirmar a solicitação". Você provavelmente precisará seguir esta etapa e a anterior para que o e-mail seja configurado corretamente.

</div>

### Configuração avançada de roteamento do Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo estimado de configuração:</strong>
<span>15-30 minutos</span>
</div>

Se você quiser configurar o roteamento avançado no Gmail para que aliases que não correspondem a uma caixa de correio sejam encaminhados para as trocas de e-mail do Forward Email, siga estas etapas:

1. Faça login no seu console de administração do Google em [admin.google.com](https://admin.google.com)
2. Acesse **Aplicativos → Google Workspace → Gmail → Roteamento**
3. Clique em **Adicionar rota** e defina as seguintes configurações:

**Configurações para destinatário único:**

* Selecione "Alterar destinatário do envelope" e insira seu endereço principal do Gmail.
* Marque a opção "Adicionar cabeçalho X-Gm-Original-To com o destinatário original".

**Padrões de destinatários de envelopes:**

* Adicione um padrão que corresponda a todas as caixas de correio inexistentes (por exemplo, `.*@yourdomain.com`)

**Configurações do servidor de e-mail:**

* Selecione "Rota para o host" e insira `mx1.forwardemail.net` como servidor primário
* Adicione `mx2.forwardemail.net` como servidor de backup
* Defina a porta como 25
* Selecione "Exigir TLS" por questões de segurança

4. Clique em **Salvar** para criar a rota

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Esta configuração só funcionará para contas do Google Workspace com domínios personalizados, não para contas comuns do Gmail.
</span>
</div>

### Configuração avançada de roteamento do Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo estimado de configuração:</strong>
<span>15-30 minutos</span>
</div>

Para usuários do Microsoft 365 (antigo Office 365) que desejam configurar o roteamento avançado para que aliases que não correspondem a uma caixa de correio sejam encaminhados para as trocas de e-mail do Forward Email:

1. Faça login no centro de administração do Microsoft 365 em [admin.microsoft.com](https://admin.microsoft.com)
2. Acesse **Exchange → Fluxo de emails → Regras**
3. Clique em **Adicionar uma regra** e selecione **Criar uma nova regra**
4. Nomeie sua regra (por exemplo, "Encaminhar caixas de correio inexistentes para Encaminhar Email")
5. Em **Aplicar esta regra se**, selecione:
* "O endereço do destinatário corresponde a..."
* Insira um padrão que corresponda a todos os endereços do seu domínio (por exemplo, `*@yourdomain.com`)
6. Em **Faça o seguinte**, selecione:
* "Redirecionar a mensagem para..."
* Escolha "O seguinte servidor de email"
* Insira `mx1.forwardemail.net` e a porta 25
* Adicione `mx2.forwardemail.net` como servidor de backup
7. Em **Exceto se**, Selecione:
* "O destinatário é..."
* Adicione todas as suas caixas de correio existentes que não devem ser encaminhadas
8. Defina a prioridade da regra para garantir que ela seja executada após outras regras de fluxo de e-mail
9. Clique em **Salvar** para ativar a regra

## Solução de problemas {#troubleshooting}

### Por que não estou recebendo meus e-mails de teste {#why-am-i-not-receiving-my-test-emails}

Se você estiver enviando um e-mail de teste para si mesmo, ele pode não aparecer na sua caixa de entrada porque tem o mesmo cabeçalho "Message-ID".

Este é um problema amplamente conhecido e também afeta serviços como o Gmail. <a href="https://support.google.com/a/answer/1703601">Here é a resposta oficial do Gmail sobre esse problema</a>.

Se continuar com problemas, é provável que haja um problema com a propagação do DNS. Você precisará esperar um pouco mais e tentar novamente (ou tentar definir um valor TTL menor nos seus registros <strong class="notranslate">TXT</strong>).

**Ainda está com problemas?** Entre em contato conosco para que possamos ajudar a investigar o problema e encontrar uma solução rápida.

### Como configuro meu cliente de e-mail para funcionar com o Encaminhamento de e-mail {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Nosso serviço funciona com clientes de e-mail populares, como:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows</a></li>
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
Seu nome de usuário é o endereço de e-mail do seu alias e a senha é de <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> ("Senha Normal").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
<span>Se você estiver usando o Thunderbird, certifique-se de que a "Segurança da conexão" esteja definida como "SSL/TLS" e o Método de autenticação esteja definido como "Senha normal".</span>
</div>

| Tipo | Nome do host | Protocolo | Portos |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Preferido** | __CÓDIGO_DA_CÉLULA_0__ e __CÓDIGO_DA_CÉLULA_1__ |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Preferido** ou TLS (STARTTLS) | `465` e `2465` para SSL/TLS (ou) `587`, `2587`, `2525` e `25` para TLS (STARTTLS) |

### Por que meus e-mails estão indo para Spam e Lixo Eletrônico e como posso verificar a reputação do meu domínio {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Esta seção orienta você se seu e-mail de saída estiver usando nossos servidores SMTP (por exemplo, `smtp.forwardemail.net`) (ou encaminhado via `mx1.forwardemail.net` ou `mx2.forwardemail.net`) e estiver sendo entregue na pasta de Spam ou Lixo Eletrônico dos destinatários.

Monitoramos rotineiramente nosso [Endereços IP](#what-are-your-servers-ip-addresses) em relação ao [todas as listas de negação de DNS confiáveis](#how-do-you-handle-your-ip-addresses-becoming-blocked), **portanto, é muito provável que seja um problema específico de reputação de domínio**.

Os e-mails podem cair em pastas de spam por vários motivos:

1. **Autenticação ausente**: configure os registros [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) e [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Reputação do domínio**: novos domínios geralmente têm reputação neutra até estabelecerem um histórico de envio.

3. **Gatilhos de conteúdo**: Certas palavras ou frases podem acionar filtros de spam.

4. **Padrões de envio**: aumentos repentinos no volume de e-mails podem parecer suspeitos.

Você pode tentar usar uma ou mais destas ferramentas para verificar a reputação e a categorização do seu domínio:

| Nome da ferramenta | URL | Tipo |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Feedback sobre a categorização de domínios do Cloudflare | <https://radar.cloudflare.com/domains/feedback> | Categorização |
| Verificador de reputação de domínio e IP do Spamhaus | <https://check.spamhaus.org/> | DNSBL |
| Centro de reputação de domínio e IP do Cisco Talos | <https://talosintelligence.com/reputation_center> | Reputação |
| Pesquisa de IP e reputação de domínio do Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| Verificação da lista negra do MX Toolbox | <https://mxtoolbox.com/blacklists.aspx> | Lista negra |
| Ferramentas do Google Postmaster | <https://www.gmail.com/postmaster/> | Reputação |
| Centro de remetentes do Yahoo | <https://senders.yahooinc.com/> | Reputação |
| Verificação da lista negra do MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| Pontuação do remetente | <https://senderscore.org/act/blocklist-remover/> | Reputação |
| Desvalorização | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Remoção de IP Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | Remoção |
| Remoção de IP do Cloudmark | <https://csi.cloudmark.com/en/reset/> | Remoção |
| Spam Cop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Remoção de IP do Microsoft Outlook e Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Remoção |
| Níveis 1, 2 e 3 do UCEPROTECT | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| Backscatterer.org do UCEPROTECT | <https://www.backscatterer.org/> | Proteção contra retrodispersão |
| UCEPROTECT's whitelisted.org | <https://www.whitelisted.org/> (requer uma taxa) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Remoção |
| AOL/Verizon (por exemplo, `[IPTS04]`) | <https://senders.yahooinc.com/> | Remoção |
| Cox Communications | `unblock.request@cox.net` | Remoção |
| t-online.de (alemão/T-Mobile) | `tobr@rx.t-online.de` | Remoção |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### O que devo fazer se receber e-mails de spam {#what-should-i-do-if-i-receive-spam-emails}

Você deve cancelar a inscrição na lista de e-mail (se possível) e bloquear o remetente.

Não denuncie a mensagem como spam, mas encaminhe-a para nosso sistema de prevenção de abusos, criado manualmente e focado na privacidade.

**O endereço de e-mail para encaminhar spam é:** <abuse@forwardemail.net>

### Por que meus e-mails de teste enviados para mim no Gmail estão sendo exibidos como "suspeitos" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Se você vir essa mensagem de erro no Gmail ao enviar um teste para si mesmo ou quando uma pessoa para quem você está enviando um e-mail com seu alias vê um e-mail seu pela primeira vez, então **não se preocupe**, pois esse é um recurso de segurança integrado do Gmail.

Você pode simplesmente clicar em "Parece seguro". Por exemplo, se você enviar uma mensagem de teste usando o recurso "Enviar e-mail como" (para outra pessoa), essa pessoa não verá a mensagem.

No entanto, se eles virem esta mensagem, é porque normalmente estavam acostumados a receber seus e-mails de <john@gmail.com> em vez de <john@customdomain.com> (apenas um exemplo). O Gmail alertará os usuários apenas para garantir que tudo esteja seguro, caso não haja solução alternativa.

### Posso remover o via forwardemail dot net no Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Este tópico está relacionado a um [Problema amplamente conhecido no Gmail, onde informações extras aparecem ao lado do nome do remetente](https://support.google.com/mail/answer/1311182).

A partir de maio de 2023, oferecemos suporte ao envio de e-mail com SMTP como um complemento para todos os usuários pagos, o que significa que você pode remover o <span class="notranslate">via forwardemail dot net</span> no Gmail.

Observe que este tópico de FAQ é específico para aqueles que usam o recurso [Como enviar e-mails usando o Gmail](#how-to-send-mail-as-using-gmail).

Consulte a seção [Você oferece suporte para envio de e-mail com SMTP](#do-you-support-sending-email-with-smtp) para obter instruções de configuração.

## Gerenciamento de Dados {#data-management}

### Onde seus servidores estão localizados {#where-are-your-servers-located}

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

Nossos servidores estão localizados principalmente em Denver, Colorado – veja <https://forwardemail.net/ips> para nossa lista completa de endereços IP.

Você pode aprender mais sobre nossos subprocessadores em nossas páginas [GDPR](/gdpr), [DPA](/dpa) e [Privacidade](/privacy).

### Como faço para exportar e fazer backup da minha caixa de correio {#how-do-i-export-and-backup-my-mailbox}

A qualquer momento, você pode exportar suas caixas de correio nos formatos [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) ou criptografado [SQLite](https://en.wikipedia.org/wiki/SQLite).

Acesse <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases <i class="fa fa-angle-right"></i> Baixe o backup e selecione seu tipo de formato de exportação preferido.

Você receberá um link por e-mail para baixar a exportação quando ela for concluída.

Observe que este link de download de exportação expira após 4 horas por questões de segurança.

Se você precisar inspecionar seus formatos EML ou Mbox exportados, estas ferramentas de código aberto podem ser úteis:

| Nome | Formatar | Plataforma | URL do GitHub |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| Visualizador MBox | Mbox | Windows | <https://github.com/eneam/mboxviewer> |
| visualizador web mbox | Mbox | Todas as plataformas | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Windows | <https://github.com/ayamadori/EmlReader> |
| Visualizador de e-mail | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| leitor de eml | EML | Todas as plataformas | <https://github.com/s0ph1e/eml-reader> |

Além disso, se você precisar converter um arquivo Mbox em um arquivo EML, você pode usar <https://github.com/noelmartinon/mboxzilla>.

### Como faço para importar e migrar minha caixa de correio existente {#how-do-i-import-and-migrate-my-existing-mailbox}

Você pode importar facilmente seu e-mail para o Forward Email (por exemplo, usando [Pássaro Trovão](https://www.thunderbird.net)) com as instruções abaixo:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Você deve seguir todos os passos a seguir para importar seu e-mail existente.
</span>
</div>

1. Exporte seu e-mail do seu provedor de e-mail existente:

| Provedor de e-mail | Formato de exportação | Instruções de exportação |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Panorama | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Dica:</strong> <span>Se você estiver usando o Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">formato de exportação PST</a>), basta seguir as instruções em "Outros" abaixo. No entanto, fornecemos links abaixo para converter PST para o formato MBOX/EML com base no seu sistema operacional:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba para Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst para Windows cygwin</a> – (por exemplo, <code>readpst -u -o $OUT_DIR $IN_DIR</code> substituindo <code>$OUT_DIR</code> e <code>$IN_DIR</code> com os caminhos do diretório de saída e do diretório de entrada, respectivamente).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst para Ubuntu/Linux</a> – (por exemplo, <code>sudo apt-get install readpst</code> e, em seguida, <code>readpst -u -o $OUT_DIR $IN_DIR</code>, substituindo <code>$OUT_DIR</code> e <code>$IN_DIR</code> com os caminhos do diretório de saída e do diretório de entrada, respectivamente).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst para macOS (via brew)</a> – (por exemplo, <code>brew install libpst</code> e, em seguida, <code>readpst -u -o $OUT_DIR $IN_DIR</code>, substituindo <code>$OUT_DIR</code> e <code>$IN_DIR</code> pelos caminhos do diretório de saída e do diretório de entrada, respectivamente).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Conversor PST para Windows (GitHub)</a></li></ul><br /></span></div> |
| Correio da Apple | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Baixe-todos-os-seus-dados#downloadmail> |
| Correio de prótons | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Pensar | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Outro | [Use Thunderbird](https://www.thunderbird.net) | Configure sua conta de e-mail existente no Thunderbird e use o plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) para exportar e importar seus e-mails. **Você também pode simplesmente copiar/colar ou arrastar/soltar e-mails de uma conta para outra.** |

2. Baixe, instale e abra [Pássaro Trovão](https://www.thunderbird.net).

3. Crie uma nova conta usando o endereço de e-mail completo do seu alias (por exemplo, <code><você@seudominio.com></code>) e a senha gerada. <strong>Se você ainda não tiver uma senha gerada, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">consulte nossas instruções de configuração</a></strong>.

4. Baixe e instale o plugin [Ferramentas de Importação e Exportação de](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird.

5. Crie uma nova pasta local no Thunderbird e clique com o botão direito nela → selecione a opção `ImportExportTools NG` → escolha `Import mbox file` (para formato de exportação MBOX) – ou – `Import messages` / `Import all messages from a directory` (para formato de exportação EML).

6. Arraste e solte da pasta local para uma nova (ou existente) pasta IMAP no Thunderbird para a qual deseja enviar mensagens no armazenamento IMAP com nosso serviço. Isso garantirá que elas sejam copiadas online com nosso armazenamento criptografado em SQLite.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
<span>
Se você não sabe como importar para o Thunderbird, consulte as instruções oficiais em <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> e <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Após concluir o processo de exportação e importação, você também pode habilitar o encaminhamento na sua conta de e-mail existente e configurar uma resposta automática para notificar os remetentes de que você tem um novo endereço de e-mail (por exemplo, se você usava o Gmail anteriormente e agora usa um e-mail com seu nome de domínio personalizado).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Parabéns!
</strong>
<span>
Você concluiu todas as etapas com sucesso.
</span>
</div>
</div>

### Você oferece suporte à auto-hospedagem {#do-you-support-self-hosting}

Sim, a partir de março de 2025, oferecemos suporte a uma opção de auto-hospedagem. Leia o blog [aqui](https://forwardemail.net/blog/docs/self-hosted-solution). Confira o [guia auto-hospedado](https://forwardemail.net/self-hosted) para começar. E para quem tiver interesse em uma versão mais detalhada e passo a passo, consulte nossos guias baseados em [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) ou [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Configuração de e-mail {#email-configuration}

### Como faço para começar e configurar o encaminhamento de e-mail {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo estimado de configuração:</strong>
<span>Menos de 10 minutos</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Primeiros passos:
</strong>
<span>
Leia atentamente e siga os passos de um a oito listados abaixo. Certifique-se de substituir o endereço de e-mail <code>user@gmail.com</code> pelo endereço de e-mail para o qual deseja encaminhar os e-mails (caso ainda não esteja correto). Da mesma forma, certifique-se de substituir <code>example.com</code> pelo seu nome de domínio personalizado (caso ainda não esteja correto).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Se você já registrou seu nome de domínio em algum lugar, pule esta etapa completamente e vá para a segunda! Caso contrário, você pode <a href="/domain-registration" rel="noopener noreferrer">clicar aqui para registrar seu nome de domínio</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Você se lembra onde registrou seu domínio? Depois de se lembrar, siga as instruções abaixo:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Você precisa abrir uma nova aba e fazer login no seu registrador de domínio. Você pode clicar facilmente em "Registrador" abaixo para fazer isso automaticamente. Nessa nova aba, você precisa navegar até a página de gerenciamento de DNS no seu registrador — e fornecemos o passo a passo da navegação abaixo, na coluna "Etapas para Configurar". Depois de navegar até essa página na nova aba, você pode retornar a ela e prosseguir para a etapa três abaixo.
<strong class="font-weight-bold">Não feche a aba aberta ainda; você precisará dela para as próximas etapas!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Registrador</th>
<th>Etapas para Configurar</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Efetuar login <i class="fa fa-angle-right"></i> Central de Domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Editar Configurações de DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Rota 53</a></td>
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
PARA LEGADO: Faça login <i class="fa fa-angle-right"></i> Domínios <i class="fa fa-angle-right"></i> Editor de zona <i class="fa fa-angle-right"></i> (Selecione seu domínio)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Faça login <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Simplificado</a></td>
<td>Faça login <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Selecione seu domínio)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Entrar <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Gerenciar</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Oceano</a></td>
<td>Entrar <i class="fa fa-angle-right"></i> Rede <i class="fa fa-angle-right"></i> Domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Mais <i class="fa fa-angle-right"></i> Gerenciar Domínio</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Fazer login <i class="fa fa-angle-right"></i> Na visualização de cartão, clique em gerenciar no seu domínio <i class="fa fa-angle-right"></i> Na visualização de lista, clique
no ícone de engrenagem <i class="fa fa-angle-right"></i> DNS e Servidores de Nomes <i class="fa fa-angle-right"></i> Registros DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Assistir</a>
</td>
<td>Entrar <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Gerenciar <i class="fa fa-angle-right"></i> (clique no ícone de engrenagem) <i class="fa fa-angle-right"></i> Clique em DNS e Servidores de Nomes no menu à esquerda</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
<td>Entrar <i class="fa fa-angle-right"></i> Painel <i class="fa fa-angle-right"></i> Domínios <i class="fa fa-angle-right"></i> Gerenciar Domínios <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
<td>Entrar <i class="fa fa-angle-right"></i> Visão Geral <i class="fa fa-angle-right"></i> Gerenciar <i class="fa fa-angle-right"></i> Editor Simples <i class="fa fa-angle-right"></i> Registros</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
<td>Entrar <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Gerenciamento <i class="fa fa-angle-right"></i> Editar a zona</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Assistir</a>
</td>
<td>Fazer login <i class="fa fa-angle-right"></i> Gerenciar Meus Domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Gerenciar DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domínios</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Assistir</a>
</td>
<td>Entrar <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Configurar DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Assistir</a>
</td>
<td>Fazer login <i class="fa fa-angle-right"></i> Lista de Domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Gerenciar <i class="fa fa-angle-right"></i> DNS Avançado</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
<td>Fazer login <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Configurar DNS da Netlify</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Soluções</a></td>
<td>Entrar <i class="fa fa-angle-right"></i> Gerente de Contas <i class="fa fa-angle-right"></i> Meus Nomes de Domínio <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Gerenciar <i class="fa fa-angle-right"></i> Alterar Onde o Domínio Aponta <i class="fa fa-angle-right"></i> DNS Avançado</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Assistir</a>
</td>
<td>Entrar <i class="fa fa-angle-right"></i> Domínios Gerenciados <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> Configurações de DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
<td>Entrar <i class="fa fa-angle-right"></i> Menu Inicial <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i>
Configurações Avançadas <i class="fa fa-angle-right"></i> Registros Personalizados</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Agora</a></td>
<td>Usando a CLI "agora" <i class="fa fa-angle-right"></i> <code>agora dns adicionar [domínio] '@' MX [valor do registro] [prioridade]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
<td>Efetuar login <i class="fa fa-angle-right"></i> Página de domínios <i class="fa fa-angle-right"></i> (Selecione seu domínio) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
<td>Fazer login <i class="fa fa-angle-right"></i> Página de Domínios <i class="fa fa-angle-right"></i> (Clique no ícone <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Selecione Gerenciar Registros DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
<td>Fazer login <i class="fa fa-angle-right"></i> Domínios <i class="fa fa-angle-right"></i> Meus Domínios</td>
</tr>
<tr>
<td>Outros</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> Não encontrou o nome do seu registrador listado aqui? Basta pesquisar na internet por "como alterar registros DNS em $REGISTRAR" (substituindo $REGISTRAR pelo nome do seu registrador — por exemplo, "como alterar registros DNS no GoDaddy" se você estiver usando o GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Usando a página de gerenciamento de DNS do seu registrador (a outra aba que você abriu), defina os seguintes registros "MX":

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Observe que NÃO deve haver outros registros MX definidos. Os dois registros mostrados abaixo DEVEM existir. Certifique-se de que não haja erros de digitação e que mx1 e mx2 estejam escritos corretamente. Se já houver registros MX, exclua-os completamente.
O valor "TTL" não precisa ser 3600; pode ser um valor menor ou maior, se necessário.
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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Usando a página de gerenciamento de DNS do seu registrador (a outra aba que você abriu), defina o(s) seguinte(s) registro(s) <strong class="notranslate">TXT</strong>:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se você possui um plano pago, pule esta etapa completamente e vá para a etapa cinco! Se não possui um plano pago, seus endereços encaminhados poderão ser pesquisados publicamente – acesse <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> e atualize seu domínio para um plano pago, se desejar. Se quiser saber mais sobre planos pagos, consulte nossa página de <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Preços</a>. Caso contrário, você pode continuar escolhendo uma ou mais combinações da Opção A à Opção F listadas abaixo.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opção A:
</strong>
<span>
Se você estiver encaminhando todos os e-mails do seu domínio (por exemplo, "all@example.com", "hello@example.com", etc.) para um endereço específico "user@gmail.com":
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
<td><em>"@", "." ou em branco</em></td>
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
Certifique-se de substituir os valores acima na coluna "Valor" pelo seu próprio endereço de e-mail. O valor "TTL" não precisa ser 3600; pode ser um valor menor ou maior, se necessário. Um valor menor de tempo de vida ("TTL") garantirá que quaisquer alterações futuras feitas em seus registros DNS sejam propagadas pela internet mais rapidamente — pense nisso como o tempo que ele permanecerá armazenado em cache na memória (em segundos). Você pode aprender mais sobre <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL na Wikipédia</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opção B:
</strong>
<span>
Se você precisar encaminhar apenas um endereço de e-mail (por exemplo, <code>olá@exemplo.com</code> para <code>usuário@gmail.com</code>; isso também encaminhará "olá+teste@exemplo.com" para "usuário+teste@gmail.com" automaticamente):
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
<td><em>"@", "." ou em branco</em></td>
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
Se você estiver encaminhando vários e-mails, será necessário separá-los com uma vírgula:
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
<td><em>"@", "." ou em branco</em></td>
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
Você pode ter uma quantidade infinita de e-mails de encaminhamento configurados – apenas certifique-se de não ultrapassar 255 caracteres em uma única linha e iniciar cada linha com "forward-email=". Um exemplo é fornecido abaixo:
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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." ou em branco</em></td>
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
Você também pode especificar um nome de domínio no seu registro <strong class="notranslate">TXT</strong> para ter encaminhamento de alias global (por exemplo, "usuário@exemplo.com" será encaminhado para "usuário@exemplo.net"):
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
<td><em>"@", "." ou em branco</em></td>
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
Você pode até usar webhooks como um alias global ou individual para encaminhar e-mails. Veja o exemplo e a seção completa sobre webhooks intitulada <a href="#do-you-support-webhooks" class="alert-link">Vocês oferecem suporte a webhooks</a> abaixo.
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
<td><em>"@", "." ou em branco</em></td>
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
Você pode até usar expressões regulares ("regex") para corresponder aliases e lidar com substituições para encaminhar e-mails. Veja os exemplos e a seção completa sobre regex intitulada <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Você suporta expressões regulares ou regex</a> abaixo.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Precisa de regex avançado com substituição?</strong> Veja os exemplos e a seção completa sobre regex intitulada <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Você oferece suporte a expressões regulares ou regex</a> abaixo.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemplo simples:</strong> Se eu quiser que todos os e-mails que vão para `linus@example.com` ou `torvalds@example.com` sejam encaminhados para `user@gmail.com`:
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
<td><em>"@", "." ou em branco</em></td>
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
As regras de encaminhamento "catch-all" também podem ser descritas como "fall-through".
Isso significa que os e-mails recebidos que correspondem a pelo menos uma regra de encaminhamento específica serão usados em vez da regra "catch-all".
Regras específicas incluem endereços de e-mail e expressões regulares.
<br /><br />
Por exemplo:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
E-mails enviados para <code>hello@example.com</code> **não** serão encaminhados para <code>second@gmail.com</code> (catch-all) com esta configuração e, em vez disso, serão entregues apenas para <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Usando a página de gerenciamento de DNS do seu registrador (a outra aba que você abriu), defina adicionalmente o seguinte registro <strong class="notranslate">TXT</strong>:

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
<td><em>"@", "." ou em branco</em></td>
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
Se você estiver usando o Gmail (por exemplo, Enviar e-mail como) ou o G Suite, precisará adicionar <code>include:_spf.google.com</code> ao valor acima, por exemplo:
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
Se você já tiver uma linha semelhante com "v=spf1", precisará anexar <code>include:spf.forwardemail.net</code> logo antes de qualquer registro "include:host.com" existente e antes de "-all" na mesma linha, por exemplo:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Observe que há uma diferença entre "-all" e "~all". O "-" indica que a verificação do SPF deve FALHAR se não houver correspondência, e "~" indica que a verificação do SPF deve FALHAR SOFTWAIL. Recomendamos usar a abordagem "-all" para evitar falsificação de domínio.
<br /><br />
Você também pode precisar incluir o registro SPF do host de onde está enviando e-mails (por exemplo, Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Verifique seus registros DNS usando nossa ferramenta "Verificar registros" disponível em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configuração.

</li><li class="mb-2 mb-md-3 mb-lg-5">Envie um e-mail de teste para confirmar se funciona. Observe que pode levar algum tempo para que seus registros DNS se propaguem.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
<span>
</span>
Se você não estiver recebendo e-mails de teste ou receber um e-mail de teste que diz "Cuidado com esta mensagem", consulte as respostas para <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Por que não estou recebendo meus e-mails de teste</a> e <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Por que meus e-mails de teste enviados para mim no Gmail estão sendo exibidos como "suspeitos"</a>, respectivamente.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Se você deseja "Enviar e-mail como" do Gmail, será necessário <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">assistir a este vídeo</a></strong> ou seguir as etapas em <a href="#how-to-send-mail-as-using-gmail">How para enviar e-mail como usando o Gmail</a> abaixo.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Parabéns!
</strong>
<span>
Você concluiu todas as etapas com sucesso.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
<span>
Extras opcionais estão listadas abaixo. Observe que essas extensões são totalmente opcionais e podem não ser necessárias. Queríamos, pelo menos, fornecer informações adicionais, se necessário.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Add-on opcional:
</strong>
<span>
Se você estiver usando o recurso <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How para Enviar E-mail Como Usando o Gmail</a>, talvez seja interessante adicionar-se a uma lista de permissões. Consulte <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">estas instruções do Gmail</a> neste tópico.
</span>
</div>

### Posso usar várias trocas e servidores MX para encaminhamento avançado {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Sim, mas **você deve ter apenas uma troca MX listada em seus registros DNS**.

Não tente usar "Prioridade" como uma forma de configurar múltiplas trocas MX.

Em vez disso, você precisa configurar sua troca MX existente para encaminhar e-mails de todos os aliases não correspondentes para as trocas do nosso serviço (`mx1.forwardemail.net` e/ou `mx2.forwardemail.net`).

Se você estiver usando o Google Workspace e quiser encaminhar todos os aliases não correspondentes para o nosso serviço, consulte <https://support.google.com/a/answer/6297084>.

Se você estiver usando o Microsoft 365 (Outlook) e quiser encaminhar todos os aliases não correspondentes para o nosso serviço, consulte <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> e <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Como configuro uma resposta automática de férias (resposta automática de ausência do escritório) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Acesse <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases e crie ou edite o alias para o qual você gostaria de configurar uma resposta automática de férias.

Você pode configurar uma data de início, data de término, assunto e mensagem, além de habilitar ou desabilitar a qualquer momento:

* Assunto e mensagem em texto simples são suportados atualmente (usamos o pacote `striptags` internamente para remover qualquer HTML).
* O assunto é limitado a 100 caracteres.
* A mensagem é limitada a 1000 caracteres.
* A configuração requer configuração de SMTP de saída (por exemplo, você precisará configurar os registros DKIM, DMARC e DNS do caminho de retorno).
* Acesse <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Configuração de SMTP de saída e siga as instruções de configuração.
* A resposta automática de férias não pode ser habilitada em nomes de domínio personalizados globais (por exemplo, [endereços descartáveis](/disposable-addresses) não são suportados).
* O respondedor de férias não pode ser habilitado para aliases com curinga/abrangente (`*`) nem expressões regulares.

Ao contrário de sistemas de e-mail como `postfix` (por exemplo, que usam a extensão de filtro de férias `sieve`) – o Forward Email adiciona automaticamente sua assinatura DKIM, evita problemas de conexão ao enviar respostas de férias (por exemplo, devido a problemas comuns de conexão SSL/TLS e servidores mantidos legados) e ainda oferece suporte a criptografia Open WKD e PGP para respostas de férias.

<!--
* Para evitar abusos, 1 crédito SMTP de saída será deduzido para cada mensagem de resposta automática de férias enviada.
* Todas as contas pagas incluem 300 créditos por dia por padrão. Se precisar de uma quantia maior, entre em contato conosco.
-->

1. Enviamos apenas uma vez por remetente [na lista de permissões](#do-you-have-an-allowlist) a cada 4 dias (o que é semelhante ao comportamento do Gmail).

* Nosso cache Redis usa uma impressão digital de `alias_id` e `sender`, enquanto `alias_id` é o alias do ID do MongoDB e `sender` é o endereço De (se estiver na lista de permissões) ou o domínio raiz no endereço De (se não estiver na lista de permissões). Para simplificar, a expiração dessa impressão digital no cache é definida como 4 dias.

* Nossa abordagem de usar o domínio raiz analisado no endereço De para remetentes não permitidos evita que remetentes relativamente desconhecidos (por exemplo, agentes mal-intencionados) inundem mensagens de resposta de férias.

2. Enviamos somente quando o MAIL FROM e/ou From não estiver em branco e não contiver (sem distinção de maiúsculas e minúsculas) um [nome de usuário do postmaster](#what-are-postmaster-addresses) (a parte antes do @ em um e-mail).

3. Não enviaremos se a mensagem original tiver algum dos seguintes cabeçalhos (sem distinção de maiúsculas e minúsculas):

* Cabeçalho de `auto-submitted` com valor diferente de `no`.
* Cabeçalho de `x-auto-response-suppress` com valor de `dr`, `autoreply`, `auto-reply`, `auto_reply` ou `all`
* Cabeçalho de `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` ou `x-auto-respond` (independentemente do valor).
* Cabeçalho de `precedence` com valor de `bulk`, `autoreply`, `auto-reply`, `auto_reply` ou `list`.

4. Não enviaremos se o endereço de e-mail MAIL FROM ou From terminar com `+donotreply`, `-donotreply`, `+noreply` ou `-noreply`.

5. Não enviaremos se a parte do nome de usuário do endereço de e-mail De for `mdaemon` e tiver um cabeçalho que não diferencia maiúsculas de minúsculas de `X-MDDSN-Message`.

6. Não enviaremos se houver um cabeçalho `content-type` sem distinção entre maiúsculas e minúsculas de `multipart/report`.

### Como configuro o SPF para encaminhamento de e-mail {#how-do-i-set-up-spf-for-forward-email}

Usando a página de gerenciamento de DNS do seu registrador, defina o seguinte registro <strong class="notranslate">TXT</strong>:

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
<td><em>"@", "." ou em branco</em></td>
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
Se você estiver usando o Gmail (por exemplo, Enviar e-mail como) ou o G Suite, precisará adicionar <code>include:_spf.google.com</code> ao valor acima, por exemplo:
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
Se estiver usando o Microsoft Outlook ou o Live.com, você precisará anexar <code>include:spf.protection.outlook.com</code> ao seu registro SPF <strong class="notranslate">TXT</strong>, por exemplo:
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
Se você já tiver uma linha semelhante com "v=spf1", precisará anexar <code>include:spf.forwardemail.net</code> logo antes de qualquer registro "include:host.com" existente e antes de "-all" na mesma linha, por exemplo:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Observe que há uma diferença entre "-all" e "~all". O "-" indica que a verificação do SPF deve FALHAR se não houver correspondência, e "~" indica que a verificação do SPF deve FALHAR SOFTWAIL. Recomendamos usar a abordagem "-all" para evitar falsificação de domínio.
<br /><br />
Você também pode precisar incluir o registro SPF do host de onde está enviando e-mails (por exemplo, Outlook).
</span>
</div>

### Como configuro o DKIM para encaminhamento de e-mail {#how-do-i-set-up-dkim-for-forward-email}

Acesse <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Configuração de SMTP de saída e siga as instruções de configuração.

### Como configuro o DMARC para encaminhamento de e-mail {#how-do-i-set-up-dmarc-for-forward-email}

Acesse <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Configuração de SMTP de saída e siga as instruções de configuração.

### Como conecto e configuro meus contatos {#how-do-i-connect-and-configure-my-contacts}

**Para configurar seus contatos, use a URL do CardDAV de:** `https://carddav.forwardemail.net` (ou simplesmente `carddav.forwardemail.net` se seu cliente permitir)

### Como conecto e configuro meus calendários {#how-do-i-connect-and-configure-my-calendars}

**Para configurar seu calendário, use a URL CalDAV de:** `https://caldav.forwardemail.net` (ou simplesmente `caldav.forwardemail.net` se seu cliente permitir)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Exemplo de configuração do calendário de encaminhamento de e-mail CalDAV Thunderbird" />

### Como adiciono mais calendários e gerencio os existentes {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Se você quiser adicionar calendários adicionais, basta adicionar uma nova URL de calendário: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**certifique-se de substituir `calendar-name` pelo nome do calendário desejado**)

Você pode alterar o nome e a cor de um calendário após a criação – basta usar seu aplicativo de calendário preferido (por exemplo, Apple Mail ou [Pássaro Trovão](https://thunderbird.net)).

### Como configuro o SRS para encaminhamento de e-mail {#how-do-i-set-up-srs-for-forward-email}

Configuramos automaticamente [Esquema de Reescrita do Remetente](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – você não precisa fazer isso sozinho.

### Como configuro o MTA-STS para encaminhamento de e-mail {#how-do-i-set-up-mta-sts-for-forward-email}

Consulte [nossa seção sobre MTA-STS](#do-you-support-mta-sts) para obter mais informações.

### Como adiciono uma foto de perfil ao meu endereço de e-mail {#how-do-i-add-a-profile-picture-to-my-email-address}

Se você estiver usando o Gmail, siga estas etapas abaixo:

1. Acesse <https://google.com> e saia de todas as contas de e-mail.
2. Clique em "Entrar" e, no menu suspenso, clique em "outra conta".
3. Selecione "Usar outra conta".
4. Selecione "Criar conta".
5. Selecione "Usar meu endereço de e-mail atual".
6. Insira o endereço de e-mail do seu domínio personalizado.
7. Recupere o e-mail de verificação enviado para o seu endereço de e-mail.
8. Insira o código de verificação deste e-mail.
9. Preencha as informações de perfil da sua nova conta do Google.
10. Concorde com todas as políticas de Privacidade e Termos de Uso.
11. Acesse <https://google.com> e, no canto superior direito, clique no ícone do seu perfil e no botão "alterar".
12. Carregue uma nova foto ou avatar para sua conta.
13. As alterações levarão aproximadamente de 1 a 2 horas para serem aplicadas, mas às vezes podem ser muito rápidas.
14. Envie um e-mail de teste e a foto do perfil deverá aparecer.

## Recursos avançados {#advanced-features}

### Você oferece suporte a boletins informativos ou listas de e-mail para e-mail relacionado a marketing {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Sim, você pode ler mais em <https://forwardemail.net/guides/newsletter-with-listmonk>.

Observe que, para manter a reputação do IP e garantir a entregabilidade, o Forward Email possui um processo de revisão manual por domínio para **aprovação de newsletters**. Envie um e-mail para <support@forwardemail.net> ou abra um [pedido de ajuda](https://forwardemail.net/help) para aprovação. Isso normalmente leva menos de 24 horas, com a maioria das solicitações sendo atendidas em 1 a 2 horas. Em um futuro próximo, pretendemos tornar esse processo instantâneo com controles e alertas de spam adicionais. Esse processo garante que seus e-mails cheguem à caixa de entrada e que suas mensagens não sejam marcadas como spam.

### Você oferece suporte ao envio de e-mail com a API {#do-you-support-sending-email-with-api}

Sim, a partir de maio de 2023 oferecemos suporte ao envio de e-mail com API como um complemento para todos os usuários pagos.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Leia nossos <a href="/terms" class="alert-link" target="_blank">Termos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidade</a> e <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites de SMTP de Saída</a> — seu uso é considerado reconhecimento e concordância.
</span>
</div>

Consulte nossa seção sobre [E-mails](/email-api#outbound-emails) na documentação da API para obter opções, exemplos e mais informações.

Para enviar e-mails de saída com nossa API, você deve usar seu token de API disponível em [Minha Segurança](/my-account/security).

### Você oferece suporte para receber e-mails com IMAP {#do-you-support-receiving-email-with-imap}

Sim, desde 16 de outubro de 2023, oferecemos suporte ao recebimento de e-mails via IMAP como um complemento para todos os usuários pagos. **Leia nosso artigo detalhado** sobre [como funciona nosso recurso de armazenamento de caixa de correio SQLite criptografado](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Certifique-se de ler nossos <a href="/terms" class="alert-link" target="_blank">Termos</a> e <a href="/privacy" class="alert-link" target="_blank">Política de Privacidade</a> — seu uso é considerado reconhecimento e concordância.
</span>
</div>

1. Crie um novo alias para seu domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (por exemplo, <code><hello@example.com></code>)

2. Clique em <strong class="text-success"><i class="fa fa-key"></i>Gerar Senha</strong> ao lado do alias recém-criado. Copie para a sua área de transferência e armazene com segurança a senha gerada, exibida na tela.

3. Usando seu aplicativo de e-mail preferido, adicione ou configure uma conta com o alias recém-criado (por exemplo, <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
<span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, ou <a href="/blog/open-source" class="alert-link" target="_blank">uma alternativa de código aberto e focada na privacidade</a>.</span>
</div>

4. Quando solicitado o nome do servidor IMAP, digite `imap.forwardemail.net`

5. Quando solicitado a porta do servidor IMAP, digite `993` (SSL/TLS) – veja [portas IMAP alternativas](/faq#what-are-your-imap-server-configuration-settings) se necessário.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
<span>Se você estiver usando o Thunderbird, certifique-se de que a "Segurança da conexão" esteja definida como "SSL/TLS" e o Método de autenticação esteja definido como "Senha normal".</span>
</div>

6. Quando for solicitada a senha do servidor IMAP, cole a senha de <strong class="text-success"><i class="fa fa-key"></i> Gerar senha</strong> na etapa 2 acima

7. **Salve suas configurações** – se estiver com problemas, entre em contato conosco.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Parabéns!
</strong>
<span>
Você concluiu todas as etapas com sucesso.
</span>
</div>
</div>

</div>

### Você oferece suporte a POP3 {#do-you-support-pop3}

Sim, desde 4 de dezembro de 2023, oferecemos suporte ao [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) como um complemento para todos os usuários pagos. **Leia nosso artigo detalhado** sobre [como funciona nosso recurso de armazenamento de caixa de correio SQLite criptografado](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="instruções-pop3">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Certifique-se de ler nossos <a href="/terms" class="alert-link" target="_blank">Termos</a> e <a href="/privacy" class="alert-link" target="_blank">Política de Privacidade</a> — seu uso é considerado reconhecimento e concordância.
</span>
</div>

1. Crie um novo alias para seu domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (por exemplo, <code><hello@example.com></code>)

2. Clique em <strong class="text-success"><i class="fa fa-key"></i>Gerar Senha</strong> ao lado do alias recém-criado. Copie para a sua área de transferência e armazene com segurança a senha gerada, exibida na tela.

3. Usando seu aplicativo de e-mail preferido, adicione ou configure uma conta com o alias recém-criado (por exemplo, <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
<span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, ou <a href="/blog/open-source" class="alert-link" target="_blank">uma alternativa de código aberto e focada na privacidade</a>.</span>
</div>

4. Quando solicitado o nome do servidor POP3, digite `pop3.forwardemail.net`

5. Quando solicitado a porta do servidor POP3, digite `995` (SSL/TLS) – veja [portas POP3 alternativas](/faq#what-are-your-pop3-server-configuration-settings) se necessário.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
<span>Se você estiver usando o Thunderbird, certifique-se de que a "Segurança da conexão" esteja definida como "SSL/TLS" e o Método de autenticação esteja definido como "Senha normal".</span>
</div>

6. Quando for solicitada a senha do servidor POP3, cole a senha de <strong class="text-success"><i class="fa fa-key"></i> Gerar senha</strong> na etapa 2 acima

7. **Salve suas configurações** – se estiver com problemas, entre em contato conosco.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Parabéns!
</strong>
<span>
Você concluiu todas as etapas com sucesso.
</span>
</div>
</div>

</div>

### Você oferece suporte a calendários (CalDAV) {#do-you-support-calendars-caldav}

Sim, adicionamos esse recurso desde 5 de fevereiro de 2024. Nosso servidor é `caldav.forwardemail.net` e também é monitorado em nossa <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de status</a>.

Ele suporta IPv4 e IPv6 e está disponível na porta `443` (HTTPS).

| Conecte-se | Exemplo | Descrição |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome de usuário | `user@example.com` | Endereço de e-mail de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>. |
| Senha | `************************` | Senha gerada específica do alias. |

Para usar o suporte de calendário, o **usuário** deve ser o endereço de e-mail de um alias existente para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> – e a **senha** deve ser uma senha gerada específica do alias.

### Você oferece suporte a contatos (CardDAV) {#do-you-support-contacts-carddav}

Sim, adicionamos esse recurso desde 12 de junho de 2025. Nosso servidor é `carddav.forwardemail.net` e também é monitorado em nossa <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de status</a>.

Ele suporta IPv4 e IPv6 e está disponível na porta `443` (HTTPS).

| Conecte-se | Exemplo | Descrição |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome de usuário | `user@example.com` | Endereço de e-mail de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>. |
| Senha | `************************` | Senha gerada específica do alias. |

Para usar o suporte de contatos, o **usuário** deve ser o endereço de e-mail de um alias existente para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> – e a **senha** deve ser uma senha gerada específica do alias.

### Você oferece suporte para envio de e-mail com SMTP {#do-you-support-sending-email-with-smtp}

Sim, a partir de maio de 2023 oferecemos suporte ao envio de e-mail com SMTP como um complemento para todos os usuários pagos.

<div id="instruções-smtp">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Leia nossos <a href="/terms" class="alert-link" target="_blank">Termos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidade</a> e <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites de SMTP de Saída</a> — seu uso é considerado reconhecimento e concordância.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se você usa o Gmail, consulte nosso guia <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Enviar e-mails como no Gmail</a>. Se você é um desenvolvedor, consulte nossa <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentação da API de e-mail</a>.
</span>
</div>

1. Acesse <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações <i class="fa fa-angle-right"></i> Configuração de SMTP de Saída e siga as instruções de configuração

2. Crie um novo alias para seu domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (por exemplo, <code><hello@example.com></code>)

3. Clique em <strong class="text-success"><i class="fa fa-key"></i>Gerar Senha</strong> ao lado do alias recém-criado. Copie para a sua área de transferência e armazene com segurança a senha gerada, exibida na tela.

4. Usando seu aplicativo de e-mail preferido, adicione ou configure uma conta com o alias recém-criado (por exemplo, <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
<span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, ou <a href="/blog/open-source" class="alert-link" target="_blank">uma alternativa de código aberto e focada na privacidade</a>.</span>
</div>

5. Quando solicitado o nome do servidor SMTP, digite `smtp.forwardemail.net`

6. Quando solicitado a porta do servidor SMTP, digite `465` (SSL/TLS) – veja [portas SMTP alternativas](/faq#what-are-your-smtp-server-configuration-settings) se necessário.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
<span>Se você estiver usando o Thunderbird, certifique-se de que a "Segurança da conexão" esteja definida como "SSL/TLS" e o Método de autenticação esteja definido como "Senha normal".</span>
</div>

7. Quando for solicitada a senha do servidor SMTP, cole a senha de <strong class="text-success"><i class="fa fa-key"></i> Gerar senha</strong> na etapa 3 acima

8. **Salve suas configurações e envie seu primeiro e-mail de teste** – se estiver com problemas, <a href="/help">entre em contato conosco</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Observe que, para manter a reputação do IP e garantir a entregabilidade, temos um processo de revisão manual por domínio para aprovação de SMTP de saída. Isso normalmente leva menos de 24 horas, com a maioria das solicitações sendo atendidas em 1 a 2 horas. Em um futuro próximo, pretendemos tornar esse processo instantâneo com controles e alertas de spam adicionais. Esse processo garante que seus e-mails cheguem à caixa de entrada e que suas mensagens não sejam marcadas como spam.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Parabéns!
</strong>
<span>
Você concluiu todas as etapas com sucesso.
</span>
</div>
</div>

</div>

### Você oferece suporte a OpenPGP/MIME, criptografia de ponta a ponta ("E2EE") e Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Sim, oferecemos suporte a [PGP aberto](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [criptografia de ponta a ponta ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) e à descoberta de chaves públicas usando [Diretório de chaves da Web ("WKD")](https://wiki.gnupg.org/WKD). Você pode configurar o OpenPGP usando [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) ou [hospede suas próprias chaves](https://wiki.gnupg.org/WKDHosting) (consulte [este essencial para configuração do servidor WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* As pesquisas WKD são armazenadas em cache por 1 hora para garantir a entrega pontual dos e-mails → portanto, se você adicionar, alterar ou remover sua chave WKD, envie um e-mail para `support@forwardemail.net` com seu endereço de e-mail para que possamos limpar o cache manualmente.
* Oferecemos suporte à criptografia PGP para mensagens encaminhadas por meio de pesquisa WKD ou usando uma chave PGP carregada em nossa interface.
* As chaves carregadas têm precedência desde que a caixa de seleção PGP esteja habilitada/marcada.
* As mensagens enviadas para webhooks não são criptografadas com PGP no momento.
* Se você tiver vários aliases correspondentes a um determinado endereço de encaminhamento (por exemplo, regex/curinga/combinação exata) e se mais de um deles contiver uma chave PGP carregada e tiver PGP marcado → enviaremos um e-mail de alerta de erro e não criptografaremos a mensagem com sua chave PGP carregada. Isso é muito raro e geralmente se aplica apenas a usuários avançados com regras de alias complexas.
* **A criptografia PGP não será aplicada ao encaminhamento de e-mails por meio de nossos servidores MX se o remetente tiver uma política de rejeição DMARC. Se você precisar de criptografia PGP em *todos* os e-mails, sugerimos usar nosso serviço IMAP e configurar sua chave PGP para o alias dos e-mails recebidos.**

**Você pode validar sua configuração do Web Key Directory em <https://wkd.chimbosonic.com/> (código aberto) ou <https://www.webkeydirectory.com/> (proprietário).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Criptografia Automática:
</strong>
<span>Se você estiver usando nosso <a href="#do-you-support-sending-email-with-smtp" class="alert-link">serviço SMTP de saída</a> e enviando mensagens não criptografadas, tentaremos criptografar automaticamente as mensagens por destinatário usando o <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Você deve seguir todos os passos a seguir para habilitar o OpenPGP para o seu nome de domínio personalizado.
</span>
</div>

1. Baixe e instale o plugin recomendado do seu cliente de e-mail abaixo:

| Cliente de e-mail | Plataforma | Plugin recomendado | Notas |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pássaro Trovão | Área de trabalho | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | O Thunderbird tem suporte integrado para OpenPGP. |
| Gmail | Navegador | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licença proprietária) | O Gmail não oferece suporte ao OpenPGP, mas você pode baixar o plugin de código aberto [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Correio da Apple | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | O Apple Mail não oferece suporte ao OpenPGP, mas você pode baixar o plugin de código aberto [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Correio da Apple | iOS | [PGPro](https://github.com/opensourceios/PGPro/) ou [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (licença proprietária) | O Apple Mail não oferece suporte ao OpenPGP, mas você pode baixar o plugin de código aberto [PGPro](https://github.com/opensourceios/PGPro/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Panorama | Windows | [gpg4win](https://www.gpg4win.de/index.html) | O cliente de e-mail de desktop do Outlook não oferece suporte ao OpenPGP, mas você pode baixar o plugin de código aberto [gpg4win](https://www.gpg4win.de/index.html). |
| Panorama | Navegador | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licença proprietária) | O cliente de e-mail baseado na Web do Outlook não oferece suporte ao OpenPGP. No entanto, você pode baixar o plugin de código aberto [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Andróide | Móvel | [OpenKeychain](https://www.openkeychain.org/) ou [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients), como [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) e [FairEmail](https://github.com/M66B/FairEmail), suportam o plugin de código aberto [OpenKeychain](https://www.openkeychain.org/). Você também pode usar o plugin de código aberto (licença proprietária) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Navegador | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licença proprietária) | Você pode baixar a extensão de navegador de código aberto [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Mozilla Firefox | Navegador | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licença proprietária) | Você pode baixar a extensão de navegador de código aberto [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Navegador | [Mailvelope](https://mailvelope.com/) | Você pode baixar a extensão de navegador de código aberto [Mailvelope](https://mailvelope.com/). |
| Corajoso | Navegador | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licença proprietária) | Você pode baixar a extensão de navegador de código aberto [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Balsa | Área de trabalho | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | O Balsa tem suporte integrado para OpenPGP. |
| KMail | Área de trabalho | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | O KMail tem suporte integrado para OpenPGP. |
| Evolução do GNOME | Área de trabalho | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | O GNOME Evolution tem suporte integrado para OpenPGP. |
| terminal | Área de trabalho | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Você pode usar o [gpg command line tool](https://www.gnupg.org/download/) de código aberto para gerar uma nova chave a partir da linha de comando. |

2. Abra o plugin, crie sua chave pública e configure seu cliente de e-mail para usá-la.

3. Carregue sua chave pública em <https://keys.openpgp.org/upload>.

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
Add-on opcional:
</strong>
<span>
Se você estiver usando nosso serviço de <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">armazenamento criptografado (IMAP/POP3)</a> e quiser que <i>todos</i> os e-mails armazenados em seu banco de dados SQLite (já criptografado) sejam criptografados com sua chave pública, acesse <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases (por exemplo, <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Edite o <i class="fa fa-angle-right"></i> OpenPGP e envie sua chave pública.
</span>
</div>

4. Adicione um novo registro `CNAME` ao seu nome de domínio (por exemplo, `example.com`):

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
<span>Se o seu alias estiver usando nossos <a class="alert-link" href="/disposable-addresses" target="_blank">domínios personalizados/descartáveis</a> (por exemplo, <code>hideaddress.net</code>), você pode pular esta etapa.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Parabéns!
</strong>
<span>
Você concluiu todas as etapas com sucesso.
</span>
</div>
</div>

### Você oferece suporte ao MTA-STS {#do-you-support-mta-sts}

Sim, desde 2 de março de 2023 oferecemos suporte a [MTA-STS](https://www.hardenize.com/blog/mta-sts). Você pode usar [este modelo](https://github.com/jpawlowski/mta-sts.template) se desejar habilitá-lo em seu domínio.

Nossa configuração pode ser encontrada publicamente no GitHub em <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Você oferece suporte a chaves de acesso e WebAuthn {#do-you-support-passkeys-and-webauthn}

Sim! Desde 13 de dezembro de 2023, adicionamos suporte para as chaves de acesso [devido à alta demanda](https://github.com/orgs/forwardemail/discussions/182).

As chaves de acesso permitem que você faça login com segurança sem precisar de senha e autenticação de dois fatores.

Você pode validar sua identidade com toque, reconhecimento facial, senha baseada no dispositivo ou PIN.

Permitimos que você gerencie até 30 chaves de acesso simultaneamente, para que você possa fazer login em todos os seus dispositivos com facilidade.

Saiba mais sobre chaves de acesso nos seguintes links:

* [Entre em seus aplicativos e sites com senhas](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Use senhas para fazer login em aplicativos e sites no iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Artigo da Wikipédia sobre chaves de acesso](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Você oferece suporte às práticas recomendadas de e-mail {#do-you-support-email-best-practices}

Sim. Temos suporte integrado para SPF, DKIM, DMARC, ARC e SRS em todos os planos. Também trabalhamos extensivamente com os autores originais destas especificações e outros especialistas em e-mail para garantir perfeição e alta entregabilidade.

### Você oferece suporte a webhooks de rejeição {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
Procurando documentação sobre webhooks de e-mail? Consulte <a href="/faq#do-you-support-webhooks" class="alert-link">Vocês oferecem suporte a webhooks?</a> para mais informações.
<span>
</span>
</div>

Sim, adicionamos esse recurso desde 14 de agosto de 2024. Agora você pode acessar Minha Conta → Domínios → Configurações → URL do Webhook de Rejeição e configurar uma URL `http://` ou `https://` para a qual enviaremos uma solicitação `POST` sempre que e-mails SMTP de saída forem rejeitados.

Isso é útil para você gerenciar e monitorar seu SMTP de saída – e pode ser usado para manter assinantes, cancelar a assinatura e detectar quando ocorrerem rejeições.

As cargas úteis do webhook de rejeição são enviadas como JSON com estas propriedades:

* `email_id` (String) - ID de e-mail que corresponde a um e-mail em Minha Conta → E-mails (SMTP de saída)
* `list_id` (String) - o valor do cabeçalho `List-ID` (sem distinção entre maiúsculas e minúsculas), se houver, do e-mail de saída original
* `list_unsubscribe` (String) - o valor do cabeçalho `List-Unsubscribe` (sem distinção entre maiúsculas e minúsculas), se houver, do e-mail de saída original
* `feedback_id` (String) - o valor do cabeçalho `Feedback-ID` (sem distinção entre maiúsculas e minúsculas), se houver, do e-mail de saída original
* `recipient` (String) - o endereço de e-mail do destinatário que foi devolvido ou apresentou erro
* `message` (String) - uma mensagem de erro detalhada para o caso de devolução
* `response` (String) - a mensagem de resposta SMTP
* `response_code` (Número) - o código de resposta SMTP analisado
* `truth_source` (String) - se o código de resposta for de uma fonte confiável, este valor será preenchido com o nome do domínio raiz (por exemplo, `google.com` ou `yahoo.com`)
* `bounce` (Objeto) - um objeto que contém o seguintes propriedades que detalham o status de rejeição e rejeição
* `action` (String) - ação de rejeição (ex.: `"reject"`)
* `message` (String) - motivo da rejeição (ex.: `"Message Sender Blocked By Receiving Server"`)
* `category` (String) - categoria da rejeição (ex.: `"block"`)
* `code` (Número) - código de status da rejeição (ex.: `554`)
* `status` (String) - código de rejeição da mensagem de resposta (ex.: `5.7.1`)
* `line` (Número) - número da linha analisada, se houver, [da lista de análise de rejeição Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (ex.: `526`)
* `headers` (Objeto) - par de valores-chave dos cabeçalhos para o e-mail de saída
* `bounced_at` (String) - data formatada em [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) para quando ocorreu o erro de rejeição

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

Aqui estão algumas notas adicionais sobre webhooks de rejeição:

* Se o payload do webhook contiver um valor `list_id`, `list_unsubscribe` ou `feedback_id`, você deverá tomar as medidas adequadas para remover o `recipient` da lista, se necessário.
* Se o valor `bounce.category` for um `"block"`, `"recipient"`, `"spam"` ou `"virus"`, você deverá remover o usuário da lista.
* Se precisar verificar os payloads do webhook (para garantir que eles realmente vêm do nosso servidor), você pode usar [resolver o endereço IP do cliente remoto nome do host do cliente usando uma pesquisa reversa](https://nodejs.org/api/dns.html#dnspromisesreverseip) – deve ser `smtp.forwardemail.net`.
* Você também pode verificar o IP em [nossos endereços IP publicados](#what-are-your-servers-ip-addresses).
* Acesse Minha Conta → Domínios → Configurações → Chave de Verificação do Payload da Assinatura do Webhook para obter sua chave do webhook.
* Você pode rotacionar esta chave a qualquer momento por motivos de segurança.
* Calcule e compare o valor `X-Webhook-Signature` da nossa solicitação do webhook com o valor do corpo calculado usando esta chave. Um exemplo de como fazer isso está disponível em [esta postagem do Stack Overflow](https://stackoverflow.com/a/68885281).
* Consulte a discussão em <https://github.com/forwardemail/free-email-forwarding/issues/235> para mais informações.
* Aguardaremos até `5` segundos para que o endpoint do seu webhook responda com um código de status `200` e tentaremos novamente até `1` vez.
* Se detectarmos que o URL do seu webhook de rejeição apresenta um erro enquanto tentamos enviar uma solicitação, enviaremos um e-mail de cortesia uma vez por semana.

### Você oferece suporte a webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
Procurando documentação sobre webhooks de rejeição? Consulte <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Vocês oferecem suporte a webhooks de rejeição?</a> para mais informações.
<span>
</span>
</div>

Sim, adicionamos esse recurso desde 15 de maio de 2020. Você pode simplesmente adicionar webhook(s) exatamente como faria com qualquer destinatário! Certifique-se de ter o protocolo "http" ou "https" prefixado na URL do webhook.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Proteção de Privacidade Aprimorada:
</strong>
<span>
Se você possui um plano pago (que oferece proteção de privacidade aprimorada), acesse <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> e clique em "Aliases" ao lado do seu domínio para configurar seus webhooks. Se quiser saber mais sobre planos pagos, consulte nossa página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preços</a>. Caso contrário, você pode continuar seguindo as instruções abaixo.
</span>
</div>

Se você estiver no plano gratuito, basta adicionar um novo registro DNS <strong class="notranslate">TXT</strong>, conforme mostrado abaixo:

Por exemplo, se eu quiser que todos os e-mails que vão para `alias@example.com` sejam encaminhados para um novo ponto de extremidade de teste [solicitação de lixeira](https://requestbin.com/r/en8pfhdgcculn?inspect):

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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Ou talvez você queira que todos os e-mails que vão para `example.com` sejam encaminhados para este ponto de extremidade:

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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Aqui estão algumas notas adicionais sobre webhooks:**

* Se precisar verificar os payloads do webhook (para garantir que eles realmente vêm do nosso servidor), você pode usar [resolver o endereço IP do cliente remoto nome do host do cliente usando uma pesquisa reversa](https://nodejs.org/api/dns.html#dnspromisesreverseip) – deve ser `mx1.forwardemail.net` ou `mx2.forwardemail.net`.
* Você também pode verificar o IP em [nossos endereços IP publicados](#what-are-your-servers-ip-addresses).
* Se você tiver um plano pago, acesse Minha Conta → Domínios → Configurações → Chave de Verificação do Payload da Assinatura do Webhook para obter sua chave do webhook.
* Você pode rotacionar esta chave a qualquer momento por motivos de segurança.
* Calcule e compare o valor `X-Webhook-Signature` da nossa solicitação de webhook com o valor do corpo calculado usando esta chave. Um exemplo de como fazer isso está disponível em [esta postagem do Stack Overflow](https://stackoverflow.com/a/68885281).
* Veja a discussão em <https://github.com/forwardemail/free-email-forwarding/issues/235> para mais informações.
* Se um webhook não responder com um código de status `200`, armazenaremos sua resposta em [log de erros criado](#do-you-store-error-logs) – o que é útil para depuração.
* As solicitações HTTP do webhook serão repetidas até 3 vezes a cada tentativa de conexão SMTP, com um tempo limite máximo de 60 segundos por solicitação POST do endpoint. **Observe que isso não significa que ele tentará apenas 3 vezes**; na verdade, ele tentará continuamente ao longo do tempo, enviando um código SMTP 421 (que indica ao remetente para tentar novamente mais tarde) após a terceira tentativa de solicitação HTTP POST com falha. Isso significa que o e-mail tentará novamente continuamente por dias até que um código de status 200 seja alcançado.
* Tentaremos novamente automaticamente com base no status padrão e nos códigos de erro usados em [método de repetição do superagente](https://ladjs.github.io/superagent/#retrying-requests) (somos mantenedores).
* Agrupamos as solicitações HTTP do webhook para o mesmo endpoint em uma única solicitação (em vez de várias) para economizar recursos e acelerar o tempo de resposta. Por exemplo, se você enviar um e-mail para <webhook1@example.com>, <webhook2@example.com> e <webhook3@example.com>, e todos eles estiverem configurados para acessar a mesma URL de endpoint *exata*, apenas uma solicitação será feita. Agrupamos por correspondência exata de endpoint com igualdade estrita.
* Observe que usamos o método "simpleParser" da biblioteca [analisador de correio](https://nodemailer.com/extras/mailparser/) para analisar a mensagem em um objeto JSON compatível.
* O valor bruto do e-mail como uma String é fornecido como a propriedade "raw".
* Os resultados da autenticação são fornecidos como propriedades "dkim", "spf", "arc", "dmarc" e "bimi".

* Os cabeçalhos de e-mail analisados são fornecidos como a propriedade "headers" – mas observe também que você pode usar "headerLines" para facilitar a iteração e a análise.
* Os destinatários agrupados para este webhook são agrupados e fornecidos como a propriedade "recipients".
* As informações da sessão SMTP são fornecidas como a propriedade "session". Ela contém informações sobre o remetente da mensagem, o horário de chegada da mensagem, o HELO e o nome do host do cliente. O valor do nome do host do cliente como `session.clientHostname` é o FQDN (de uma consulta PTR reversa) ou é `session.remoteAddress` entre colchetes (por exemplo, `"[127.0.0.1]"`).

* Se precisar de uma maneira rápida de obter o valor de `X-Original-To`, você pode usar o valor de `session.recipient` (veja o exemplo abaixo). O cabeçalho `X-Original-To` é um cabeçalho que adicionamos às mensagens para depuração com o destinatário original (antes do encaminhamento mascarado) da mensagem.
* Se precisar remover as propriedades `attachments` e/ou `raw` do corpo do payload, basta adicionar `?attachments=false`, `?raw=false` ou `?attachments=false&raw=false` ao seu endpoint de webhook como um parâmetro de querystring (por exemplo, `https://example.com/webhook?attachments=false&raw=false`).
* Se houver anexos, eles serão anexados ao array `attachments` com valores de Buffer. Você pode analisá-los novamente no conteúdo usando uma abordagem com JavaScript como:

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
Dica:
</strong>
Curioso para saber como é a solicitação de webhook em e-mails encaminhados? Incluímos um exemplo abaixo para você!
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

### Você oferece suporte a expressões regulares ou regex {#do-you-support-regular-expressions-or-regex}

Sim, adicionamos esse recurso desde 27 de setembro de 2021. Você pode simplesmente escrever expressões regulares ("regex") para corresponder aliases e realizar substituições.

Aliases suportados por expressões regulares são aqueles que começam com `/` e terminam com `/` e seus destinatários são endereços de e-mail ou webhooks. Os destinatários também podem incluir suporte para substituição de expressões regulares (por exemplo, `$1`, `$2`).

Suportamos dois sinalizadores de expressão regular, incluindo `i` e `g`. O sinalizador `i`, que não diferencia maiúsculas de minúsculas, é um padrão permanente e sempre aplicado. O sinalizador global `g` pode ser adicionado por você, substituindo a terminação `/` por `/g`.

Observe que também oferecemos suporte ao nosso <a href="#can-i-disable-specific-aliases">disabled recurso de alias</a> para a parte do destinatário com nosso suporte a regex.

Expressões regulares não são suportadas em <a href="/disposable-addresses" target="_blank">domínios personalizados globais</a> (pois isso pode ser uma vulnerabilidade de segurança).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Proteção de Privacidade Aprimorada:
</strong>
<span>
Se você possui um plano pago (que oferece proteção de privacidade aprimorada), acesse <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> e clique em "Aliases" ao lado do seu domínio para configurar expressões regulares. Se quiser saber mais sobre planos pagos, consulte nossa página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preços</a>. Caso contrário, você pode continuar seguindo as instruções abaixo.
</span>
</div>

Se você estiver no plano gratuito, basta adicionar um novo registro DNS <strong class="notranslate">TXT</strong> usando um ou mais dos exemplos fornecidos abaixo:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemplo simples:</strong> Se eu quiser que todos os e-mails que vão para `linus@example.com` ou `torvalds@example.com` sejam encaminhados para `user@gmail.com`:
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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemplo de Substituição de Nome Sobrenome:</strong> Imagine que todos os endereços de e-mail da sua empresa sigam o padrão `firstname.lastname@example.com`. Se eu quiser que todos os e-mails que seguem o padrão `firstname.lastname@example.com` sejam encaminhados para `firstname.lastname@company.com` com suporte para substituição (<a href="https://regexr.com/66hnu" class="alert-link">ver teste no RegExr</a>):
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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemplo de Substituição de Filtragem de Símbolos de Mais:</strong> Se eu quiser que todos os e-mails que vão para `info@example.com` ou `support@example.com` sejam encaminhados para `user+info@gmail.com` ou `user+support@gmail.com`, respectivamente (com suporte para substituição) (<a href="https://regexr.com/66ho7" class="alert-link">ver teste em RegExr</a>):
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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemplo de Substituição de Querystring de Webhook:</strong> Talvez você queira que todos os e-mails que vão para `example.com` vão para um <a href="#do-you-support-webhooks" class="alert-link">webhook</a> e tenham uma chave de querystring dinâmica "to" com um valor da parte do nome de usuário do endereço de e-mail (<a href="https://regexr.com/66ho4" class="alert-link">ver teste no RegExr</a>):
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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemplo de rejeição silenciosa:</strong> Se você deseja que todos os e-mails que correspondem a um determinado padrão sejam desativados e rejeitados silenciosamente (parece ao remetente que a mensagem foi enviada com sucesso, mas na verdade não leva a lugar nenhum) com o código de status `250` (consulte <a href="#can-i-disable-specific-aliases" class="alert-link">Posso desativar aliases específicos</a>), basta usar a mesma abordagem com um único ponto de exclamação "!". Isso indica ao remetente que a mensagem foi entregue com sucesso, mas na verdade não levou a lugar nenhum (por exemplo, blackhole ou `/dev/null`).
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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemplo de rejeição suave:</strong> Se você deseja que todos os e-mails que correspondem a um determinado padrão sejam desativados e rejeitados suavemente com o código de status `421` (consulte <a href="#can-i-disable-specific-aliases" class="alert-link">Posso desativar aliases específicos</a>), basta usar a mesma abordagem com um ponto de exclamação duplo "!!". Isso indica ao remetente para tentar enviar o e-mail novamente, e os e-mails para esse alias serão tentados novamente por aproximadamente 5 dias e, em seguida, rejeitados permanentemente.
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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemplo de rejeição total:</strong> Se você deseja que todos os e-mails que correspondem a um determinado padrão sejam desabilitados e rejeitados com o código de status `550` (consulte <a href="#can-i-disable-specific-aliases" class="alert-link">Posso desabilitar aliases específicos</a>), basta usar a mesma abordagem com um ponto de exclamação triplo "!!!". Isso indica ao remetente um erro permanente e que os e-mails não serão tentados novamente, sendo rejeitados para este alias.
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
<td><em>"@", "." ou em branco</em></td>
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
Quer saber como escrever uma expressão regular ou precisa testar sua substituta? Você pode acessar o site gratuito de teste de expressões regulares <a href="https://regexr.com" class="alert-link">RegExr</a> em <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Quais são seus limites de SMTP de saída {#what-are-your-outbound-smtp-limits}

Limitamos a taxa de envio de usuários e domínios a 300 mensagens SMTP por dia. Isso equivale a uma média de mais de 9.000 e-mails por mês. Se você precisar exceder essa quantidade ou receber e-mails constantemente grandes, [Contate-nos](https://forwardemail.net/help).

### Preciso de aprovação para habilitar o SMTP {#do-i-need-approval-to-enable-smtp}

Sim. Observe que, para manter a reputação do IP e garantir a entregabilidade, o Forward Email possui um processo de revisão manual por domínio para aprovação de SMTP de saída. Envie um e-mail para <support@forwardemail.net> ou abra um [pedido de ajuda](https://forwardemail.net/help) para aprovação. Isso normalmente leva menos de 24 horas, com a maioria das solicitações sendo atendidas em 1 a 2 horas. Em um futuro próximo, pretendemos tornar esse processo instantâneo com controles e alertas de spam adicionais. Esse processo garante que seus e-mails cheguem à caixa de entrada e que suas mensagens não sejam marcadas como spam.

### Quais são as configurações do seu servidor SMTP {#what-are-your-smtp-server-configuration-settings}

Nosso servidor é `smtp.forwardemail.net` e também é monitorado em nossa <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de status</a>.

Ele suporta IPv4 e IPv6 e está disponível nas portas `465` e `2465` para SSL/TLS e `587`, `2587`, `2525` e `25` para TLS (STARTTLS).

| Protocolo | Nome do host | Portos | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferido** | `smtp.forwardemail.net` | `465`, `2465` | :marca_de_verificação_branca: | :marca_de_verificação_branca: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :marca_de_verificação_branca: | :marca_de_verificação_branca: |

| Conecte-se | Exemplo | Descrição |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome de usuário | `user@example.com` | Endereço de e-mail de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>. |
| Senha | `************************` | Senha gerada específica do alias. |

Para enviar e-mails de saída com SMTP, o **usuário SMTP** deve ser o endereço de e-mail de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> – e a **senha SMTP** deve ser uma senha gerada específica do alias.

Consulte [Você oferece suporte para envio de e-mail com SMTP](#do-you-support-sending-email-with-smtp) para obter instruções passo a passo.

### Quais são as configurações do seu servidor IMAP {#what-are-your-imap-server-configuration-settings}

Nosso servidor é `imap.forwardemail.net` e também é monitorado em nossa <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de status</a>.

Ele suporta IPv4 e IPv6 e está disponível nas portas `993` e `2993` para SSL/TLS.

| Protocolo | Nome do host | Portos | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferido** | `imap.forwardemail.net` | `993`, `2993` | :marca_de_verificação_branca: | :marca_de_verificação_branca: |

| Conecte-se | Exemplo | Descrição |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome de usuário | `user@example.com` | Endereço de e-mail de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>. |
| Senha | `************************` | Senha gerada específica do alias. |

Para se conectar com o IMAP, o **usuário IMAP** deve ser o endereço de e-mail de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> – e a **senha IMAP** deve ser uma senha gerada específica do alias.

Consulte [Você oferece suporte para receber e-mails com IMAP?](#do-you-support-receiving-email-with-imap) para obter instruções passo a passo.

### Quais são as configurações do seu servidor POP3 {#what-are-your-pop3-server-configuration-settings}

Nosso servidor é `pop3.forwardemail.net` e também é monitorado em nossa <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de status</a>.

Ele suporta IPv4 e IPv6 e está disponível nas portas `995` e `2995` para SSL/TLS.

| Protocolo | Nome do host | Portos | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferido** | `pop3.forwardemail.net` | `995`, `2995` | :marca_de_verificação_branca: | :marca_de_verificação_branca: |

| Conecte-se | Exemplo | Descrição |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome de usuário | `user@example.com` | Endereço de e-mail de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>. |
| Senha | `************************` | Senha gerada específica do alias. |

Para se conectar com o POP3, o **usuário POP3** deve ser o endereço de e-mail de um alias que existe para o domínio em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> – e a **senha IMAP** deve ser uma senha gerada específica do alias.

Consulte [Você suporta POP3?](#do-you-support-pop3) para obter instruções passo a passo.

### Configuração de retransmissão SMTP do Postfix {#postfix-smtp-relay-configuration}

Você pode configurar o Postfix para retransmitir e-mails pelos servidores SMTP do Forward Email. Isso é útil para aplicativos de servidor que precisam enviar e-mails.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo estimado de configuração:</strong>
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

2. Durante a instalação, selecione "Site da Internet" quando solicitado o tipo de configuração.

Configuração #### {#configuration}

1. Edite o arquivo de configuração principal do Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Adicione ou modifique estas configurações:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Crie o arquivo de senha SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Adicione suas credenciais de encaminhamento de e-mail:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Proteja e faça hash do arquivo de senha:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Reinicie o Postfix:

```bash
sudo systemctl restart postfix
```

#### Testando {#testing}

Teste sua configuração enviando um e-mail de teste:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Segurança {#security}

### Técnicas avançadas de proteção de servidor {#advanced-server-hardening-techniques}

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

A Forward Email implementa diversas técnicas de proteção de servidor para garantir a segurança de nossa infraestrutura e de seus dados:

1. **Segurança de Rede**:
* Firewall de tabelas de IP com regras rígidas
* Fail2ban para proteção contra força bruta
* Auditorias de segurança e testes de penetração regulares
* Acesso administrativo somente via VPN

2. **Reforço do Sistema**:
* Instalação mínima de pacotes
* Atualizações regulares de segurança
* SELinux em modo de execução
* Acesso root SSH desabilitado
* Autenticação baseada apenas em chave

3. **Segurança de Aplicativos**:
* Cabeçalhos da Política de Segurança de Conteúdo (CSP)
* Segurança de Transporte Estrita HTTPS (HSTS)
* Cabeçalhos de proteção XSS
* Opções de quadro e cabeçalhos de política de referência
* Auditorias regulares de dependências

4. **Proteção de Dados**:
* Criptografia completa do disco com LUKS
* Gerenciamento seguro de chaves
* Backups regulares com criptografia
* Práticas de minimização de dados

5. **Monitoramento e Resposta**:
* Detecção de intrusão em tempo real
* Varredura de segurança automatizada
* Registro e análise centralizados
* Procedimentos de resposta a incidentes

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### Você possui certificações SOC 2 ou ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

O Forward Email não possui certificações SOC 2 Tipo II ou ISO 27001. No entanto, o serviço opera em infraestrutura fornecida por subprocessadores certificados:

* **DigitalOcean**: Certificação SOC 2 Tipo II e SOC 3 Tipo II (auditada pela Schellman & Company LLC), certificação ISO 27001 em diversos data centers. Detalhes: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: certificado SOC 2+ (HIPAA), certificações ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detalhes: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: compatível com SOC 2 (entre em contato diretamente com a DataPacket para obter a certificação), provedor de infraestrutura de nível empresarial (localização em Denver). Detalhes: <https://www.datapacket.com/datacenters/denver>

O Forward Email segue as melhores práticas do setor para auditorias de segurança e interage regularmente com pesquisadores de segurança independentes. Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Você usa criptografia TLS para encaminhamento de e-mail {#do-you-use-tls-encryption-for-email-forwarding}

Sim. O Forward Email aplica rigorosamente o TLS 1.2+ para todas as conexões (HTTPS, SMTP, IMAP, POP3) e implementa o MTA-STS para suporte aprimorado ao TLS. A implementação inclui:

* Aplicação de TLS 1.2+ para todas as conexões de e-mail
* Troca de chaves ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) para sigilo de encaminhamento perfeito
* Conjuntos de cifras modernos com atualizações de segurança regulares
* Suporte a HTTP/2 para melhor desempenho e segurança
* HSTS (HTTP Strict Transport Security) com pré-carregamento nos principais navegadores
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** para aplicação rigorosa de TLS

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementação do MTA-STS**: O Forward Email implementa a aplicação rigorosa do MTA-STS na base de código. Quando ocorrem erros de TLS e o MTA-STS é aplicado, o sistema retorna códigos de status SMTP 421 para garantir que os e-mails sejam repetidos posteriormente, em vez de serem entregues de forma insegura. Detalhes da implementação:

* Detecção de erro TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Aplicação MTA-STS no auxiliar de envio de e-mail: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validação de terceiros: <https://www.hardenize.com/report/forwardemail.net/1750312779> mostra classificações "Bom" para todas as medidas de segurança de TLS e transporte.

### Você preserva os cabeçalhos de autenticação de e-mail {#do-you-preserve-email-authentication-headers}

Sim. O Forward Email implementa e preserva de forma abrangente os cabeçalhos de autenticação de e-mail:

* **SPF (Sender Policy Framework)**: Implementado e preservado adequadamente
* **DKIM (DomainKeys Identified Mail)**: Suporte total com gerenciamento adequado de chaves
* **DMARC**: Aplicação de políticas para e-mails que não passam na validação SPF ou DKIM
* **ARC**: Embora não explicitamente detalhado, as pontuações de conformidade perfeitas do serviço sugerem um tratamento abrangente do cabeçalho de autenticação

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validação: O teste de e-mail do Internet.nl apresenta pontuação de 100/100 especificamente para a implementação de "SPF, DKIM e DMARC". A avaliação do Hardenize confirma as classificações "Bom" para SPF e DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Você preserva os cabeçalhos de e-mail originais e evita falsificações {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

O Forward Email preserva os cabeçalhos de e-mail originais ao mesmo tempo em que implementa proteção anti-spoofing abrangente por meio da base de código MX:

* **Preservação de Cabeçalho**: Os cabeçalhos de autenticação originais são mantidos durante o encaminhamento
* **Anti-Spoofing**: A aplicação da política DMARC previne a falsificação de cabeçalhos, rejeitando e-mails que falham na validação SPF ou DKIM
* **Prevenção de Injeção de Cabeçalho**: Validação e sanitização de entradas usando a biblioteca striptags
* **Proteção Avançada**: Detecção sofisticada de phishing com sistemas de detecção de spoofing, prevenção de personificação e notificação ao usuário

**Detalhes da implementação do MX**: A lógica principal de processamento de e-mail é gerenciada pela base de código do servidor MX, especificamente:

* Manipulador principal de dados MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtragem arbitrária de e-mails (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

O auxiliar `isArbitrary` implementa regras sofisticadas anti-spoofing, incluindo detecção de representação de domínio, frases bloqueadas e vários padrões de phishing.

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Como você se protege contra spam e abuso {#how-do-you-protect-against-spam-and-abuse}

O Forward Email implementa proteção abrangente em várias camadas:

* **Limitação de Taxa**: Aplicado a tentativas de autenticação, endpoints de API e conexões SMTP
* **Isolamento de Recursos**: Entre usuários para evitar impacto de usuários de alto volume
* **Proteção DDoS**: Proteção multicamadas por meio do sistema Shield da DataPacket e Cloudflare
* **Escalonamento Automático**: Ajuste dinâmico de recursos com base na demanda
* **Prevenção de Abuso**: Verificações de prevenção de abuso específicas do usuário e bloqueio baseado em hash para conteúdo malicioso
* **Autenticação de E-mail**: Protocolos SPF, DKIM e DMARC com detecção avançada de phishing

Fontes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Detalhes da proteção DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Você armazena conteúdo de e-mail no disco {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

* **Arquitetura de Conhecimento Zero**: Caixas de correio SQLite criptografadas individualmente impedem que o Forward Email acesse o conteúdo do e-mail.
* **Processamento em Memória**: O processamento de e-mails ocorre inteiramente na memória, evitando o armazenamento em disco.
* **Sem Registro de Conteúdo**: "Não registramos nem armazenamos conteúdo ou metadados de e-mails em disco."
* **Criptografia em Sandbox**: As chaves de criptografia nunca são armazenadas em disco em texto simples.

**Evidência da Base de Código MX**: O servidor MX processa e-mails inteiramente na memória, sem gravar conteúdo em disco. O principal manipulador de processamento de e-mails demonstra esta abordagem na memória: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fontes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Resumo)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detalhes de conhecimento zero)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Criptografia em sandbox)

### O conteúdo do e-mail pode ser exposto durante falhas do sistema {#can-email-content-be-exposed-during-system-crashes}

Não. O Forward Email implementa proteções abrangentes contra exposição de dados relacionada a falhas:

* **Core Dumps Desativados**: Evita a exposição da memória durante travamentos
* **Memória Swap Desativada**: Completamente desativada para impedir a extração de dados confidenciais de arquivos de swap
* **Arquitetura In-Memory**: O conteúdo do e-mail existe apenas na memória volátil durante o processamento
* **Proteção da Chave de Criptografia**: As chaves nunca são armazenadas em disco em texto simples
* **Segurança Física**: Discos criptografados com LUKS v2 impedem o acesso físico aos dados
* **Armazenamento USB Desativado**: Evita a extração não autorizada de dados

**Tratamento de erros para problemas do sistema**: O Forward Email usa as funções auxiliares `isCodeBug` e `isTimeoutError` para garantir que, se ocorrerem problemas de conectividade com o banco de dados, problemas de rede/lista de bloqueio de DNS ou problemas de conectividade upstream, o sistema retorne códigos de status SMTP 421 para garantir que os e-mails sejam tentados novamente mais tarde, em vez de serem perdidos ou expostos.

Detalhes de implementação:

* Classificação de erro: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Tratamento de erro de tempo limite no processamento MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Quem tem acesso à sua infraestrutura de e-mail {#who-has-access-to-your-email-infrastructure}

A Forward Email implementa controles de acesso abrangentes para sua equipe de engenharia mínima de 2 a 3 pessoas com requisitos rigorosos de 2FA:

* **Controle de Acesso Baseado em Funções**: Para contas de equipe com permissões baseadas em recursos
* **Princípio do Mínimo Privilégio**: Aplicado em todos os sistemas
* **Segregação de Funções**: Entre funções operacionais
* **Gerenciamento de Usuários**: Separe usuários de implantação e desenvolvimento com permissões distintas
* **Login Root Desativado**: Força o acesso por meio de contas devidamente autenticadas
* **2FA Estrita**: Sem 2FA por SMS devido ao risco de ataques MiTM - apenas tokens baseados em aplicativo ou hardware
* **Registro de Auditoria Abrangente**: Com eliminação de dados confidenciais
* **Detecção Automatizada de Anomalias**: Para padrões de acesso incomuns
* **Revisões Regulares de Segurança**: De registros de acesso
* **Prevenção de Ataques Evil Maid**: Armazenamento USB desativado e outras medidas de segurança física

Fontes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Controles de Autorização)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Segurança de Rede)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Prevenção de Ataques de Empregadas Malvadas)

### Quais provedores de infraestrutura você usa {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

Detalhes completos estão disponíveis em nossa página de conformidade com o GDPR: <https://forwardemail.net/gdpr>

**Subprocessadores de infraestrutura primária:**

| Provedor | Certificado pela Estrutura de Privacidade de Dados | Página de conformidade com o GDPR |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Sim | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Pacote de dados** | ❌ Não | <https://www.datapacket.com/privacy-policy> |
| **Oceano Digital** | ❌ Não | <https://www.digitalocean.com/legal/gdpr> |
| **Abutre** | ❌ Não | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Certificações detalhadas:**

**Oceano Digital**

* SOC 2 Tipo II e SOC 3 Tipo II (auditados pela Schellman & Company LLC)
* Certificação ISO 27001 em diversos data centers
* Em conformidade com PCI-DSS
* Certificação CSA STAR Nível 1
* Certificação APEC CBPR PRP
* Detalhes: <https://www.digitalocean.com/trust/certification-reports>

**Abutre**

* Certificação SOC 2+ (HIPAA)
* Em conformidade com o PCI Merchant
* Certificação CSA STAR Nível 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detalhes: <https://www.vultr.com/legal/compliance/>

**Pacote de dados**

* Compatível com SOC 2 (entre em contato diretamente com a DataPacket para obter a certificação)
* Infraestrutura de nível empresarial (localização em Denver)
* Proteção contra DDoS por meio do conjunto de segurança cibernética Shield
* Suporte técnico 24 horas por dia, 7 dias por semana
* Rede global em 58 data centers
* Detalhes: <https://www.datapacket.com/datacenters/denver>

**Processadores de pagamento:**

* **Stripe**: Certificado pela Estrutura de Privacidade de Dados - <https://stripe.com/legal/privacy-center>
* **PayPal**: Não certificado pela DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Você oferece um Contrato de Processamento de Dados (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Sim, a Forward Email oferece um Contrato de Processamento de Dados (DPA) abrangente que pode ser assinado junto com nosso contrato empresarial. Uma cópia do nosso DPA está disponível em: <https://forwardemail.net/dpa>

**Detalhes do DPA:**

* Abrange a conformidade com o GDPR e as estruturas do Escudo de Proteção de Dados UE-EUA/Suíça-EUA
* Aceito automaticamente ao concordar com nossos Termos de Serviço
* Não é necessária assinatura separada para o DPA padrão
* Acordos personalizados de DPA disponíveis por meio da Licença Empresarial

**Estrutura de Conformidade com o GDPR:**
Nosso DPA detalha a conformidade com o GDPR, bem como os requisitos internacionais de transferência de dados. Informações completas estão disponíveis em: <https://forwardemail.net/gdpr>

Para clientes empresariais que exigem termos de DPA personalizados ou acordos contratuais específicos, isso pode ser resolvido por meio do nosso programa **Licença Empresarial (US$ 250/mês)**.

### Como você lida com notificações de violação de dados {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

* **Exposição Limitada de Dados**: Impossível acessar o conteúdo criptografado do e-mail devido à arquitetura de conhecimento zero
* **Coleta Mínima de Dados**: Apenas informações básicas do assinante e registros de IP limitados para segurança
* **Estruturas de Subprocessadores**: DigitalOcean e Vultr mantêm procedimentos de resposta a incidentes em conformidade com o GDPR

**Informações do Representante do GDPR:**
A Forward Email nomeou representantes do GDPR de acordo com o Artigo 27:

**Representante da UE:**
Osano International Compliance Services Limited
AOS: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Representante no Reino Unido:**
Osano UK Compliance LTD
AOS: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Para clientes corporativos que exigem SLAs específicos de notificação de violação, estes devem ser discutidos como parte de um contrato de **Licença Corporativa**.

Fontes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Você oferece um ambiente de teste {#do-you-offer-a-test-environment}

A documentação técnica do Forward Email não descreve explicitamente um modo sandbox dedicado. No entanto, as possíveis abordagens de teste incluem:

* **Opção de Auto-Hospedagem**: Recursos abrangentes de auto-hospedagem para a criação de ambientes de teste
* **Interface de API**: Potencial para testes programáticos de configurações
* **Código Aberto**: Código 100% aberto permite que os clientes examinem a lógica de encaminhamento
* **Múltiplos Domínios**: O suporte a múltiplos domínios pode permitir a criação de domínios de teste

Para clientes corporativos que exigem recursos formais de sandbox, isso deve ser discutido como parte de um acordo de **Licença Corporativa**.

Fonte: <https://github.com/forwardemail/forwardemail.net> (Detalhes do ambiente de desenvolvimento)

### Você fornece ferramentas de monitoramento e alerta {#do-you-provide-monitoring-and-alerting-tools}

O Forward Email fornece monitoramento em tempo real com algumas limitações:

**Disponível:**

* **Monitoramento de Entrega em Tempo Real**: Métricas de desempenho publicamente visíveis para os principais provedores de e-mail
* **Alerta Automático**: Equipe de engenharia alertada quando o tempo de entrega excede 10 segundos
* **Monitoramento Transparente**: Sistemas de monitoramento 100% de código aberto
* **Monitoramento de Infraestrutura**: Detecção automatizada de anomalias e registro de auditoria abrangente

**Limitações:**

* Webhooks voltados para o cliente ou notificações de status de entrega baseadas em API não são documentados explicitamente

Para clientes corporativos que exigem webhooks detalhados de status de entrega ou integrações de monitoramento personalizadas, esses recursos podem estar disponíveis por meio de acordos de **Licença Corporativa**.

Fontes:

* <https://forwardemail.net> (Exibição de monitoramento em tempo real)
* <https://github.com/forwardemail/forwardemail.net> (Implementação de monitoramento)

### Como você garante alta disponibilidade {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **Infraestrutura Distribuída**: Múltiplos provedores (DigitalOcean, Vultr, DataPacket) em regiões geográficas
* **Balanceamento de Carga Geográfico**: Balanceamento de carga geolocalizado baseado em Cloudflare com failover automático
* **Escalonamento Automático**: Ajuste dinâmico de recursos com base na demanda
* **Proteção DDoS Multicamadas**: Através do sistema Shield da DataPacket e Cloudflare
* **Redundância de Servidores**: Múltiplos servidores por região com failover automático
* **Replicação de Banco de Dados**: Sincronização de dados em tempo real em vários locais
* **Monitoramento e Alertas**: Monitoramento 24 horas por dia, 7 dias por semana, com resposta automática a incidentes

**Compromisso de tempo de atividade**: disponibilidade de serviço de mais de 99,9% com monitoramento transparente disponível em <https://forwardemail.net>

Fontes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Você está em conformidade com a Seção 889 da Lei de Autorização de Defesa Nacional (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

Sim, o Forward Email está em conformidade com a **Seção 889**. A Seção 889 da Lei de Autorização de Defesa Nacional (NDAA) proíbe agências governamentais de usar ou contratar entidades que utilizem equipamentos de telecomunicações e vigilância por vídeo de empresas específicas (Huawei, ZTE, Hikvision, Dahua e Hytera).

**Como o Forward Email atinge a conformidade com a Seção 889:**

O Forward Email depende exclusivamente de dois provedores de infraestrutura principais, nenhum dos quais usa equipamento proibido pela Seção 889:

1. **Cloudflare**: Nosso principal parceiro para serviços de rede e segurança de e-mail
2. **DataPacket**: Nosso principal fornecedor de infraestrutura de servidores (utilizando exclusivamente equipamentos da Arista Networks e Cisco)
3. **Provedores de Backup**: Nossos provedores de backup da Digital Ocean e da Vultr também são confirmados por escrito como estando em conformidade com a Seção 889.

**Compromisso da Cloudflare**: A Cloudflare declara explicitamente em seu Código de Conduta de Terceiros que não usa equipamentos de telecomunicações, produtos de vigilância por vídeo ou serviços de nenhuma entidade proibida pela Seção 889.

**Caso de uso governamental**: Nossa conformidade com a Seção 889 foi validada quando a **Academia Naval dos EUA** selecionou o Forward Email para suas necessidades de encaminhamento seguro de e-mail, exigindo a documentação de nossos padrões federais de conformidade.

Para obter detalhes completos sobre nossa estrutura de conformidade governamental, incluindo regulamentações federais mais amplas, leia nosso estudo de caso abrangente: [Serviço de e-mail do governo federal em conformidade com a Seção 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Detalhes técnicos e do sistema {#system-and-technical-details}

### Você armazena e-mails e seus conteúdos {#do-you-store-emails-and-their-contents}

Não, não gravamos em disco nem armazenamos logs – com [exceção de erros](#do-you-store-error-logs) e [SMTP de saída](#do-you-support-sending-email-with-smtp) (veja nosso [política de Privacidade](/privacy)).

Tudo é feito na memória e [nosso código fonte está no GitHub](https://github.com/forwardemail).

### Como funciona o seu sistema de encaminhamento de e-mail {#how-does-your-email-forwarding-system-work}

O e-mail depende do [Protocolo SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Este protocolo consiste em comandos enviados a um servidor (geralmente executado na porta 25). Há uma conexão inicial, depois o remetente indica de quem é o e-mail ("MAIL FROM"), seguido do destino ("RCPT TO") e, por fim, os cabeçalhos e o corpo do e-mail ("DATA"). O fluxo do nosso sistema de encaminhamento de e-mails é descrito em relação a cada comando do protocolo SMTP abaixo:

* Conexão Inicial (sem nome de comando, por exemplo, `telnet example.com 25`) - Esta é a conexão inicial. Verificamos remetentes que não estão em nosso [lista de permissões](#do-you-have-an-allowlist) em relação ao nosso [lista de negação](#do-you-have-a-denylist). Por fim, se um remetente não estiver em nossa lista de permissões, verificamos se ele foi [na lista cinza](#do-you-have-a-greylist).

* `HELO` - Indica uma saudação para identificar o FQDN, o endereço IP ou o nome do manipulador de e-mail do remetente. Este valor pode ser falsificado, portanto, não dependemos desses dados e, em vez disso, usamos a consulta reversa do nome do host do endereço IP da conexão.

* `MAIL FROM` - Indica o endereço de origem do envelope do e-mail. Se um valor for inserido, ele deverá ser um endereço de e-mail válido em conformidade com a norma RFC 5322. Valores vazios são permitidos. [verificar retrodispersão](#how-do-you-protect-against-backscatter) aqui, e também verificamos o MAIL FROM em relação ao nosso [lista de negação](#do-you-have-a-denylist). Por fim, verificamos os remetentes que não estão na lista de permissões para limitação de taxa (consulte a seção sobre [Limitação de taxa](#do-you-have-rate-limiting) e [lista de permissões](#do-you-have-an-allowlist) para obter mais informações).

* `RCPT TO` - Indica o(s) destinatário(s) do e-mail. Estes devem ser endereços de e-mail válidos em conformidade com a norma RFC 5322. Permitimos apenas até 50 destinatários por envelope (diferente do cabeçalho "Para" de um e-mail). Também verificamos se há um endereço [Esquema de Reescrita do Remetente](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") válido aqui para proteção contra falsificação com nosso nome de domínio SRS.

* `DATA` - Esta é a parte central do nosso serviço que processa e-mails. Consulte a seção [Como você processa um e-mail para encaminhamento](#how-do-you-process-an-email-for-forwarding) abaixo para obter mais informações.

### Como você processa um e-mail para encaminhamento {#how-do-you-process-an-email-for-forwarding}

Esta seção descreve nosso processo relacionado ao comando do protocolo SMTP `DATA` na seção [Como funciona o seu sistema de encaminhamento de e-mail](#how-does-your-email-forwarding-system-work) acima – é como processamos os cabeçalhos, o corpo e a segurança de um e-mail, determinamos para onde ele precisa ser entregue e como lidamos com as conexões.

1. Se a mensagem exceder o tamanho máximo de 50 MB, ela será rejeitada com um código de erro 552.

2. Se a mensagem não contiver um cabeçalho "De" ou se algum dos valores no cabeçalho "De" não forem endereços de e-mail RFC 5322 válidos, ela será rejeitada com um código de erro 550.

3. Se a mensagem tiver mais de 25 cabeçalhos "Recebidos", ela será determinada como presa em um loop de redirecionamento e rejeitada com um código de erro 550.

4. Usando a impressão digital do e-mail (veja a seção sobre [Impressão digital](#how-do-you-determine-an-email-fingerprint)), verificaremos se a mensagem foi tentada novamente por mais de 5 dias (o que corresponde a [comportamento padrão do postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)) e, se for o caso, ela será rejeitada com um código de erro 550.

5. Armazenamos na memória os resultados da verificação do e-mail usando [Verificador de spam](https://spamscanner.net).

6. Se houver resultados arbitrários do Spam Scanner, ele será rejeitado com o código de erro 554. Os resultados arbitrários incluem apenas o teste GTUBE no momento da redação deste texto. Consulte <https://spamassassin.apache.org/gtube/> para obter mais informações.

7. Adicionaremos os seguintes cabeçalhos à mensagem para fins de depuração e prevenção de abuso:

* `Received` - adicionamos este cabeçalho padrão "Recebido" com IP e host de origem, tipo de transmissão, informações de conexão TLS, data/hora e destinatário.
* `X-Original-To` - o destinatário original da mensagem:
* Isso é útil para determinar para onde um e-mail foi originalmente entregue (além do cabeçalho "Recebido").
* Isso é adicionado por destinatário no momento do encaminhamento IMAP e/ou mascarado (para proteger a privacidade).
* `X-Forward-Email-Website` - contém um link para o nosso site <https://forwardemail.net>
* `X-Forward-Email-Version` - a versão atual [SemVer](https://semver.org/) do `package.json` da nossa base de código.
* `X-Forward-Email-Session-ID` - um valor de ID de sessão usado para fins de depuração (aplicável somente em ambientes que não sejam de produção).
* `X-Forward-Email-Sender` - uma lista separada por vírgulas contendo o endereço MAIL FROM do envelope original (se não estiver em branco), o FQDN do cliente PTR reverso (se existir) e o endereço IP do remetente.
* `X-Forward-Email-ID` - aplicável somente para SMTP de saída e correlacionado ao ID de e-mail armazenado em Minha Conta → E-mails.
* `X-Report-Abuse` - com o valor `abuse@forwardemail.net`.
* `X-Report-Abuse-To` - com o valor `abuse@forwardemail.net`.
* `X-Complaints-To` - com um valor de `abuse@forwardemail.net`.

8. Em seguida, verificamos a mensagem para [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) e [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Se a mensagem não passou no DMARC e o domínio tinha uma política de rejeição (por exemplo, `p=reject` [estava na política DMARC](https://wikipedia.org/wiki/DMARC)), ela é rejeitada com um código de erro 550. Normalmente, uma política DMARC para um domínio pode ser encontrada no registro <strong class="notranslate">TXT</strong> do subdomínio `_dmarc` (por exemplo, `dig _dmarc.example.com txt`).
* Se a mensagem não passou no SPF e o domínio tinha uma política de rejeição grave (por exemplo, `-all` estava na política SPF, em vez de `~all` ou nenhuma política), ela é rejeitada com um código de erro 550. Normalmente, uma política SPF para um domínio pode ser encontrada no registro <strong class="notranslate">TXT</strong> do domínio raiz (por exemplo, `dig example.com txt`). Consulte esta seção para obter mais informações sobre [enviando e-mail como com o Gmail](#can-i-send-mail-as-in-gmail-with-this) em relação ao SPF.

9. Agora, processamos os destinatários da mensagem conforme coletados pelo comando `RCPT TO` na seção [Como funciona o seu sistema de encaminhamento de e-mail](#how-does-your-email-forwarding-system-work) acima. Para cada destinatário, realizamos as seguintes operações:

* Pesquisamos os registros <strong class="notranslate">TXT</strong> do nome de domínio (a parte após o símbolo `@`, por exemplo, `example.com` se o endereço de e-mail for `test@example.com`). Por exemplo, se o domínio for `example.com`, fazemos uma pesquisa de DNS como `dig example.com txt`.
* Analisamos todos os registros <strong class="notranslate">TXT</strong> que começam com `forward-email=` (planos gratuitos) ou `forward-email-site-verification=` (planos pagos). Observe que analisamos ambos para processar e-mails enquanto um usuário está atualizando ou rebaixando planos.
* A partir desses registros <strong class="notranslate">TXT</strong> analisados, iteramos sobre eles para extrair a configuração de encaminhamento (conforme descrito na seção [Como faço para começar e configurar o encaminhamento de e-mail](#how-do-i-get-started-and-set-up-email-forwarding) acima). Observe que suportamos apenas um valor `forward-email-site-verification=` e, se mais de um for fornecido, ocorrerá um erro 550 e o remetente receberá uma devolução para este destinatário.
* Recursivamente, iteramos sobre a configuração de encaminhamento extraída para determinar o encaminhamento global, o encaminhamento baseado em regex e todas as outras configurações de encaminhamento suportadas – que agora são conhecidas como nossos "Endereços de Encaminhamento".
* Para cada Endereço de Encaminhamento, suportamos uma consulta recursiva (que iniciará esta série de operações novamente no endereço fornecido). Se uma correspondência recursiva for encontrada, o resultado pai será removido dos Endereços de Encaminhamento e os filhos adicionados.

* Os Endereços de Encaminhamento são analisados quanto à sua exclusividade (já que não queremos enviar duplicatas para um endereço ou gerar conexões de cliente SMTP desnecessárias).
* Para cada Endereço de Encaminhamento, consultamos seu nome de domínio em nosso endpoint de API `/v1/max-forwarded-addresses` (para determinar quantos endereços o domínio tem permissão para encaminhar e-mails por alias, por exemplo, 10 por padrão – consulte a seção sobre [limite máximo de encaminhamento por alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Se esse limite for excedido, ocorrerá um erro 550 e o remetente receberá uma devolução para este destinatário.
* Consultamos as configurações do destinatário original em nosso endpoint de API `/v1/settings`, que oferece suporte a uma consulta para usuários pagos (com um fallback para usuários gratuitos). Isso retorna um objeto de configuração para configurações avançadas para `port` (número, por exemplo, `25`), `has_adult_content_protection` (booleano), `has_phishing_protection` (booleano), `has_executable_protection` (booleano) e `has_virus_protection` (booleano).
* Com base nessas configurações, verificamos os resultados do Spam Scanner e, se ocorrer algum erro, a mensagem será rejeitada com um código de erro 554 (por exemplo, se `has_virus_protection` estiver habilitado, verificaremos os resultados do Spam Scanner em busca de vírus). Observe que todos os usuários do plano gratuito serão incluídos nas verificações contra conteúdo adulto, phishing, executáveis e vírus. Por padrão, todos os usuários do plano pago também são incluídos, mas essa configuração pode ser alterada na página Configurações de um domínio no painel Encaminhar E-mail.

10. Para cada Endereço de Encaminhamento de destinatário processado, realizamos as seguintes operações:

* O endereço é verificado em relação ao nosso [lista de negação](#do-you-have-a-denylist) e, se estiver listado, ocorrerá um código de erro 421 (indicando ao remetente para tentar novamente mais tarde).
* Se o endereço for um webhook, definimos um booleano para operações futuras (veja abaixo – agrupamos webhooks semelhantes para fazer uma solicitação POST em vez de várias para entrega).
* Se o endereço for um endereço de e-mail, analisamos o host para operações futuras (veja abaixo – agrupamos hosts semelhantes para fazer uma conexão em vez de várias conexões individuais para entrega).

11. Se não houver destinatários e não houver devoluções, responderemos com um erro 550 de "Destinatários inválidos".

12. Se houver destinatários, iteramos sobre eles (agrupados pelo mesmo host) e entregamos os e-mails. Consulte a seção [Como você lida com problemas de entrega de e-mail](#how-do-you-handle-email-delivery-issues) abaixo para obter mais informações.

* Se ocorrerem erros durante o envio de e-mails, eles serão armazenados na memória para processamento posterior.
* Usaremos o menor código de erro (se houver) no envio de e-mails e o usaremos como código de resposta ao comando `DATA`. Isso significa que e-mails não entregues normalmente serão repetidos pelo remetente original, mas e-mails que já foram entregues não serão reenviados na próxima vez que a mensagem for enviada (já que usamos [Impressão digital](#how-do-you-determine-an-email-fingerprint)).
* Se não ocorrerem erros, enviaremos um código de status de resposta SMTP com 250 mensagens bem-sucedidas.
* Uma devolução é definida como qualquer tentativa de entrega que resulte em um código de status >= 500 (falhas permanentes).

13. Se não ocorrerem rejeições (falhas permanentes), retornaremos um código de status de resposta SMTP do menor código de erro de falhas não permanentes (ou um código de status 250 bem-sucedido se não houver nenhuma).

14. Caso ocorram devoluções, enviaremos e-mails de devolução em segundo plano, retornando ao remetente o menor de todos os códigos de erro. No entanto, se o menor código de erro for >= 500, não enviaremos nenhum e-mail de devolução. Isso ocorre porque, se o fizermos, os remetentes receberão um e-mail de devolução duplo (por exemplo, um de seu MTA de saída, como o Gmail, e também um nosso). Consulte a seção sobre [Como você se protege contra a retrodispersão](#how-do-you-protect-against-backscatter) abaixo para obter mais informações.

### Como você lida com problemas de entrega de e-mail {#how-do-you-handle-email-delivery-issues}

Observe que faremos uma reescrita "Friendly-From" nos e-mails se e somente se a política DMARC do remetente não estiver passando E nenhuma assinatura DKIM estiver alinhada com o cabeçalho "From". Isso significa que alteraremos o cabeçalho "From" na mensagem, definiremos "X-Original-From" e também definiremos um "Reply-To" se ele ainda não estiver definido. Também selaremos novamente o selo ARC na mensagem após alterar esses cabeçalhos.

Também usamos análise inteligente de mensagens de erro em todos os níveis da nossa pilha – no nosso código, solicitações de DNS, componentes internos do Node.js, solicitações HTTP (por exemplo, 408, 413 e 429 são mapeadas para o código de resposta SMTP 421 se o destinatário for um webhook) e respostas do servidor de e-mail (por exemplo, respostas com "adiar" ou "desacelerar" seriam repetidas como erros 421).

Nossa lógica é à prova de erros e também tentará novamente em busca de erros de SSL/TLS, problemas de conexão e muito mais. O objetivo da proteção contra erros é maximizar a entregabilidade a todos os destinatários de uma configuração de encaminhamento.

Se o destinatário for um webhook, permitiremos um tempo limite de 60 segundos para a solicitação ser concluída, com até 3 tentativas (totalizando 4 solicitações antes de uma falha). Observe que analisamos corretamente os códigos de erro 408, 413 e 429 e os mapeamos para um código de resposta SMTP 421.

Caso contrário, se o destinatário for um endereço de e-mail, tentaremos enviar o e-mail com TLS oportunista (tentaremos usar STARTTLS se estiver disponível no servidor de e-mail do destinatário). Se ocorrer um erro de SSL/TLS durante a tentativa de envio do e-mail, tentaremos enviá-lo sem TLS (sem usar STARTTLS).

Se ocorrer algum erro de DNS ou de conexão, retornaremos ao comando `DATA` um código de resposta SMTP de 421; caso contrário, se houver erros de nível >= 500, serão enviadas rejeições.

Se detectarmos que um servidor de e-mail para o qual estamos tentando entregar tem um ou mais endereços IP de troca de e-mail bloqueados (por exemplo, por qualquer tecnologia que eles usem para adiar spammers), enviaremos um código de resposta SMTP 421 para o remetente tentar enviar a mensagem novamente mais tarde (e seremos alertados sobre o problema para que possamos resolvê-lo antes da próxima tentativa).

### Como você lida com o bloqueio dos seus endereços IP {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Monitoramos rotineiramente todas as principais listas de negação de DNS e, se algum dos nossos endereços IP de troca de e-mail ("MX") estiver listado em uma lista de negação importante, nós o retiraremos do registro DNS A relevante, round robin, se possível, até que o problema seja resolvido.

No momento em que este texto foi escrito, também estávamos listados em várias listas de permissões de DNS e levamos o monitoramento dessas listas a sério. Se você encontrar algum problema antes que possamos resolvê-lo, notifique-nos por escrito em <support@forwardemail.net>.

Nossos endereços IP estão disponíveis publicamente, [veja esta seção abaixo para mais informações](#what-are-your-servers-ip-addresses).

### O que são endereços do postmaster {#what-are-postmaster-addresses}

Para evitar devoluções mal direcionadas e o envio de mensagens de resposta de férias para caixas de correio não monitoradas ou inexistentes, mantemos uma lista de nomes de usuário do tipo mailer-daemon:

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
* [e qualquer endereço sem resposta](#what-are-no-reply-addresses)

Veja [RFC 5320 Seção 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) para mais informações sobre como listas como essas são usadas para criar sistemas de e-mail eficientes.

### O que são endereços sem resposta {#what-are-no-reply-addresses}

Nomes de usuários de e-mail iguais a qualquer um dos seguintes (sem distinção de maiúsculas e minúsculas) são considerados endereços sem resposta:

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

Esta lista é mantida [como um projeto de código aberto no GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Quais são os endereços IP do seu servidor {#what-are-your-servers-ip-addresses}

Publicamos nossos endereços IP em <https://forwardemail.net/ips>.

### Você tem uma lista de permissões {#do-you-have-an-allowlist}

Sim, temos um [lista de extensões de nomes de domínio](#what-domain-name-extensions-are-allowlisted-by-default) que é permitido por padrão e uma lista de permissões dinâmica, armazenada em cache e contínua baseada em [critérios rigorosos](#what-is-your-allowlist-criteria).

Todos os e-mails, domínios e destinatários de clientes em planos pagos são adicionados automaticamente à nossa lista de permissões.

### Quais extensões de nome de domínio são permitidas por padrão {#what-domain-name-extensions-are-allowlisted-by-default}

As seguintes extensões de nomes de domínio são consideradas permitidas por padrão (independentemente de estarem ou não na Lista de Popularidade Umbrella):

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
<li class="list-inline-item"><code mil.in

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
<li class="list-inline-item"><code gob.mx
<!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
<li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
<li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
<li class="lista-item-em-linha"><code class="notranslate">gov.af</code></li>
<li class="lista-item-em-linha"><code class="notranslate">gov.ai</code></li>
<li class="lista-item-em-linha"><code class="notranslate">gov.al</code></li>
<li class="lista-item-em-linha"><code class="notranslate">gov.am</code></li>
<li class="lista-item-em-linha"><code class="notranslate">gov.ao</code></li>
<li class="lista-item-em-linha"><code class="notranslate">gov.au</code></li>
<li class="lista-item-em-linha"><code class="notranslate">gov.aw</code></li>
<li class="lista-item-em-linha"><code class="notranslate">gov.ax</code></li>
<li class="lista-item-em-linha"><code class="notranslate">gov.az</code></li>
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

Além disso, esses [domínios de nível superior de marca e corporativos](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) são permitidos por padrão (por exemplo, `apple` para `applecard.apple` para extratos bancários do Apple Card):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">accenture</code></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">aco</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">aeg</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">aetna</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">afl</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">agakhan</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">aig</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">aigo</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">airbus</código></li>
<li classe="lista-item-em-linha"><código airtel</code></li>
<li class="list-inline-item"><code class="notranslate">akdn</code></li>
<li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
<li class="list-inline-item"><code class="notranslate">alibaba</code></li>
<li class="list-inline-item"><code class="notranslate">alipay</code></li>
<li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
<li class="list-inline-item"><code class="notranslate">allstate</code></li>
<li class="list-inline-item"><code class="notranslate">ally</code></li>
<li class="list-inline-item"><code class="notranslate">alstom</code></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Amazon</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">AmericanExpress</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Amex</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Amica</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Android</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">ANZ</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">AOL</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Apple</código></li>
<li classe="lista-item-em-linha"><código aquarela</code></li>
<li class="list-inline-item"><code class="notranslate">aramco</code></li>
<li class="list-inline-item"><code class="notranslate">audi</code></li>
<li class="list-inline-item"><code class="notranslate">auspost</code></li>
<li class="list-inline-item"><code class="notranslate">aws</code></li>
<li class="list-inline-item"><code class="notranslate">axa</code></li>
<li class="list-inline-item"><code class="notranslate">azure</code></li>
<li class="list-inline-item"><code class="notranslate">baidu</code></li>
<li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
<li class="lista-item-em-linha"><código class="notranslate">barclaycard</código></li>
<li class="lista-item-em-linha"><código class="notranslate">barclays</código></li>
<li class="lista-item-em-linha"><código class="notranslate">basquete</código></li>
<li class="lista-item-em-linha"><código class="notranslate">bauhaus</código></li>
<li class="lista-item-em-linha"><código class="notranslate">bbc</código></li>
<li class="lista-item-em-linha"><código class="notranslate">bbt</código></li>
<li class="lista-item-em-linha"><código class="notranslate">bbva</código></li>
<li class="lista-item-em-linha"><código class="notranslate">bcg</código></li>
<li class="lista-item-em-linha"><código Bentley

<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li>
<li>item em linha da lista</li> class="list-inline-item"><code class="notranslate">Boehringer</code></li>
<li class="list-inline-item"><code class="notranslate">Bond</code></li>
<li class="list-inline-item"><code class="notranslate">Booking</code></li>
<li class="list-inline-item"><code class="notranslate">Bosch</code></li>
<li class="list-inline-item"><code class="notranslate">Bostik</code></li>
<li class="list-inline-item"><code class="notranslate">Bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">Bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">Brother</code></li>
<li class="list-inline-item"><code bugatti</code></li>
<li class="list-inline-item"><code class="notranslate">cal</code></li>
<li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
<li class="list-inline-item"><code class="notranslate">canon</code></li>
<li class="list-inline-item"><code class="notranslate">capitalone</code></li>
<li class="list-inline-item"><code class="notranslate">carvan</code></li>
<li class="list-inline-item"><code class="notranslate">cartier</code></li>
<li class="list-inline-item"><code class="notranslate">cba</code></li>
<li class="list-inline-item"><code class="notranslate">cbn</code></li>
<li class="list-inline-item"><code class="notranslate">cbre</code></li>
<li class="list-inline-item"><code class="notranslate">cbs</code></li>
<li class="list-inline-item"><code class="notranslate">cern</code></li>
<li class="list-inline-item"><code class="notranslate">cfa</code></li>
<li class="list-inline-item"><code class="notranslate">canal</code></li>
<li class="list-inline-item"><code class="notranslate">perseguição</code></li>
<li class="list-inline-item"><code class="notranslate">chintai</code></li>
<li class="list-inline-item"><code class="notranslate">cromo</code></li>
<li class="list-inline-item"><code Chrysler

<li class="list-inline-item"><code class="notranslate">cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">cisco</code></li>
<li class="list-inline-item"><code class="notranslate">citadel</code></li>
<li class="list-inline-item"><code class="notranslate">citi</code></li>
<li class="list-inline-item"><code class="notranslate">citic</code></li>
<li class="list-inline-item"><code class="notranslate">clubmed</code></li>
<li class="list-inline-item"><code class="notranslate">comcast</code></li>
<li class="list-inline-item"><code class="notranslate">commbank</code></li>
<li class="list-inline-item"><code class="notranslate">cooperativa de crédito</code></li>
<li class="list-inline-item"><code class="notranslate">coroa</code></li>
<li class="list-inline-item"><code class="notranslate">crs</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><code class="notranslate">dabur</code></li>
<li class="list-inline-item"><code class="notranslate">datsun</code></li>
<li class="list-inline-item"><code class="notranslate">concessionária</code></li>
<li class="list-inline-item"><code classe="notranslate">dell</code></li>
<li classe="list-inline-item"><code classe="notranslate">deloitte</code></li>
<li classe="list-inline-item"><code classe="notranslate">delta</code></li>
<li classe="list-inline-item"><code classe="notranslate">dhl</code></li>
<li classe="list-inline-item"><code classe="notranslate">discover</code></li>
<li classe="list-inline-item"><code classe="notranslate">dish</code></li>
<li classe="list-inline-item"><code classe="notranslate">dnp</code></li>
<li classe="list-inline-item"><code classe="notranslate">dodge</code></li>
<li classe="list-inline-item"><code classe="notranslate">dunlop</code></li>
<li classe="lista-item-em-linha"><código classe="notranslate">dupont</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">dvag</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">edeka</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">emerck</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">epson</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">ericsson</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">erni</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">esurance</código></li>
<li classe="lista-item-em-linha"><código class="notranslate">etisalat</code></li>
<li class="list-inline-item"><code class="notranslate">eurovisão</code></li>
<li class="list-inline-item"><code class="notranslate">everbank</code></li>
<li class="list-inline-item"><code class="notranslate">extraspace</code></li>
<li class="list-inline-item"><code class="notranslate">fage</code></li>
<li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
<li class="list-inline-item"><code class="notranslate">fazendeiros</code></li>
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
<li class="list-inline-item"><code Ford</code></li>
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
<li class="list-inline-item"><code gmail</code></li>
<li class="list-inline-item"><code class="notranslate">gmo</code></li>
<li class="list-inline-item"><code class="notranslate">gmx</code></li>
<li class="list-inline-item"><code class="notranslate">godaddy</code></li>
<li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
<li class="list-inline-item"><code class="notranslate">goodyear</code></li>
<li class="list-inline-item"><code class="notranslate">goog</code></li>
<li class="list-inline-item"><code class="notranslate">google</code></li>
<li class="list-inline-item"><code class="notranslate">grainger</code></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">guardião</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">gucci</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">hbo</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">hdfc</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">hdfcbank</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">hermès</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">hisamitsu</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">hitachi</código></li>
<li classe="lista-item-em-linha"><código hkt</code></li>
<li class="list-inline-item"><code class="notranslate">honda</code></li>
<li class="list-inline-item"><code class="notranslate">honeywell</code></li>
<li class="list-inline-item"><code class="notranslate">hotmail</code></li>
<li class="list-inline-item"><code class="notranslate">hsbc</code></li>
<li class="list-inline-item"><code class="notranslate">hughes</code></li>
<li class="list-inline-item"><code class="notranslate">hyatt</code></li>
<li class="list-inline-item"><code class="notranslate">hyundai</code></li>
<li class="list-inline-item"><code class="notranslate">ibm</code></li>
<li class="lista-item-em-linha"><code class="notranslate">ieee</code></li>
<li class="lista-item-em-linha"><code class="notranslate">ifm</code></li>
<li class="lista-item-em-linha"><code class="notranslate">ikano</code></li>
<li class="lista-item-em-linha"><code class="notranslate">imdb</code></li>
<li class="lista-item-em-linha"><code class="notranslate">infiniti</code></li>
<li class="lista-item-em-linha"><code class="notranslate">intel</code></li>
<li class="lista-item-em-linha"><code class="notranslate">intuit</code></li>
<li class="lista-item-em-linha"><code class="notranslate">ipiranga</code></li>
<li class="lista-item-em-linha"><code iselecione</code></li>
<li class="lista-item-em-linha"><code class="notranslate">itau</code></li>
<li class="lista-item-em-linha"><code class="notranslate">itv</code></li>
<li class="lista-item-em-linha"><code class="notranslate">iveco</code></li>
<li class="lista-item-em-linha"><code class="notranslate">jaguar</code></li>
<li class="lista-item-em-linha"><code class="notranslate">java</code></li>
<li class="lista-item-em-linha"><code class="notranslate">jcb</code></li>
<li class="lista-item-em-linha"><code class="notranslate">jcp</code></li>
<li class="lista-item-em-linha"><code class="notranslate">jeep</code></li>
<li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
<li class="list-inline-item"><code class="notranslate">juniper</code></li>
<li class="list-inline-item"><code class="notranslate">kddi</code></li>
<li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
<li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
<li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
<li class="list-inline-item"><code class="notranslate">kfh</code></li>
<li class="list-inline-item"><code class="notranslate">kia</code></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">kinder</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">kindle</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">komatsu</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">kpmg</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">kred</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">kuokgroup</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">lacaixa</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">ladbrokes</código></li>
<li classe="lista-item-em-linha"><código Lamborghini</code></li>
<li class="list-inline-item"><code class="notranslate">Lancaster</code></li>
<li class="list-inline-item"><code class="notranslate">Lancia</code></li>
<li class="list-inline-item"><code class="notranslate">Lancome</code></li>
<li class="list-inline-item"><code class="notranslate">Landrover</code></li>
<li class="list-inline-item"><code class="notranslate">Lanxess</code></li>
<li class="list-inline-item"><code class="notranslate">Lasalle</code></li>
<li class="list-inline-item"><code class="notranslate">Latrobe</code></li>
<li class="list-inline-item"><code class="notranslate">LDS</code></li>
<li class="list-inline-item"><code class="notranslate">leclerc</code></li>
<li class="list-inline-item"><code class="notranslate">lego</code></li>
<li class="list-inline-item"><code class="notranslate">ligação</code></li>
<li class="list-inline-item"><code class="notranslate">lexus</code></li>
<li class="list-inline-item"><code class="notranslate">lidl</code></li>
<li class="list-inline-item"><code class="notranslate">estilo de vida</code></li>
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
<li classe="lista-item-em-linha"><código classe="semtranslação">Macys</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Maif</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Homem</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Manga</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Marriott</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Maserati</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Mattel</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">Mckinsey</código></li>
<li classe="lista-item-em-linha"><código class="notranslate">metlife</code></li>
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
<li class="list-inline-item"><code class="notranslate">mútuo</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">nacional</code></li>
<li class="list-inline-item"><code class="notranslate">natura</code></ li>
<li class="lista-item-em-linha"><code class="notranslate">nba</code></li>
<li class="lista-item-em-linha"><code class="notranslate">nec</code></li>
<li class="lista-item-em-linha"><code class="notranslate">netflix</code></li>
<li class="lista-item-em-linha"><code class="notranslate">neustar</code></li>
<li class="lista-item-em-linha"><code class="notranslate">newholland</code></li>
<li class="lista-item-em-linha"><code class="notranslate">nfl</code></li>
<li class="lista-item-em-linha"><code class="notranslate">nhk</code></li>
<li class="lista-item-em-linha"><code class="notranslate">nico</code></li>
<li class="lista-item-em-linha"><code Nike

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
<li class="list-inline-item"><code pccw

<li class="list-inline-item"><code class="notranslate">pfizer</code></li>
<li class="list-inline-item"><code class="notranslate">philips</code></li>
<li class="list-inline-item"><code class="notranslate">piaget</code></li>
<li class="list-inline-item"><code class="notranslate">pictet</code></li>
<li class="list-inline-item"><code class="notranslate">ping</code></li>
<li class="list-inline-item"><code class="notranslate">pioneer</code></li>
<li class="list-inline-item"><code class="notranslate">play</code></li>
<li class="list-inline-item"><code class="notranslate">playstation</code></li>
<li class="list-inline-item"><code class="notranslate">pohl</code></li>
<li class="list-inline-item"><code class="notranslate">política</code></li>
<li class="list-inline-item"><code class="notranslate">prática</code></li>
<li class="list-inline-item"><code class="notranslate">prod</code></li>
<li class="list-inline-item"><code class="notranslate">progressivo</code></li>
<li class="list-inline-item"><code class="notranslate">pru</code></li>
<li class="list-inline-item"><code class="notranslate">prudencial</code></li>
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
<li class="list-inline-item"><code class="notranslate">segurança</code></li>
<li class="list-inline-item"><code class="notranslate">sakura</code></li>
<li class="list-inline-item"><code class="notranslate">samsung</code></li>
<li class="list-inline-item"><code class="notranslate">sandvik</code></li>
<li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
<li class="list-inline-item"><code class="notranslate">sanofi</code></li>
<li class="list-inline-item"><code class="notranslate">sap</code></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">saxo</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">sbi</código></li>
<!--<li classe="lista-item-em-linha"><código classe="semtranslação">sbs</código></li>-->
<li classe="lista-item-em-linha"><código classe="semtranslação">sca</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">scb</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">schaeffler</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">schmidt</código></li>
<li classe="lista-item-em-linha"><código classe="semtranslação">schwarz</código></li>
<li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><code class="notranslate">scor</code></li>
<li class="list-inline-item"><code class="notranslate">assento</code></li>
<li class="list-inline-item"><code class="notranslate">sener</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">costurar</code></li>
<li class="list-inline-item"><code class="notranslate">sete</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">procurar</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">afiado</code></li>
<li class="list-inline-item"><code class="notranslate">shaw</code></li>
<li class="list-inline-item"><code class="notranslate">concha</code></li>
<li class="list-inline-item"><code class="notranslate">shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li>
<li class="list-inline-item"><code class="notranslate">céu</code></li>
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
<li classe="lista-item-em-linha"><código classe="notranslate">swiftcover</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">symantec</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">taobao</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">target</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">tatamotors</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">tdk</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">telecity</código></li>
<li classe="lista-item-em-linha"><código classe="notranslate">telefonica</código></li>
<li classe="lista-item-em-linha"><código class="notranslate">temasek</code></li>
<li class="list-inline-item"><code class="notranslate">teva</code></li>
<li class="list-inline-item"><code class="notranslate">tiffany</code></li>
<li class="list-inline-item"><code class="notranslate">tjx</code></li>
<li class="list-inline-item"><code class="notranslate">toray</code></li>
<li class="list-inline-item"><code class="notranslate">toshiba</code></li>
<li class="list-inline-item"><code class="notranslate">total</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">viajantes</code></li>
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
<li class="lista-item-em-linha"><code class="notranslate">yandex</code></li>
<li class="lista-item-em-linha"><code class="notranslate">yodobashi</code></li>
<li class="lista-item-em-linha"><code class="notranslate">youtube</code></li>
<li class="lista-item-em-linha"><code class="notranslate">zappos</code></li>
<li class="lista-item-em-linha"><code class="notranslate">zara</code></li>
<li class="lista-item-em-linha"><code class="notranslate">zippo</code></li>
</ul>

A partir de 18 de março de 2025, também adicionamos estes territórios ultramarinos franceses a esta lista ([por esta solicitação do GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="lista-em-linha">
<li class="lista-em-linha-item"><code class="notranslate">bzh</code></li>
<li class="lista-em-linha-item"><code class="notranslate">gf</code></li>
<li class="lista-em-linha-item"><code class="notranslate">gp</code></li>
<li class="lista-em-linha-item"><code class="notranslate">mq</code></li>
<li class="lista-em-linha-item"><code class="notranslate">nc</code></li>
<li class="lista-em-linha-item"><code class="notranslate">pf</code></li>
<li class="lista-em-linha-item"><code class="notranslate">pm</code></li>
<li class="lista-em-linha-item"><code class="notranslate">re</code></li>
<li classe="lista-item-em-linha"><código classe="não-translação">tf</código></li>
<li classe="lista-item-em-linha"><código classe="não-translação">wf</código></li>
<li classe="lista-item-em-linha"><código classe="não-translação">yt</código></li>
</ul>

A partir de 8 de julho de 2025, adicionamos estes países específicos da Europa:

<ul class="lista-em-linha">
<li class="lista-em-linha-item"><code class="notranslate">ax</code></li>
<li class="lista-em-linha-item"><code class="notranslate">bg</code></li>
<li class="lista-em-linha-item"><code class="notranslate">fo</code></li>
<li class="lista-em-linha-item"><code class="notranslate">gi</code></li>
<li class="lista-em-linha-item"><code class="notranslate">gr</code></li>
<li class="lista-em-linha-item"><code class="notranslate">hr</code></li>
<li class="lista-em-linha-item"><code class="notranslate">hu</code></li>
<li class="lista-em-linha-item"><code class="notranslate">lt</code></li>
<li class="lista-em-linha-item"><code lu</code></li>
<li class="list-inline-item"><code class="notranslate">mc</code></li>
<li class="list-inline-item"><code class="notranslate">mk</code></li>
<li class="list-inline-item"><code class="notranslate">mt</code></li>
<li class="list-inline-item"><code class="notranslate">ro</code></li>
<li class="list-inline-item"><code class="notranslate">sk</code></li>
<li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

Especificamente não incluímos `cz`, `ru` e `ua` devido à alta atividade de spam.

### Quais são os seus critérios de lista de permissões {#what-is-your-allowlist-criteria}

Temos uma lista estática de [extensões de nomes de domínio permitidas por padrão](#what-domain-name-extensions-are-allowlisted-by-default) – e também mantemos uma lista de permissões dinâmica, armazenada em cache e contínua, com base nos seguintes critérios rigorosos:

* O domínio raiz do remetente deve ser de [extensão de nome de domínio que corresponde à lista que oferecemos em nosso plano gratuito](#what-domain-name-extensions-can-be-used-for-free) (com a adição de `biz` e `info`). Também incluímos correspondências parciais de `edu`, `gov` e `mil`, como `xyz.gov.au` e `xyz.edu.au`.
* O domínio raiz do remetente deve estar entre os 100.000 principais resultados analisados de domínio raiz exclusivo de [Lista de popularidade do guarda-chuva](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* O domínio raiz do remetente deve estar entre os 50.000 principais resultados de domínios raiz exclusivos que apareceram em pelo menos 4 dos últimos 7 dias de UPLs (~50%+).
* O domínio raiz do remetente não deve ser [categorizado](https://radar.cloudflare.com/categorization-feedback/) como conteúdo adulto ou malware pela Cloudflare.
* O domínio raiz do remetente deve ter registros A ou MX definidos.
* O domínio raiz do remetente deve ter registro(s) A, registro(s) MX, registro DMARC com `p=reject` ou `p=quarantine`, ou um registro SPF com qualificador `-all` ou `~all`.

Se este critério for atendido, o domínio raiz do remetente será armazenado em cache por 7 dias. Observe que nossa tarefa automatizada é executada diariamente – portanto, este é um cache de lista de permissões contínua que é atualizado diariamente.

Nosso trabalho automatizado baixará os 7 dias anteriores de UPLs na memória, descompactará-os e, em seguida, analisará a memória de acordo com os critérios rigorosos acima.

Domínios populares no momento em que este artigo foi escrito, como Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify e mais, estão incluídos, é claro.

Se você for um remetente que não está na nossa lista de permissões, na primeira vez que seu domínio raiz FQDN ou endereço IP enviar um e-mail, você será [taxa limitada](#do-you-have-rate-limiting) e [na lista cinza](#do-you-have-a-greylist). Observe que esta é uma prática padrão adotada como padrão de e-mail. A maioria dos clientes de servidores de e-mail tentará uma nova tentativa se receber um erro de limite de taxa ou de lista cinza (por exemplo, um código de status de erro de nível 421 ou 4xx).

**Observe que remetentes específicos, como `a@gmail.com`, `b@xyz.edu` e `c@gov.au` ainda podem ser [na lista de negação](#do-you-have-a-denylist)** (por exemplo, se detectarmos automaticamente spam, phishing ou malware desses remetentes).

### Quais extensões de nome de domínio podem ser usadas gratuitamente {#what-domain-name-extensions-can-be-used-for-free}

Em 31 de março de 2023, implementamos uma nova regra geral contra spam para proteger nossos usuários e serviços.

Esta nova regra permite que apenas as seguintes extensões de nome de domínio sejam usadas em nosso plano gratuito:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">em</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">ser</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">por</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
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
<li class="list-inline-item"><code class="notranslate">família</code></li>
<li class="list-inline-item"><code class="notranslate">fi</code></li>
<li class="list-inline-item"><code class="notranslate">fm</code></li>
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
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
<li class="list-inline-item"><code jp

ke

kr

la

la

lv

lv

lv

lv

ly

md

md

md

md

me classe="lista-item-em-linha"><código classe="não-translação">mn</código></li>
<li classe="lista-item-em-linha"><código classe="não-translação">ms</código></li>
<li classe="lista-item-em-linha"><código classe="não-translação">mu</código></li>
<li classe="lista-item-em-linha"><código classe="não-translação">mx</código></li>
<li classe="lista-item-em-linha"><código classe="não-translação">net</código></li>
<li classe="lista-item-em-linha"><código classe="não-translação">ni</código></li>
<li classe="lista-item-em-linha"><código classe="não-translação">nl</código></li>
<li classe="lista-item-em-linha"><código classe="não-translação">no</código></li>
<li classe="lista-item-em-linha"><código classe="não-translação">nu</código></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code tv</code></li>
<li class="list-inline-item"><code class="notranslate">reino unido</code></li>
<li class="list-inline-item"><code class="notranslate">eua</code></li>
<li class="list-inline-item"><code class="notranslate">uz</code></li>
<li class="list-inline-item"><code class="notranslate">vc</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li classe="lista-item-em-linha"><código classe="notranslate">za</código></li>
</ul>

### Você tem uma lista cinza {#do-you-have-a-greylist}

Sim, usamos uma política muito flexível de [lista cinza de e-mail](https://en.wikipedia.org/wiki/Greylisting_\(email\)). A lista cinza só se aplica a remetentes que não estão na nossa lista de permissões e permanece em nosso cache por 30 dias.

Para cada novo remetente, armazenamos uma chave em nosso banco de dados Redis por 30 dias, com um valor definido como o horário de chegada da primeira solicitação. Em seguida, rejeitamos o e-mail com um código de status de nova tentativa 450 e só permitimos a passagem após 5 minutos.

Se eles esperarem com sucesso 5 minutos a partir desse horário de chegada inicial, seus e-mails serão aceitos e eles não receberão esse código de status 450.

A chave consiste no domínio raiz do FQDN ou no endereço IP do remetente. Isso significa que qualquer subdomínio que passe pela lista cinza também passará pelo domínio raiz e vice-versa (é isso que queremos dizer com uma política "muito permissiva").

Por exemplo, se um e-mail for enviado de `test.example.com` antes de recebermos um e-mail de `example.com`, qualquer e-mail de `test.example.com` e/ou `example.com` terá que aguardar 5 minutos a partir do horário de chegada inicial da conexão. Não fazemos com que `test.example.com` e `example.com` aguardem seus próprios períodos de 5 minutos (nossa política de lista cinza se aplica ao nível do domínio raiz).

Observe que a lista cinza não se aplica a nenhum remetente em nosso [lista de permissões](#do-you-have-an-allowlist) (por exemplo, Meta, Amazon, Netflix, Google, Microsoft no momento em que este artigo foi escrito).

### Você tem uma lista de bloqueios {#do-you-have-a-denylist}

Sim, operamos nossa própria lista de bloqueios e a atualizamos automaticamente em tempo real e manualmente com base em spam e atividades maliciosas detectadas.

Também obtemos todos os endereços IP da lista de bloqueio de nível 1 do UCEPROTECT em <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> a cada hora e os inserimos em nossa lista de bloqueio com validade de 7 dias.

Os remetentes encontrados na lista de bloqueio receberão um código de erro 421 (que indica ao remetente para tentar novamente mais tarde) se eles [não estão na lista de permissões](#do-you-have-an-allowlist).

Ao usar um código de status 421 em vez de um código de status 554, possíveis falsos positivos podem ser atenuados em tempo real e, então, a mensagem pode ser entregue com sucesso na próxima tentativa.

**Isso é diferente de outros serviços de e-mail**, onde, se você for colocado em uma lista de bloqueio, ocorre uma falha grave e permanente. Muitas vezes, é difícil pedir aos remetentes que tentem novamente as mensagens (especialmente de grandes organizações) e, portanto, essa abordagem dá cerca de 5 dias a partir da tentativa inicial de envio do e-mail para que o remetente, o destinatário ou nós intervenhamos e solucionemos o problema (solicitando a remoção da lista de bloqueio).

Todas as solicitações de remoção da lista de bloqueios são monitoradas em tempo real pelos administradores (por exemplo, para que falsos positivos recorrentes possam ser permanentemente incluídos na lista de permissões pelos administradores).

Solicitações de remoção da lista de bloqueio podem ser solicitadas em <https://forwardemail.net/denylist>. Usuários pagos têm suas solicitações de remoção da lista de bloqueio processadas instantaneamente, enquanto usuários não pagos devem esperar que os administradores processem suas solicitações.

Os remetentes que forem detectados enviando spam ou conteúdo viral serão adicionados à lista de negação da seguinte forma:

1. O [impressão digital da mensagem inicial](#how-do-you-determine-an-email-fingerprint) é colocado na lista cinza após a detecção de spam ou bloqueio de um remetente "confiável" (por exemplo, `gmail.com`, `microsoft.com`, `apple.com`).
* Se o remetente estiver na lista de permissões, a mensagem ficará na lista cinza por 1 hora.
* Se o remetente não estiver na lista de permissões, a mensagem ficará na lista cinza por 6 horas.
2. Analisamos as chaves da lista de bloqueio a partir das informações do remetente e da mensagem e, para cada uma dessas chaves, criamos (se ainda não existir) um contador, incrementamos em 1 e o armazenamos em cache por 24 horas.
* Para remetentes na lista de permissões:
* Adicione uma chave para o endereço de e-mail do envelope "MAIL FROM" se ele tivesse SPF válido ou não, e não fosse [um nome de usuário do postmaster](#what-are-postmaster-addresses) ou [um nome de usuário sem resposta](#what-are-no-reply-addresses).
* Se o cabeçalho "From" foi incluído na lista de permissões, adicione uma chave para o endereço de e-mail do cabeçalho "From" se ele tivesse SPF válido ou DKIM válido e alinhado.
* Se o cabeçalho "From" não foi incluído na lista de permissões, adicione uma chave para o endereço de e-mail do cabeçalho "From" e seu nome de domínio raiz analisado.
* Para remetentes não incluídos na lista de permissões:
* Adicione uma chave para o endereço de e-mail do envelope "MAIL FROM" se ele tivesse SPF válido.
* Se o cabeçalho "From" foi incluído na lista de permissões, adicione uma chave para o endereço de e-mail do cabeçalho "From" se ele tivesse SPF válido ou DKIM válido e alinhado.

* Se o cabeçalho "De" não estiver na lista de permissões, adicione uma chave para o endereço de e-mail do cabeçalho "De" e seu nome de domínio raiz analisado.
* Adicione uma chave para o endereço IP remoto do remetente.
* Adicione uma chave para o nome do host resolvido pelo cliente por meio de pesquisa reversa a partir do endereço IP do remetente (se houver).
* Adicione uma chave para o domínio raiz do nome do host resolvido pelo cliente (se houver e se for diferente do nome do host resolvido pelo cliente).
3. Se o contador atingir 5 para um remetente e uma chave não incluídos na lista de permissões, a chave será bloqueada por 30 dias e um e-mail será enviado à nossa equipe de abuso. Esses números podem mudar e as atualizações serão refletidas aqui enquanto monitoramos o abuso.
4. Se o contador atingir 10 para um remetente e uma chave incluídos na lista de permissões, a chave será bloqueada por 7 dias e um e-mail será enviado à nossa equipe de abuso. Esses números podem mudar e as atualizações serão refletidas aqui enquanto monitoramos o abuso.

> **NOTA:** Em breve, introduziremos o monitoramento de reputação. O monitoramento de reputação calculará quando um remetente deve ser colocado na lista de bloqueios com base em um limite percentual (em vez de um contador rudimentar, como mencionado acima).

### Você tem limitação de taxa {#do-you-have-rate-limiting}

A limitação de taxa do remetente é feita pelo domínio raiz analisado a partir de uma consulta PTR reversa no endereço IP do remetente – ou, se isso não gerar um resultado, simplesmente usa o endereço IP do remetente. Observe que nos referimos a isso como `Sender` abaixo.

Nossos servidores MX têm limites diários para e-mails recebidos para [armazenamento IMAP criptografado](/blog/docs/best-quantum-safe-encrypted-email-service):

* Em vez de limitar a taxa de recebimento de e-mails com base em um alias individual (por exemplo, `you@yourdomain.com`), limitamos a taxa pelo próprio nome de domínio do alias (por exemplo, `yourdomain.com`). Isso evita que `Senders` inunde as caixas de entrada de todos os alias do seu domínio de uma só vez.

* Temos limites gerais que se aplicam a todos os `Senders` em nosso serviço, independentemente do destinatário:
* `Senders` que consideramos "confiáveis" como fonte de verdade (por exemplo, `gmail.com`, `microsoft.com`, `apple.com`) estão limitados ao envio de 100 GB por dia.
* `Senders` que são [na lista de permissões](#do-you-have-an-allowlist) estão limitados ao envio de 10 GB por dia.
* Todos os outros `Senders` estão limitados ao envio de 1 GB e/ou 1000 mensagens por dia.
* Temos um limite específico por `Sender` e `yourdomain.com` de 1 GB e/ou 1000 mensagens diárias.

Os servidores MX também limitam o encaminhamento de mensagens para um ou mais destinatários por meio de limitação de taxa – mas isso se aplica apenas ao `Senders` e não ao [lista de permissões](#do-you-have-an-allowlist):

* Permitimos apenas até 100 conexões por hora, por domínio raiz FQDN resolvido `Sender` (ou) endereço IP remoto `Sender` (se nenhum PTR reverso estiver disponível) e por destinatário de envelope. Armazenamos a chave para limitação de taxa como um hash criptográfico em nosso banco de dados Redis.

* Se você estiver enviando e-mails pelo nosso sistema, certifique-se de ter um PTR reverso configurado para todos os seus endereços IP (caso contrário, cada domínio raiz FQDN exclusivo ou endereço IP do qual você enviar terá taxa limitada).

* Observe que se você enviar por meio de um sistema popular como o Amazon SES, sua taxa não será limitada, pois (no momento em que este artigo foi escrito) o Amazon SES está listado em nossa lista de permissões.

* Se você estiver enviando de um domínio como `test.abc.123.example.com`, o limite de taxa será imposto a `example.com`. Muitos spammers usam centenas de subdomínios para contornar filtros de spam comuns que limitam a taxa apenas a nomes de host exclusivos, em vez de domínios raiz FQDN exclusivos.

* `Senders` que excederem o limite de taxa serão rejeitados com um erro 421.

Nossos servidores IMAP e SMTP limitam seus aliases de ter mais de `60` conexões simultâneas.

Nossos servidores MX limitam os remetentes de [não permitido na lista](#do-you-have-an-allowlist) de estabelecer mais de 10 conexões simultâneas (com expiração de cache de 3 minutos para o contador, o que reflete nosso tempo limite de soquete de 3 minutos).

### Como você se protege contra retrodispersão {#how-do-you-protect-against-backscatter}

Rejeições mal direcionadas ou spam de rejeição (conhecido como "[Retrodispersão](https://en.wikipedia.org/wiki/Backscatter_\(email\))") podem causar reputação negativa aos endereços IP do remetente.

Tomamos duas medidas para proteger contra a retrodispersão, que são detalhadas nas seções [Evite rejeições de spammers conhecidos](#prevent-bounces-from-known-mail-from-spammers) e [Evite saltos desnecessários para proteger contra retrodispersão](#prevent-unnecessary-bounces-to-protect-against-backscatter) abaixo.

### Evita rejeições de spammers conhecidos de MAIL FROM {#prevent-bounces-from-known-mail-from-spammers}

Extraímos a lista de [Backscatter.org](https://www.backscatterer.org/) (desenvolvido por [UCEPROTECT](https://www.uceprotect.net/)) em <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> a cada hora e a inserimos em nosso banco de dados Redis (também comparamos a diferença antecipadamente; caso algum IP tenha sido removido e precise ser respeitado).

Se MAIL FROM estiver em branco OU for igual a (sem distinção de maiúsculas e minúsculas) qualquer um dos [endereços do carteiro](#what-are-postmaster-addresses) (a parte antes do @ em um e-mail), então verificamos se o IP do remetente corresponde a um desta lista.

Se o IP do remetente estiver listado (e não em nosso [lista de permissões](#do-you-have-an-allowlist)), enviaremos um erro 554 com a mensagem `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Seremos alertados se um remetente estiver na lista de Backscatterer e em nossa lista de permissões para que possamos resolver o problema, se necessário.

As técnicas descritas nesta seção seguem a recomendação "MODO SEGURO" em <https://www.backscatterer.org/?target=usage> – onde só verificamos o IP do remetente se determinadas condições já tiverem sido atendidas.

### Evite rejeições desnecessárias para proteger contra retrodispersão {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Rejeições são e-mails que indicam que o encaminhamento falhou completamente para o destinatário e que o e-mail não será tentado novamente.

Um motivo comum para ser listado na lista do Backscatterer são rejeições mal direcionadas ou spam de rejeição, então devemos nos proteger contra isso de algumas maneiras:

1. Enviamos somente quando ocorrem >= 500 erros de código de status (quando as tentativas de encaminhamento de e-mails falham, por exemplo, o Gmail responde com um erro de nível 500).

2. Enviamos apenas uma vez (usamos uma chave de impressão digital de rejeição calculada e a armazenamos em cache para evitar o envio de duplicatas). A impressão digital de rejeição é uma chave que representa a impressão digital da mensagem combinada com um hash do endereço de rejeição e seu código de erro. Consulte a seção sobre [Impressão digital](#how-do-you-determine-an-email-fingerprint) para obter mais informações sobre como a impressão digital da mensagem é calculada. As impressões digitais de rejeição enviadas com sucesso expirarão após 7 dias em nosso cache do Redis.

3. Enviamos somente quando o MAIL FROM e/ou From não estiver em branco e não contiver (sem distinção de maiúsculas e minúsculas) um [nome de usuário do postmaster](#what-are-postmaster-addresses) (a parte antes do @ em um e-mail).

4. Não enviaremos se a mensagem original tiver algum dos seguintes cabeçalhos (sem distinção de maiúsculas e minúsculas):

* Cabeçalho de `auto-submitted` com valor diferente de `no`.
* Cabeçalho de `x-auto-response-suppress` com valor de `dr`, `autoreply`, `auto-reply`, `auto_reply` ou `all`
* Cabeçalho de `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` ou `x-auto-respond` (independentemente do valor).
* Cabeçalho de `precedence` com valor de `bulk`, `autoreply`, `auto-reply`, `auto_reply` ou `list`.

5. Não enviaremos se o endereço de e-mail MAIL FROM ou From terminar com `+donotreply`, `-donotreply`, `+noreply` ou `-noreply`.

6. Não enviaremos se a parte do nome de usuário do endereço de e-mail De for `mdaemon` e tiver um cabeçalho que não diferencia maiúsculas de minúsculas de `X-MDDSN-Message`.

7. Não enviaremos se houver um cabeçalho `content-type` sem distinção entre maiúsculas e minúsculas de `multipart/report`.

### Como você determina uma impressão digital de e-mail {#how-do-you-determine-an-email-fingerprint}

A impressão digital de um e-mail é usada para determinar a exclusividade de um e-mail e para evitar que mensagens duplicadas sejam entregues e [rejeições duplicadas](#prevent-unnecessary-bounces-to-protect-against-backscatter) sejam enviadas.

A impressão digital é calculada a partir da seguinte lista:

* Nome do host ou endereço IP do FQDN resolvido pelo cliente
* Valor do cabeçalho `Message-ID` (se houver)
* Valor do cabeçalho `Date` (se houver)
* Valor do cabeçalho `From` (se houver)
* Valor do cabeçalho `To` (se houver)
* Valor do cabeçalho `Cc` (se houver)
* Valor do cabeçalho `Subject` (se houver)
* Valor do cabeçalho `Body` (se houver)

### Posso encaminhar e-mails para portas diferentes da 25 (por exemplo, se meu ISP bloqueou a porta 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Sim, adicionamos esse recurso desde 5 de maio de 2020. No momento, ele é específico para cada domínio, e não para cada alias. Se você precisar que ele seja específico para cada alias, entre em contato conosco para nos informar sobre suas necessidades.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Proteção de Privacidade Aprimorada:
</strong>
<span>
Se você possui um plano pago (que oferece proteção de privacidade aprimorada), acesse <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a>, clique em "Configurações" ao lado do seu domínio e, em seguida, clique em "Configurações". Se quiser saber mais sobre planos pagos, consulte nossa página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Preços</a>. Caso contrário, você pode continuar seguindo as instruções abaixo.
</span>
</div>

Se você estiver no plano gratuito, basta adicionar um novo registro DNS <strong class="notranslate">TXT</strong>, conforme mostrado abaixo, mas altere a porta de 25 para a porta de sua escolha.

Por exemplo, se eu quiser que todos os e-mails que vão para `example.com` sejam encaminhados para a porta SMTP 1337 dos destinatários do alias em vez de 25:

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
<td><em>"@", "." ou em branco</em></td>
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
O cenário mais comum para a configuração de encaminhamento de porta personalizado é quando você deseja encaminhar todos os e-mails que vão para example.com para uma porta diferente em example.com, diferente do padrão SMTP da porta 25. Para configurar isso, basta adicionar o seguinte registro catch-all <strong class="notranslate">TXT</strong>.
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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Ele oferece suporte ao símbolo de mais + para aliases do Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

Sim, com certeza.

### Ele suporta subdomínios {#does-it-support-sub-domains}

Sim, com certeza. Em vez de usar "@", "." ou espaço em branco como nome/host/alias, use apenas o nome do subdomínio como valor.

Se você quiser que `foo.example.com` encaminhe e-mails, insira `foo` como o valor de nome/host/alias nas suas configurações de DNS (para registros MX e <strong class="notranslate">TXT</strong>).

### Isso encaminha os cabeçalhos do meu e-mail {#does-this-forward-my-emails-headers}

Sim, com certeza.

### Este é um {#is-this-well-tested} bem testado

Sim, ele tem testes escritos com [ava](https://github.com/avajs/ava) e também tem cobertura de código.

### Você passa adiante mensagens e códigos de resposta SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

Sim, com certeza. Por exemplo, se você estiver enviando um e-mail para `hello@example.com` e ele estiver registrado para encaminhar para `user@gmail.com`, a mensagem de resposta SMTP e o código do servidor SMTP "gmail.com" serão retornados em vez do servidor proxy em "mx1.forwardemail.net" ou "mx2.forwardemail.net".

### Como você previne spammers e garante uma boa reputação de encaminhamento de e-mail {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Veja nossas seções sobre [Como funciona o seu sistema de encaminhamento de e-mail](#how-does-your-email-forwarding-system-work), [Como você lida com problemas de entrega de e-mail](#how-do-you-handle-email-delivery-issues) e [Como você lida com o bloqueio dos seus endereços IP](#how-do-you-handle-your-ip-addresses-becoming-blocked) acima.

### Como você executa pesquisas de DNS em nomes de domínio {#how-do-you-perform-dns-lookups-on-domain-names}

Criamos um projeto de software de código aberto :tangerine: [tangerina](https://github.com/forwardemail/tangerine) e o utilizamos para consultas de DNS. Os servidores DNS padrão usados são `1.1.1.1` e `1.0.0.1`, e as consultas de DNS são feitas por meio de [DNS sobre HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") na camada de aplicação.

:tangerine: [tangerina](https://github.com/tangerine) usa [o serviço DNS de consumidor com foco em privacidade da CloudFlare por padrão][cloudflare-dns].

## Conta e Faturamento {#account-and-billing}

### Vocês oferecem garantia de devolução de dinheiro em planos pagos {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Sim! Os reembolsos automáticos ocorrem quando você faz upgrade, downgrade ou cancela sua conta dentro de 30 dias a partir do início do seu plano. Isso se aplica apenas a novos clientes.

### Se eu mudar de plano, vocês fazem o rateio e reembolsam a diferença {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Não rateamos nem reembolsamos a diferença quando você troca de plano. Em vez disso, convertemos a duração restante da data de expiração do seu plano atual para a duração relativa mais próxima do seu novo plano (arredondada para baixo por mês).

Observe que se você fizer upgrade ou downgrade entre planos pagos dentro de um período de 30 dias desde o início de um plano pago, reembolsaremos automaticamente o valor total do seu plano existente.

### Posso usar este serviço de encaminhamento de e-mail como um servidor MX "fallback" ou "fallover" {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Não, não é recomendado, pois você só pode usar um servidor de troca de e-mails por vez. Os fallbacks geralmente nunca são repetidos devido a configurações incorretas de prioridade e servidores de e-mail que não respeitam a verificação de prioridade de troca MX.

### Posso desabilitar aliases específicos {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se você estiver em um plano pago, acesse <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases <i class="fa fa-angle-right"></i> Editar Alias <i class="fa fa-angle-right"></i> Desmarque a caixa de seleção "Ativo" <i class="fa fa-angle-right"></i> Continuar.
</span>
</div>

Sim, basta editar seu registro DNS <strong class="notranslate">TXT</strong> e prefixar o alias com um, dois ou três pontos de exclamação (veja abaixo).

Observe que você *deve* preservar o mapeamento ":", pois ele será necessário caso você decida desativá-lo (e também será usado para importação se você fizer upgrade para um de nossos planos pagos).

**Para rejeição silenciosa (parece ao remetente que a mensagem foi enviada com sucesso, mas na verdade não leva a lugar nenhum) (código de status `250`):** Se você prefixar um alias com "!" (ponto de exclamação simples), ele retornará um código de status bem-sucedido de `250` para remetentes que tentarem enviar para esse endereço, mas os e-mails em si não levarão a lugar nenhum (por exemplo, um buraco negro ou `/dev/null`).

**Para rejeição suave (código de status `421`):** Se você prefixar um alias com "!!" (ponto de exclamação duplo), ele retornará um código de status de erro suave de `421` para remetentes que tentarem enviar para esse endereço, e os e-mails geralmente serão tentados novamente por até 5 dias antes da rejeição e devolução.

**Para rejeição definitiva (código de status `550`):** Se você prefixar um alias com "!!!" (ponto de exclamação triplo), ele retornará um código de status de erro permanente de `550` para remetentes que tentarem enviar para esse endereço e os e-mails serão rejeitados e devolvidos.

Por exemplo, se eu quiser que todos os e-mails que vão para `alias@example.com` parem de fluir para `user@gmail.com` e sejam rejeitados e devolvidos (por exemplo, use três pontos de exclamação):

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
<td><em>"@", "." ou em branco</em></td>
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
Você também pode reescrever o endereço do destinatário encaminhado para simplesmente "nobody@forwardemail.net", o que o encaminhará para nobody, como no exemplo abaixo.
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
<td><em>"@", "." ou em branco</em></td>
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
Se desejar maior segurança, você também pode remover a parte ":user@gmail.com" (ou ":nobody@forwardemail.net"), deixando apenas "!!!alias", como no exemplo abaixo.
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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### Posso encaminhar e-mails para vários destinatários {#can-i-forward-emails-to-multiple-recipients}

Sim, com certeza. Basta especificar vários destinatários nos seus registros <strong class="notranslate">TXT</strong>.

Por exemplo, se eu quiser que um e-mail que vai para `hello@example.com` seja encaminhado para `user+a@gmail.com` e `user+b@gmail.com`, então meu registro <strong class="notranslate">TXT</strong> ficaria assim:

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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Ou você pode especificá-los em duas linhas separadas, como esta:

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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Você decide!

### Posso ter vários destinatários globais catch-all {#can-i-have-multiple-global-catch-all-recipients}

Sim, você pode. Basta especificar vários destinatários globais nos seus registros <strong class="notranslate">TXT</strong>.

Por exemplo, se eu quiser que cada e-mail que vai para `*@example.com` (o asterisco significa que é um curinga, também conhecido como catch-all) seja encaminhado para `user+a@gmail.com` e `user+b@gmail.com`, então meu registro <strong class="notranslate">TXT</strong> ficaria assim:

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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Ou você pode especificá-los em duas linhas separadas, como esta:

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
<td><em>"@", "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, "." ou em branco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Você decide!

### Existe um limite máximo para o número de endereços de e-mail para os quais posso encaminhar por alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Sim, o limite padrão é 10. Isso NÃO significa que você só pode ter 10 aliases em seu nome de domínio. Você pode ter quantos aliases quiser (sem limites). Isso significa que você só pode encaminhar um alias para 10 endereços de e-mail exclusivos. Você pode ter `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (de 1 a 10) – e quaisquer e-mails enviados para `hello@example.com` serão encaminhados para `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (de 1 a 10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dica:
</strong>
<span>
Precisa de mais de 10 destinatários por alias? Envie-nos um e-mail e teremos prazer em aumentar o limite da sua conta.
</span>
</div>

### Posso encaminhar e-mails recursivamente {#can-i-recursively-forward-emails}

Sim, você pode, mas ainda precisa respeitar o limite máximo. Se você tiver `hello:linus@example.com` e `linus:user@gmail.com`, os e-mails para `hello@example.com` serão encaminhados para `linus@example.com` e `user@gmail.com`. Observe que um erro será gerado se você tentar encaminhar e-mails recursivamente além do limite máximo.

### As pessoas podem cancelar o registro ou registrar meu encaminhamento de e-mail sem minha permissão {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Utilizamos a verificação de registros MX e <strong class="notranslate">TXT</strong>, portanto, se você adicionar os respectivos registros MX e <strong class="notranslate">TXT</strong> deste serviço, estará registrado. Se removê-los, deixará de ser registrado. Você detém a propriedade do seu domínio e o gerenciamento de DNS, portanto, se alguém tiver acesso a isso, isso será um problema.

### Como é grátis {#how-is-it-free}

O Forward Email oferece um nível gratuito por meio de uma combinação de desenvolvimento de código aberto, infraestrutura eficiente e planos pagos opcionais que dão suporte ao serviço.

Nosso nível gratuito conta com o suporte de:

1. **Desenvolvimento de código aberto**: Nossa base de código é de código aberto, permitindo contribuições da comunidade e operação transparente.

2. **Infraestrutura eficiente**: otimizamos nossos sistemas para lidar com o encaminhamento de e-mails com o mínimo de recursos.

3. **Planos Premium Pagos**: Usuários que precisam de recursos adicionais, como envio SMTP, recebimento IMAP ou opções de privacidade aprimoradas, assinam nossos planos pagos.

4. **Limites de uso razoáveis**: o nível gratuito tem políticas de uso justo para evitar abusos.

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### Qual é o limite máximo de tamanho de e-mail {#what-is-the-max-email-size-limit}

Nosso limite de tamanho padrão é de 50 MB, incluindo conteúdo, cabeçalhos e anexos. Observe que serviços como Gmail e Outlook permitem apenas 25 MB. Se você exceder esse limite ao enviar para endereços desses provedores, receberá uma mensagem de erro.

Um erro com o código de resposta adequado será retornado se o limite de tamanho do arquivo for excedido.

### Você armazena registros de e-mails {#do-you-store-logs-of-emails}

Não, não gravamos em disco nem armazenamos logs – com o [exceção de erros](#do-you-store-error-logs) e o [SMTP de saída](#do-you-support-sending-email-with-smtp) (veja nosso [política de Privacidade](/privacy)).

Tudo é feito na memória e [nosso código fonte está no GitHub](https://github.com/forwardemail).

### Você armazena logs de erros {#do-you-store-error-logs}

**Sim. Você pode acessar os logs de erros em [Minha conta → Registros](/my-account/logs) ou [Minha Conta → Domínios](/my-account/domains).**

A partir de fevereiro de 2023, armazenamos logs de erros para os códigos de resposta SMTP `4xx` e `5xx` por um período de 7 dias – que contêm o erro SMTP, o envelope e os cabeçalhos de e-mail (nós **não** armazenamos o corpo do e-mail nem os anexos).

Os logs de erros permitem verificar e-mails importantes ausentes e mitigar falsos positivos de spam para [seus domínios](/my-account/domains). Eles também são um ótimo recurso para depurar problemas com [webhooks de e-mail](#do-you-support-webhooks) (já que os logs de erros contêm a resposta do endpoint do webhook).

Os logs de erro para [limitação de taxa](#do-you-have-rate-limiting) e [lista cinza](#do-you-have-a-greylist) não estão acessíveis porque a conexão termina mais cedo (por exemplo, antes que os comandos `RCPT TO` e `MAIL FROM` possam ser transmitidos).

Veja nosso [política de Privacidade](/privacy) para mais informações.

### Você lê meus e-mails {#do-you-read-my-emails}

Não, absolutamente não. Veja nosso [política de Privacidade](/privacy).

Muitos outros serviços de encaminhamento de e-mail armazenam e podem ler seus e-mails. Não há motivo para que os e-mails encaminhados precisem ser armazenados em disco — e, por isso, arquitetamos a primeira solução de código aberto que faz tudo isso na memória.

Acreditamos que você tem direito à privacidade e o respeitamos rigorosamente. O código implantado no servidor é [software de código aberto no GitHub](https://github.com/forwardemail) para transparência e construção de confiança.

### Posso "enviar e-mail como" no Gmail com este {#can-i-send-mail-as-in-gmail-with-this}

Sim! Adicionamos esse recurso desde 2 de outubro de 2018. Veja [Como enviar e-mails usando o Gmail](#how-to-send-mail-as-using-gmail) acima!

Você também deve definir o registro SPF para o Gmail no seu registro <strong class="notranslate">TXT</strong> de configuração de DNS.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se você estiver usando o Gmail (por exemplo, Enviar e-mail como) ou o G Suite, precisará anexar <code>include:_spf.google.com</code> ao seu registro SPF <strong class="notranslate">TXT</strong>, por exemplo:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Posso "enviar e-mail como" no Outlook com este {#can-i-send-mail-as-in-outlook-with-this}

Sim! Adicionamos esse recurso desde 2 de outubro de 2018. Basta visualizar estes dois links da Microsoft abaixo:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Você também deve definir o registro SPF para o Outlook no seu registro <strong class="notranslate">TXT</strong> de configuração de DNS.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se estiver usando o Microsoft Outlook ou o Live.com, você precisará anexar <code>include:spf.protection.outlook.com</code> ao seu registro SPF <strong class="notranslate">TXT</strong>, por exemplo:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Posso "enviar e-mail como" no Apple Mail e no iCloud Mail com este {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Se você for assinante do iCloud+, poderá usar um domínio personalizado. [Nosso serviço também é compatível com o Apple Mail](#apple-mail).

Consulte <https://support.apple.com/en-us/102540> para obter mais informações.

### Posso encaminhar e-mails ilimitados com este {#can-i-forward-unlimited-emails-with-this}

Sim, porém remetentes "relativamente desconhecidos" têm uma taxa limitada a 100 conexões por hora por nome de host ou IP. Consulte a seção sobre [Limitação de taxa](#do-you-have-rate-limiting) e [Lista cinza](#do-you-have-a-greylist) acima.

Por "relativamente desconhecido", queremos dizer remetentes que não aparecem no [lista de permissões](#do-you-have-an-allowlist).

Se esse limite for excedido, enviamos um código de resposta 421 que informa ao servidor de e-mail do remetente para tentar novamente mais tarde.

### Vocês oferecem domínios ilimitados por um preço único {#do-you-offer-unlimited-domains-for-one-price}

Sim. Independentemente do seu plano, você pagará apenas uma mensalidade, que cobre todos os seus domínios.

### Quais métodos de pagamento você aceita {#which-payment-methods-do-you-accept}

O Forward Email aceita os seguintes métodos de pagamento único ou mensal/trimestral/anual:

1. **Cartões de crédito/débito/transferências bancárias**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, etc.
2. **PayPal**: Conecte sua conta do PayPal para pagamentos fáceis.
3. **Criptomoedas**: Aceitamos pagamentos via stablecoins da Stripe nas redes Ethereum, Polygon e Solana.

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

Todos os pagamentos são processados com segurança pelo Stripe ou PayPal. Seus dados de pagamento nunca são armazenados em nossos servidores.

## Recursos adicionais {#additional-resources}

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [Estudos de caso e documentação do desenvolvedor](/blog/docs)
* [Recursos](/resources)
* [Guias](/guides)

[gmail-2fa]: __URL_PROTEGIDA_868__

[cloudflare-dns]: __URL_PROTEGIDA_869__