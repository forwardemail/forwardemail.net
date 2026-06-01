# Sobre o Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Equipe e história da empresa Forward Email" class="rounded-lg" />

# Sobre o Forward Email {#about-forward-email-1}


## Índice {#table-of-contents}

* [Visão Geral](#overview)
* [Fundador e Missão](#founder-and-mission)
* [Linha do Tempo](#timeline)
  * [2017 - Fundação e Lançamento](#2017---founding-and-launch)
  * [2018 - Infraestrutura e Integração](#2018---infrastructure-and-integration)
  * [2019 - Revolução de Performance](#2019---performance-revolution)
  * [2020 - Foco em Privacidade e Segurança](#2020---privacy-and-security-focus)
  * [2021 - Modernização da Plataforma](#2021---platform-modernization)
  * [2023 - Expansão de Infraestrutura e Funcionalidades](#2023---infrastructure-and-feature-expansion)
  * [2024 - Otimização do Serviço e Funcionalidades Avançadas](#2024---service-optimization-and-advanced-features)
  * [2025 - Melhorias de Privacidade e Suporte a Protocolos {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - Conformidade com RFC e Filtragem Avançada {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Princípios Fundamentais](#core-principles)
* [Status Atual](#current-status)


## Visão Geral {#overview}

> \[!TIP]
> Para detalhes técnicos sobre nossa arquitetura, implementações de segurança e roadmap, veja o [Whitepaper Técnico](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email é um serviço de [encaminhamento de email](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") [gratuito e de código aberto](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") focado no [direito à privacidade](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") do usuário. O que começou como uma solução simples de encaminhamento de email em 2017 evoluiu para uma plataforma de email abrangente oferecendo nomes de domínio personalizados ilimitados, endereços e aliases de email ilimitados, endereços de email descartáveis ilimitados, proteção contra spam e phishing, armazenamento criptografado de caixas de correio e inúmeras funcionalidades avançadas.

O serviço é mantido e pertence à equipe original de fundadores, composta por designers e desenvolvedores. É construído com software 100% de código aberto usando [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") e [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Fundador e Missão {#founder-and-mission}

Forward Email foi fundado por **Nicholas Baugh** em 2017. Segundo o [Whitepaper Técnico do Forward Email](https://forwardemail.net/technical-whitepaper.pdf), Baugh inicialmente buscava uma solução simples e econômica para habilitar email em nomes de domínio para seus projetos paralelos. Após pesquisar as opções disponíveis, ele começou a codificar sua própria solução e comprou o domínio `forwardemail.net` em 2 de outubro de 2017.

A missão do Forward Email vai além de fornecer serviços de email — ela visa transformar a forma como a indústria aborda a privacidade e segurança do email. Os valores centrais da empresa incluem transparência, controle do usuário e proteção da privacidade por meio de implementação técnica, e não apenas promessas políticas.


## Linha do Tempo {#timeline}

### 2017 - Fundação e Lançamento {#2017---founding-and-launch}

**2 de outubro de 2017**: Nicholas Baugh comprou o domínio `forwardemail.net` após pesquisar soluções econômicas de email para seus projetos paralelos.

**5 de novembro de 2017**: Baugh criou um arquivo JavaScript de 634 linhas usando [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") para encaminhar emails para qualquer nome de domínio personalizado. Essa implementação inicial foi publicada como código aberto no [GitHub](https://github.com/forwardemail) e o serviço foi lançado usando GitHub Pages.
**Novembro de 2017**: Forward Email foi oficialmente lançado após uma versão inicial. A versão inicial era puramente baseada em DNS, sem registro de conta ou processo de inscrição—simplesmente um arquivo README escrito em Markdown com instruções. Os usuários podiam configurar o encaminhamento de email configurando registros MX para apontar para `mx1.forwardemail.net` e `mx2.forwardemail.net`, e adicionando um registro TXT com `forward-email=user@gmail.com`.

A simplicidade e eficácia dessa solução atraíram a atenção de desenvolvedores proeminentes, incluindo [David Heinemeier Hansson](https://dhh.dk) (criador do Ruby on Rails), que continua a usar o Forward Email em seu domínio `dhh.dk` até hoje.

### 2018 - Infraestrutura e Integração {#2018---infrastructure-and-integration}

**Abril de 2018**: Quando [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") lançou seu [serviço DNS para consumidores focado em privacidade](https://blog.cloudflare.com/announcing-1111/), o Forward Email mudou de usar [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") para [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") para lidar com consultas de [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), demonstrando o compromisso da empresa com escolhas de infraestrutura focadas em privacidade.

**Outubro de 2018**: Forward Email permitiu que usuários "Enviassem Email Como" com [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") e [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), expandindo as capacidades de integração com provedores de email populares.

### 2019 - Revolução de Performance {#2019---performance-revolution}

**Maio de 2019**: Forward Email lançou a versão 2, que representou uma grande reescrita das versões iniciais. Essa atualização focou em melhorias de [performance](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") através do uso dos [streams](https://en.wikipedia.org/wiki/Streams "Streams") do [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), estabelecendo a base para a escalabilidade da plataforma.

### 2020 - Foco em Privacidade e Segurança {#2020---privacy-and-security-focus}

**Fevereiro de 2020**: Forward Email lançou o plano de Proteção de Privacidade Aprimorada, permitindo que os usuários desativassem a configuração de entradas públicas de registros DNS com seus aliases de configuração de encaminhamento de email. Através desse plano, as informações do alias de email do usuário ficam ocultas de buscas públicas na Internet. A empresa também lançou um recurso para habilitar ou desabilitar aliases específicos enquanto ainda permite que eles apareçam como endereços de email válidos e retornem códigos de status [SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") bem-sucedidos, com os emails sendo imediatamente descartados (semelhante a direcionar a saída para [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Abril de 2020**: Após enfrentar inúmeros obstáculos com soluções existentes de detecção de spam que não respeitavam a política de privacidade do Forward Email, a empresa lançou sua versão alfa inicial do Spam Scanner. Essa solução de [filtragem anti-spam](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") completamente gratuita e de código aberto usa uma abordagem de filtro de spam [Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") combinada com proteção contra [phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") e ataques de homógrafos IDN ([IDN homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")). Forward Email também lançou a [autenticação de dois fatores](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) usando [senhas temporárias](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) para maior segurança da conta.

**Maio de 2020**: Forward Email permitiu o [encaminhamento de porta](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") personalizado como uma solução alternativa para usuários contornarem o bloqueio de portas por seus [ISPs](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). A empresa também lançou sua [API RESTful de Encaminhamento de Email Gratuito](email-api) com documentação completa e exemplos em tempo real de requisições e respostas, além de suporte para webhooks.
**Agosto de 2020**: Forward Email adicionou suporte para o sistema de autenticação de e-mail [Authenticated Received Chain](arc) ("ARC"), fortalecendo ainda mais a segurança e a entregabilidade do e-mail.

**23 de novembro de 2020**: Forward Email lançou publicamente sua plataforma fora do programa beta, marcando um marco significativo no desenvolvimento da plataforma.

### 2021 - Modernização da Plataforma {#2021---platform-modernization}

**Fevereiro de 2021**: Forward Email reestruturou sua base de código para remover todas as dependências de [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), permitindo que sua stack se tornasse 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") e [Node.js](https://en.wikipedia.org/wiki/Node.js). Essa decisão arquitetural alinhou-se ao compromisso da empresa de manter uma stack tecnológica consistente e open-source.

**27 de setembro de 2021**: Forward Email [adicionou suporte](email-forwarding-regex-pattern-filter) para aliases de encaminhamento de e-mail que correspondem a [expressões regulares](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), oferecendo aos usuários capacidades mais sofisticadas de roteamento de e-mail.

### 2023 - Expansão de Infraestrutura e Recursos {#2023---infrastructure-and-feature-expansion}

**Janeiro de 2023**: Forward Email lançou um site redesenhado e otimizado para velocidade de página, melhorando a experiência do usuário e o desempenho.

**Fevereiro de 2023**: A empresa adicionou suporte para [logs de erros](/faq#do-you-store-error-logs) e implementou um esquema de cores em [modo escuro](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) no site, respondendo às preferências dos usuários e necessidades de acessibilidade.

**Março de 2023**: Forward Email lançou o [Tangerine](https://github.com/forwardemail/tangerine#readme) e o integrou em toda a sua infraestrutura, permitindo o uso de [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") na camada de aplicação. A empresa também adicionou suporte para [MTA-STS](/faq#do-you-support-mta-sts) e mudou do [hCaptcha](/) para o [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**Abril de 2023**: Forward Email implementou e automatizou uma infraestrutura totalmente nova. Todo o serviço passou a operar em DNS balanceado globalmente e baseado em proximidade, com verificações de saúde e failover usando [Cloudflare](https://cloudflare.com), substituindo a abordagem anterior de DNS round-robin. A empresa migrou para **servidores bare metal** em múltiplos provedores, incluindo [Vultr](https://www.vultr.com/?ref=429848) e [Digital Ocean](https://m.do.co/c/a7cecd27e071), ambos provedores compatíveis com SOC 2 Tipo 1. Os bancos de dados MongoDB e Redis foram movidos para configurações em cluster com nós primários e standby para alta disponibilidade, criptografia SSL ponta a ponta, criptografia em repouso e recuperação ponto a ponto (PITR).

**Maio de 2023**: Forward Email lançou seu recurso **SMTP de saída** para [envio de e-mail via SMTP](/faq#do-you-support-sending-email-with-smtp) e [envio de e-mail via API](/faq#do-you-support-sending-email-with-api). Esse recurso inclui salvaguardas integradas para garantir alta entregabilidade, um sistema moderno e robusto de fila e reenvio, e [suporta logs de erros em tempo real](/faq#do-you-store-error-logs).

**Novembro de 2023**: Forward Email lançou seu recurso de [**armazenamento de caixa de correio criptografado**](/blog/docs/best-quantum-safe-encrypted-email-service) para [suporte IMAP](/faq#do-you-support-receiving-email-with-imap), representando um avanço significativo em privacidade e segurança de e-mails.

**Dezembro de 2023**: A empresa [adicionou suporte](/faq#do-you-support-pop3) para [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys e WebAuthn](/faq#do-you-support-passkeys-and-webauthn), monitoramento de [tempo até a caixa de entrada](/faq#i) e [OpenPGP para armazenamento IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Otimização do Serviço e Recursos Avançados {#2024---service-optimization-and-advanced-features}

**Fevereiro de 2024**: Forward Email [adicionou suporte a calendários (CalDAV)](/faq#do-you-support-calendars-caldav), expandindo as capacidades da plataforma além do e-mail para incluir sincronização de calendários.
**Março a Julho de 2024**: Forward Email lançou grandes otimizações e melhorias em seus serviços IMAP, POP3 e CalDAV, com o objetivo de tornar seu serviço tão rápido quanto, ou até mais rápido que, as alternativas.

**Julho de 2024**: A empresa [adicionou suporte a Push no iOS](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) para resolver a falta de suporte ao comando IMAP `IDLE` no Apple Mail do iOS, permitindo notificações em tempo real para dispositivos Apple iOS. Forward Email também adicionou monitoramento de tempo para a caixa de entrada ("TTI") para seu próprio serviço e Yahoo/AOL, e começou a permitir que os usuários criptografassem todo o registro DNS TXT mesmo no plano gratuito. Conforme solicitado nas [discussões do Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) e [issues do GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), a empresa adicionou a capacidade para aliases rejeitarem silenciosamente `250`, rejeitarem suavemente `421` ou rejeitarem fortemente `550` quando desativados.

**Agosto de 2024**: Forward Email adicionou suporte para exportação de caixas de correio nos formatos [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) e [Mbox](https://en.wikipedia.org/wiki/Mbox) (além do formato de exportação [SQLite](https://en.wikipedia.org/wiki/SQLite) já existente). [Suporte a assinatura de webhook foi adicionado](https://forwardemail.net/faq#do-you-support-bounce-webhooks), e a empresa começou a permitir que usuários enviassem newsletters, anúncios e marketing por e-mail através de seu serviço SMTP de saída. Cotas de armazenamento para IMAP/POP3/CalDAV específicas para domínio e alias também foram implementadas.

### 2025 - Melhorias de Privacidade e Suporte a Protocolos {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**Setembro de 2024 a Janeiro de 2025**: Forward Email [adicionou um recurso muito solicitado de resposta automática de férias e criptografia OpenPGP/WKD para encaminhamento de e-mails](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), ampliando suas capacidades já implementadas de armazenamento criptografado de caixas de correio.

**21 de Janeiro de 2025**: O melhor amigo do fundador, "Jack", seu fiel companheiro canino, faleceu pacificamente aos quase 11 anos de idade. Jack [será sempre lembrado](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) por sua companhia inabalável que apoiou a criação do Forward Email. O [Whitepaper Técnico do Forward Email](https://forwardemail.net/technical-whitepaper.pdf) é dedicado a Jack, reconhecendo seu papel no desenvolvimento do serviço.

**Fevereiro de 2025**: Forward Email mudou para [DataPacket](https://www.datapacket.com) como seu novo provedor principal de data center, implementando hardware bare-metal personalizado e focado em desempenho para melhorar ainda mais a confiabilidade e velocidade do serviço.

**Março de 2025**: A versão 1.0 do Forward Email foi oficialmente lançada.

**Abril de 2025**: A primeira versão do [Whitepaper Técnico do Forward Email](https://forwardemail.net/technical-whitepaper.pdf) foi publicada, e a empresa começou a aceitar pagamentos em criptomoedas.

**Maio de 2025**: O serviço lançou nova documentação de API usando [Scalar](https://github.com/scalar/scalar).

**Junho de 2025**: Forward Email lançou suporte para o [protocolo CardDAV](/faq#do-you-support-contacts-carddav), expandindo as capacidades da plataforma para incluir sincronização de contatos junto com os serviços existentes de e-mail e calendário.

**Agosto de 2025**: A plataforma adicionou suporte a [CalDAV VTODO/tarefas](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), permitindo o gerenciamento de tarefas junto com eventos de calendário.

**Novembro de 2025**: A segurança da plataforma foi aprimorada com a migração de PBKDF2 para [Argon2id](https://en.wikipedia.org/wiki/Argon2) para hashing de senhas, e a infraestrutura foi migrada de Redis para [Valkey](https://github.com/valkey-io/valkey).

**Dezembro de 2025**: A versão 2.0 foi lançada, introduzindo suporte a [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) para criptografia TLS obrigatória no transporte de e-mails e atualizando para [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6.
### 2026 - Conformidade com RFC e Filtragem Avançada {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Janeiro de 2026**: Forward Email lançou um [documento abrangente de conformidade com protocolos RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) e adicionou suporte para [criptografia S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) e filtragem de email [Sieve abrangente (RFC 5228)](/faq#do-you-support-sieve-email-filtering) com suporte ao protocolo [ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering). A API REST também foi expandida para 39 endpoints.

**Fevereiro de 2026**: O cliente webmail oficial e open-source foi lançado em [mail.forwardemail.net](https://mail.forwardemail.net) ([código-fonte no GitHub](https://github.com/forwardemail/mail.forwardemail.net)). A plataforma também adicionou suporte para [Extensões de Agendamento CalDAV (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) e [Domain Connect](https://domainconnect.org) para configuração DNS com 1 clique. Notificações push em tempo real para IMAP, CalDAV e CardDAV foram lançadas usando WebSockets.

**Março de 2026**: Foi adicionado suporte para armazenamento personalizado compatível com S3 por domínio, junto com uma ferramenta de linha de comando para gerenciamento. Começou o trabalho em aplicações desktop e móveis multiplataforma para macOS, Windows, Linux, iOS e Android usando a mesma base de código open-source do webmail, construídas com [Tauri](https://tauri.app).


## Princípios Fundamentais {#core-principles}

Desde sua criação, o Forward Email manteve um compromisso firme com os princípios de privacidade e segurança:

**Filosofia 100% Open-Source**: Diferente dos concorrentes que apenas liberam o frontend enquanto mantêm o backend fechado, o Forward Email disponibilizou todo seu código—tanto frontend quanto backend—para escrutínio público no [GitHub](https://github.com/forwardemail).

**Design com Privacidade em Primeiro Lugar**: Desde o primeiro dia, o Forward Email implementou uma abordagem única de processamento em memória que evita gravar emails no disco, diferenciando-se dos serviços convencionais que armazenam mensagens em bancos de dados ou sistemas de arquivos.

**Inovação Contínua**: O serviço evoluiu de uma simples solução de encaminhamento de email para uma plataforma completa com recursos como caixas de correio criptografadas, criptografia resistente a computação quântica e suporte a protocolos padrão incluindo SMTP, IMAP, POP3 e CalDAV.

**Transparência**: Tornando todo o código open-source e disponível para inspeção, garantindo que os usuários possam verificar as alegações de privacidade em vez de simplesmente confiar em declarações de marketing.

**Controle do Usuário**: Capacitando os usuários com opções, incluindo a possibilidade de hospedar toda a plataforma por conta própria, se desejado.


## Status Atual {#current-status}

Em março de 2026, o Forward Email atende a mais de 500.000 domínios em todo o mundo, incluindo organizações notáveis e líderes do setor como:

* **Empresas de Tecnologia**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Organizações de Mídia**: Fox News Radio, Disney Ad Sales
* **Instituições Educacionais**: Universidade de Cambridge, Universidade de Maryland, Universidade de Washington, Tufts University, Swarthmore College
* **Entidades Governamentais**: Governo da Austrália do Sul, Governo da República Dominicana
* **Outras Organizações**: RCD Hotels, Fly<span>.</span>io
* **Desenvolvedores Notáveis**: Isaac Z. Schlueter (criador do npm), David Heinemeier Hansson (criador do Ruby on Rails)

A plataforma continua a evoluir com lançamentos regulares de recursos e melhorias na infraestrutura, mantendo sua posição como o único serviço de email 100% open-source, criptografado, focado em privacidade, transparente e resistente à computação quântica disponível hoje.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
