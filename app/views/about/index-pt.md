# Sobre encaminhamento de e-mail {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Sobre encaminhamento de e-mail {#about-forward-email-1}

## Índice {#table-of-contents}

* [Visão geral](#overview)
* [Fundador e Missão](#founder-and-mission)
* [Linha do tempo](#timeline)
  * [2017 - Fundação e Lançamento](#2017---founding-and-launch)
  * [2018 - Infraestrutura e Integração](#2018---infrastructure-and-integration)
  * [2019 - Revolução de Desempenho](#2019---performance-revolution)
  * [2020 - Foco em Privacidade e Segurança](#2020---privacy-and-security-focus)
  * [2021 - Modernização da Plataforma](#2021---platform-modernization)
  * [2023 - Infraestrutura e expansão de recursos](#2023---infrastructure-and-feature-expansion)
  * [2024 - Otimização de serviços e recursos avançados](#2024---service-optimization-and-advanced-features)
  * [2025 - Inovação Contínua](#2025---continued-innovation)
* [Princípios Fundamentais](#core-principles)
* [Status atual](#current-status)

## Visão geral {#overview}

> \[!TIP]
> Para obter detalhes técnicos sobre nossa arquitetura, implementações de segurança e roteiro, consulte [Whitepaper técnico](https://forwardemail.net/technical-whitepaper.pdf).

O Forward Email é um serviço [livre e de código aberto](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [encaminhamento de e-mail](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") focado no [direito à privacidade](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") do usuário. O que começou como uma simples solução de encaminhamento de e-mails em 2017 evoluiu para uma plataforma de e-mail abrangente que oferece nomes de domínio personalizados ilimitados, endereços de e-mail e aliases ilimitados, endereços de e-mail descartáveis ilimitados, proteção contra spam e phishing, armazenamento criptografado de caixas de correio e diversos recursos avançados.

O serviço é mantido e de propriedade de sua equipe fundadora original de designers e desenvolvedores. Ele é construído com software 100% de código aberto usando [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") e [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Fundador e Missão {#founder-and-mission}

A Forward Email foi fundada por **Nicholas Baugh** em 2017. De acordo com o [Encaminhar e-mail - Whitepaper técnico](https://forwardemail.net/technical-whitepaper.pdf), Baugh buscava inicialmente uma solução simples e econômica para habilitar e-mails em nomes de domínio para seus projetos paralelos. Após pesquisar as opções disponíveis, ele começou a programar sua própria solução e adquiriu o domínio `forwardemail.net` em 2 de outubro de 2017.

A missão da Forward Email vai além do fornecimento de serviços de e-mail — ela visa transformar a forma como o setor aborda a privacidade e a segurança do e-mail. Os valores fundamentais da empresa incluem transparência, controle do usuário e proteção da privacidade por meio de implementação técnica, em vez de apenas promessas de políticas.

## Linha do tempo {#timeline}

### 2017 - Fundação e Lançamento {#2017---founding-and-launch}

**2 de outubro de 2017**: Nicholas Baugh comprou o domínio `forwardemail.net` após pesquisar soluções de e-mail econômicas para seus projetos paralelos.

**5 de novembro de 2017**: Baugh criou um arquivo JavaScript de 634 linhas usando [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") para encaminhar e-mails para qualquer nome de domínio personalizado. Essa implementação inicial foi publicada como código aberto em [GitHub](https://github.com/forwardemail) e o serviço foi lançado usando o GitHub Pages.

**Novembro de 2017**: O Forward Email foi lançado oficialmente após um lançamento inicial. A versão inicial era puramente baseada em DNS, sem processo de cadastro ou inscrição — simplesmente um arquivo README escrito em Markdown com instruções. Os usuários podiam configurar o encaminhamento de e-mails configurando os registros MX para apontar para `mx1.forwardemail.net` e `mx2.forwardemail.net`, e adicionando um registro TXT com `forward-email=user@gmail.com`.

A simplicidade e a eficácia desta solução atraíram a atenção de desenvolvedores importantes, incluindo [David Heinemeier Hansson](https://dhh.dk) (criador do Ruby on Rails), que continua a usar o Forward Email em seu domínio `dhh.dk` até hoje.

### 2018 - Infraestrutura e Integração {#2018---infrastructure-and-integration}

**Abril de 2018**: Quando o [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") lançou o [serviço DNS para o consumidor que prioriza a privacidade](https://blog.cloudflare.com/announcing-1111/), o Forward Email deixou de usar o [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") e passou a usar o [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") para lidar com pesquisas do [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), demonstrando o comprometimento da empresa com escolhas de infraestrutura focadas em privacidade.

**Outubro de 2018**: O Forward Email permitiu que os usuários "Enviassem e-mail como" com [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") e [Panorama](https://en.wikipedia.org/wiki/Outlook "Outlook"), expandindo os recursos de integração com provedores de e-mail populares.

### 2019 - Revolução de Desempenho {#2019---performance-revolution}

**Maio de 2019**: O Forward Email lançou a versão 2, que representou uma grande reformulação em relação às versões iniciais. Esta atualização se concentrou nas melhorias do [desempenho](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") por meio do uso do [córregos](https://en.wikipedia.org/wiki/Streams "Streams") do [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), estabelecendo a base para a escalabilidade da plataforma.

### 2020 - Foco em Privacidade e Segurança {#2020---privacy-and-security-focus}

**Fevereiro de 2020**: A Forward Email lançou o plano Proteção de Privacidade Aprimorada, permitindo que os usuários desativem a configuração de entradas de registro DNS públicas com seus aliases de configuração de encaminhamento de e-mail. Com esse plano, as informações do alias de e-mail de um usuário ficam ocultas, impedindo que sejam pesquisadas publicamente na internet. A empresa também lançou um recurso para habilitar ou desabilitar aliases específicos, permitindo que eles apareçam como endereços de e-mail válidos e retornem [Códigos de status SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") com sucesso, com os e-mails sendo descartados imediatamente (semelhante ao envio da saída para [/dev/nulo](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Abril de 2020**: Após inúmeros obstáculos com as soluções de detecção de spam existentes que não respeitavam a política de privacidade da Forward Email, a empresa lançou sua versão alfa inicial do Spam Scanner. Esta solução [filtragem anti-spam](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques"), totalmente gratuita e de código aberto, utiliza uma abordagem [Filtro de spam Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") combinada com as proteções [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") e [Ataque homográfico IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). A Forward Email também lançou o [autenticação de dois fatores](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) usando [senhas de uso único](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) para maior segurança da conta.

**Maio de 2020**: O Forward Email permitiu o uso do [encaminhamento de porta](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") personalizado como solução alternativa para os usuários contornarem o bloqueio de portas pelo [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). A empresa também lançou o [API RESTful de encaminhamento de e-mail gratuito](email-api) com documentação completa e exemplos de solicitação e resposta em tempo real, além de suporte para webhooks.

**Agosto de 2020**: O Forward Email adicionou suporte para o sistema de autenticação de e-mail [Cadeia Recebida Autenticada](arc) ("ARC"), fortalecendo ainda mais a segurança e a capacidade de entrega do e-mail.

**23 de novembro de 2020**: O Forward Email foi lançado publicamente fora do programa beta, marcando um marco significativo no desenvolvimento da plataforma.

### 2021 - Modernização da plataforma {#2021---platform-modernization}

**Fevereiro de 2021**: A Forward Email refatorou sua base de código para remover todas as dependências de [Pitão](https://en.wikipedia.org/wiki/Python_\(programming_language\) ("Python (linguagem de programação)"), permitindo que sua pilha se tornasse 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") e [Node.js](https://en.wikipedia.org/wiki/Node.js). Essa decisão arquitetônica estava alinhada ao compromisso da empresa em manter uma pilha tecnológica consistente e de código aberto.

**27 de setembro de 2021**: Encaminhe o e-mail [suporte adicionado](email-forwarding-regex-pattern-filter) para aliases de encaminhamento de e-mail para corresponder a [expressões regulares](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), fornecendo aos usuários recursos de roteamento de e-mail mais sofisticados.

### 2023 - Infraestrutura e expansão de recursos {#2023---infrastructure-and-feature-expansion}

**Janeiro de 2023**: A Forward Email lançou um site redesenhado e otimizado para velocidade de página, melhorando a experiência do usuário e o desempenho.

**Fevereiro de 2023**: A empresa adicionou suporte para [registros de erros](/faq#do-you-store-error-logs) e implementou um esquema de cores de site [modo escuro](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme), respondendo às preferências do usuário e às necessidades de acessibilidade.

**Março de 2023**: A Forward Email lançou o [tangerina](https://github.com/forwardemail/tangerine#readme) e o integrou em toda a sua infraestrutura, permitindo o uso do [DNS sobre HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") na camada de aplicação. A empresa também adicionou suporte ao [MTA-STS](/faq#do-you-support-mta-sts) e migrou do [hCaptcha](/) para o [Catraca Cloudflare](https://developers.cloudflare.com/turnstile).

**Abril de 2023**: A Forward Email implementou e automatizou uma infraestrutura totalmente nova. Todo o serviço passou a ser executado em DNS globalmente balanceado e baseado em proximidade, com verificações de integridade e failover usando [Cloudflare](https://cloudflare.com), substituindo a abordagem anterior de DNS round-robin. A empresa migrou para **servidores bare metal** em diversos provedores, incluindo [Abutre](https://www.vultr.com/?ref=429848) e [Oceano Digital](https://m.do.co/c/a7cecd27e071), ambos compatíveis com SOC 2 Tipo 1. Os bancos de dados MongoDB e Redis foram migrados para configurações em cluster com nós primários e em espera para alta disponibilidade, criptografia SSL de ponta a ponta, criptografia em repouso e recuperação em ponto no tempo (PITR).

**Maio de 2023**: A Forward Email lançou seu recurso **SMTP de saída** para solicitações [enviando e-mail com SMTP](/faq#do-you-support-sending-email-with-smtp) e [envio de e-mail com API](/faq#do-you-support-sending-email-with-api). Esse recurso inclui proteções integradas para garantir alta entregabilidade, um sistema de fila e repetição moderno e robusto, e [suporta logs de erros em tempo real](/faq#do-you-store-error-logs).

**Novembro de 2023**: A Forward Email lançou seu recurso [**armazenamento de caixa de correio criptografada**](/blog/docs/best-quantum-safe-encrypted-email-service) para [Suporte IMAP](/faq#do-you-support-receiving-email-with-imap), representando um avanço significativo em privacidade e segurança de e-mail.

**Dezembro de 2023**: A empresa [suporte adicionado](/faq#do-you-support-pop3) para monitoramento de [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [chaves de acesso e WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [hora de enviar mensagem](/faq#i) e [OpenPGP para armazenamento IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Otimização de serviços e recursos avançados {#2024---service-optimization-and-advanced-features}

**Fevereiro de 2024**: Encaminhamento do e-mail [suporte de calendário (CalDAV) adicionado](/faq#do-you-support-calendars-caldav), expandindo os recursos da plataforma além do e-mail para incluir a sincronização de calendário.

**Março a julho de 2024**: A Forward Email lançou grandes otimizações e melhorias em seus serviços IMAP, POP3 e CalDAV, com o objetivo de tornar seu serviço tão rápido quanto, ou até mais rápido, que as alternativas.

**Julho de 2024**: A empresa [adicionado suporte iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) abordará a falta de suporte ao comando IMAP `IDLE` do Apple Mail para iOS, habilitando notificações em tempo real para dispositivos Apple iOS. O Forward Email também adicionou o monitoramento de tempo para caixa de entrada ("TTI") para seu próprio serviço e para o Yahoo/AOL, e começou a permitir que os usuários criptografem todo o registro DNS TXT, mesmo no plano gratuito. Conforme solicitado em [Discussões sobre Guias de Privacidade](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) e [Problemas no GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), a empresa adicionou a capacidade de aliases rejeitarem silenciosamente `250`, rejeitarem suavemente `421` ou rejeitarem fortemente `550` quando desativado.

**Agosto de 2024**: O Forward Email adicionou suporte para exportação de caixas de correio nos formatos [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) e [Mbox](https://en.wikipedia.org/wiki/Mbox) (além do formato de exportação existente [SQLite](https://en.wikipedia.org/wiki/SQLite)). [Suporte para assinatura de webhook foi adicionado](https://forwardemail.net/faq#do-you-support-bounce-webhooks), e a empresa começou a permitir que os usuários enviassem newsletters, anúncios e e-mail marketing por meio de seu serviço SMTP de saída. Cotas de armazenamento específicas para alias e para todo o domínio para IMAP/POP3/CalDAV também foram implementadas.

### 2025 - Inovação contínua {#2025---continued-innovation}

**Setembro de 2024 a janeiro de 2025**: Encaminhar o e-mail [adicionou um recurso de resposta de férias altamente solicitado e criptografia OpenPGP/WKD para encaminhamento de e-mail](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), aproveitando os recursos de armazenamento de caixa de correio criptografada já implementados.

**21 de janeiro de 2025**: O melhor amigo do fundador, "Jack", seu leal companheiro canino, faleceu em paz aos quase 11 anos. Agradecemos a Jack [sempre será lembrado](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) por sua companhia inabalável que apoiou a criação do Forward Email. O [Encaminhar e-mail - Whitepaper técnico](https://forwardemail.net/technical-whitepaper.pdf) é dedicado a Jack, reconhecendo seu papel no desenvolvimento do serviço.

**Fevereiro de 2025**: A Forward Email mudou para [Pacote de dados](https://www.datapacket.com) como seu novo provedor de data center principal, implementando hardware bare-metal personalizado e focado em desempenho para aumentar ainda mais a confiabilidade e a velocidade do serviço.

**Junho de 2025**: O Forward Email lançou suporte para [Protocolo CardDAV](/faq#do-you-support-contacts-carddav), expandindo os recursos da plataforma para incluir sincronização de contatos junto com os serviços de e-mail e calendário existentes.

### 2026 - Conformidade RFC e filtragem avançada {#2026---rfc-compliance-and-advanced-filtering}

**Janeiro de 2026**: Forward Email lançou um documento abrangente de [conformidade com o protocolo RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) detalhando o suporte completo aos padrões SMTP, IMAP, POP3 e CalDAV. A plataforma também adicionou [suporte REQUIRETLS (RFC 8689)](/faq#requiretls-support) para criptografia TLS forçada no transporte de e-mail, [criptografia S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) para assinatura e criptografia segura de mensagens, e [filtragem de e-mail Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) com [protocolo ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering) para filtragem de e-mail do lado do servidor. A [API REST](/email-api) foi expandida para 39 endpoints cobrindo mensagens, pastas, contatos, calendários e eventos de calendário.

## Princípios Fundamentais {#core-principles}

Desde a sua criação, a Forward Email mantém um firme compromisso com os princípios de privacidade e segurança:

**Filosofia 100% de código aberto**: Diferentemente dos concorrentes que apenas disponibilizam seus frontends de código aberto, mantendo os backends fechados, a Forward Email disponibilizou toda a sua base de código — tanto o frontend quanto o backend — para análise pública em [GitHub](https://github.com/forwardemail).

**Design que prioriza a privacidade**: Desde o primeiro dia, o Forward Email implementou uma abordagem exclusiva de processamento na memória que evita gravar e-mails no disco, o que o diferencia dos serviços de e-mail convencionais que armazenam mensagens em bancos de dados ou sistemas de arquivos.

**Inovação contínua**: O serviço evoluiu de uma simples solução de encaminhamento de e-mail para uma plataforma de e-mail abrangente com recursos como caixas de correio criptografadas, criptografia resistente a quantum e suporte para protocolos padrão, incluindo SMTP, IMAP, POP3 e CalDAV.

**Transparência**: Tornar todo o código de código aberto e disponível para inspeção, garantindo que os usuários possam verificar as alegações de privacidade em vez de simplesmente confiar em declarações de marketing.

**Controle do usuário**: Capacitando os usuários com opções, incluindo a capacidade de hospedar a plataforma inteira, se desejado.

## Status atual {#current-status}

Em 2025, a Forward Email atendia mais de 500.000 domínios no mundo todo, incluindo organizações notáveis e líderes do setor, como:

* **Empresas de Tecnologia**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Organizações de Mídia**: Fox News Radio, Disney Ad Sales
* **Instituições de Ensino**: Universidade de Cambridge, Universidade de Maryland, Universidade de Washington, Universidade Tufts, Swarthmore College
* **Entidades Governamentais**: Governo da Austrália do Sul, Governo da República Dominicana
* **Outras Organizações**: RCD Hotels, Fly<span>.</span>io
* **Desenvolvedores Notáveis**: Isaac Z. Schlueter (criador do npm), David Heinemeier Hansson (criador do Ruby on Rails)

A plataforma continua a evoluir com lançamentos regulares de recursos e melhorias de infraestrutura, mantendo sua posição como o único serviço de e-mail 100% de código aberto, criptografado, focado em privacidade, transparente e resistente a quantum disponível hoje.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />