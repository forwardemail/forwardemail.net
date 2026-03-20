# Uma Década de Impacto: Como Nossos Pacotes npm Alcançaram 1 Bilhão de Downloads e Moldaram o JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [Os Pioneiros Que Confiam em Nós: Isaac Z. Schlueter e Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Da Criação do npm à Liderança do Node.js](#from-npms-creation-to-nodejs-leadership)
* [O Arquiteto Por Trás do Código: A Jornada de Nick Baugh](#the-architect-behind-the-code-nick-baughs-journey)
  * [Comitê Técnico do Express e Contribuições ao Core](#express-technical-committee-and-core-contributions)
  * [Contribuições ao Framework Koa](#koa-framework-contributions)
  * [De Contribuidor Individual a Líder de Organização](#from-individual-contributor-to-organization-leader)
* [Nossas Organizações no GitHub: Ecossistemas de Inovação](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Logging Estruturado para Aplicações Modernas](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Combatendo o Abuso de Email](#spam-scanner-fighting-email-abuse)
  * [Bree: Agendamento Moderno de Tarefas com Worker Threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Infraestrutura de Email Open Source](#forward-email-open-source-email-infrastructure)
  * [Lad: Utilitários e Ferramentas Essenciais para Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Monitoramento de Uptime Open Source](#upptime-open-source-uptime-monitoring)
* [Nossas Contribuições para o Ecossistema Forward Email](#our-contributions-to-the-forward-email-ecosystem)
  * [De Pacotes à Produção](#from-packages-to-production)
  * [O Ciclo de Feedback](#the-feedback-loop)
* [Princípios Centrais do Forward Email: Uma Base para a Excelência](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Sempre Amigável para Desenvolvedores, Focado em Segurança e Transparente](#always-developer-friendly-security-focused-and-transparent)
  * [Adesão a Princípios de Desenvolvimento de Software Testados pelo Tempo](#adherence-to-time-tested-software-development-principles)
  * [Foco no Desenvolvedor Resiliente e Autossuficiente](#targeting-the-scrappy-bootstrapped-developer)
  * [Princípios na Prática: A Base de Código do Forward Email](#principles-in-practice-the-forward-email-codebase)
  * [Privacidade por Design](#privacy-by-design)
  * [Open Source Sustentável](#sustainable-open-source)
* [Os Números Não Mentem: Nossas Estatísticas Impressionantes de Downloads no npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Uma Visão Geral do Nosso Impacto](#a-birds-eye-view-of-our-impact)
  * [Impacto Diário em Escala](#daily-impact-at-scale)
  * [Além dos Números Brutos](#beyond-the-raw-numbers)
* [Apoiando o Ecossistema: Nossos Patrocínios Open Source](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pioneiro em Infraestrutura de Email](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Mestre dos Pacotes Utilitários](#sindre-sorhus-utility-package-mastermind)
* [Descobrindo Vulnerabilidades de Segurança no Ecossistema JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [O Resgate do Koa-Router](#the-koa-router-rescue)
  * [Abordando Vulnerabilidades ReDoS](#addressing-redos-vulnerabilities)
  * [Defendendo a Segurança do Node.js e Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Protegendo a Infraestrutura do npm](#securing-npm-infrastructure)
* [Nossas Contribuições para o Ecossistema Forward Email](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Aprimorando a Funcionalidade Core do Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Avançando na Autenticação de Email com Mailauth](#advancing-email-authentication-with-mailauth)
  * [Principais Melhorias no Upptime](#key-upptime-enhancements)
* [A Cola Que Une Tudo: Código Personalizado em Escala](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Um Esforço Massivo de Desenvolvimento](#a-massive-development-effort)
  * [Integração de Dependências Core](#core-dependencies-integration)
  * [Infraestrutura DNS com Tangerine e mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Impacto Empresarial: De Open Source a Soluções Críticas para Missão](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Estudos de Caso em Infraestrutura de Email Crítica para Missão](#case-studies-in-mission-critical-email-infrastructure)
* [Uma Década de Open Source: Olhando para o Futuro](#a-decade-of-open-source-looking-forward)
## Prefácio {#foreword}

No mundo do [JavaScript](https://en.wikipedia.org/wiki/JavaScript) e do [Node.js](https://en.wikipedia.org/wiki/Node.js), alguns pacotes são essenciais—baixados milhões de vezes diariamente e alimentando aplicativos em todo o mundo. Por trás dessas ferramentas estão desenvolvedores focados na qualidade do código aberto. Hoje, mostramos como nossa equipe ajuda a construir e manter pacotes npm que se tornaram partes fundamentais do ecossistema JavaScript.

## Os Pioneiros Que Confiam em Nós: Isaac Z. Schlueter e Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Temos orgulho de ter [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) como usuário. Isaac criou o [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) e ajudou a construir o [Node.js](https://en.wikipedia.org/wiki/Node.js). Sua confiança no Forward Email demonstra nosso foco em qualidade e segurança. Isaac usa o Forward Email para vários domínios, incluindo izs.me.

O impacto de Isaac no JavaScript é enorme. Em 2009, ele foi um dos primeiros a perceber o potencial do Node.js, trabalhando com [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), que criou a plataforma. Como Isaac disse em uma [entrevista para a revista Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "No meio dessa comunidade muito pequena de um grupo de pessoas tentando descobrir como fazer o JS do lado do servidor acontecer, Ryan Dahl lançou o Node, que era claramente a abordagem certa. Eu apostei nisso e me envolvi bastante por volta de meados de 2009."

> \[!NOTE]
> Para quem se interessa pela história do Node.js, existem excelentes documentários disponíveis que narram seu desenvolvimento, incluindo [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) e [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). O [site pessoal](https://tinyclouds.org/) de Ryan Dahl também contém insights valiosos sobre seu trabalho.

### Da Criação do npm à Liderança do Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac criou o npm em setembro de 2009, com a primeira versão utilizável lançada no início de 2010. Esse gerenciador de pacotes supriu uma necessidade fundamental no Node.js, permitindo que desenvolvedores compartilhassem e reutilizassem código facilmente. Segundo a [página do Node.js na Wikipedia](https://en.wikipedia.org/wiki/Node.js), "Em janeiro de 2010, foi introduzido um gerenciador de pacotes para o ambiente Node.js chamado npm. O gerenciador de pacotes permite que programadores publiquem e compartilhem pacotes Node.js, junto com o código-fonte acompanhante, e é projetado para simplificar a instalação, atualização e desinstalação de pacotes."

Quando Ryan Dahl se afastou do Node.js em janeiro de 2012, Isaac assumiu como líder do projeto. Conforme destacado em [seu currículo](https://izs.me/resume), ele "Liderou o desenvolvimento de várias APIs fundamentais do núcleo do Node.js, incluindo o sistema de módulos CommonJS, APIs de sistema de arquivos e streams" e "Atuou como BDFL (Ditador Benevolente Vitalício) do projeto por 2 anos, garantindo qualidade crescente e processo de build confiável para as versões do Node.js de v0.6 até v0.10."

Isaac guiou o Node.js durante um período crucial de crescimento, estabelecendo padrões que ainda moldam a plataforma hoje. Posteriormente, fundou a npm, Inc. em 2014 para apoiar o registro npm, que ele havia gerenciado sozinho anteriormente.

Agradecemos a Isaac por suas enormes contribuições ao JavaScript e continuamos a usar muitos pacotes que ele criou. Seu trabalho mudou a forma como construímos software e como milhões de desenvolvedores compartilham código no mundo todo.

## O Arquiteto Por Trás do Código: A Jornada de Nick Baugh {#the-architect-behind-the-code-nick-baughs-journey}

No coração do nosso sucesso em código aberto está Nick Baugh, fundador e proprietário do Forward Email. Seu trabalho em JavaScript abrange quase 20 anos e moldou como inúmeros desenvolvedores constroem aplicativos. Sua jornada no código aberto demonstra tanto habilidade técnica quanto liderança comunitária.

### Comitê Técnico do Express e Contribuições ao Core {#express-technical-committee-and-core-contributions}

A expertise de Nick em frameworks web lhe garantiu um lugar no [Comitê Técnico do Express](https://expressjs.com/en/resources/community.html), onde ajudou com um dos frameworks Node.js mais usados. Nick agora está listado como membro inativo na [página da comunidade Express](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> O Express foi originalmente criado por TJ Holowaychuk, um prolífico colaborador de código aberto que moldou grande parte do ecossistema Node.js. Somos gratos pelo trabalho fundamental de TJ e respeitamos sua [decisão de fazer uma pausa](https://news.ycombinator.com/item?id=37687017) de suas extensas contribuições em código aberto.

Como membro do [Comitê Técnico do Express](https://expressjs.com/en/resources/community.html), Nick demonstrou grande atenção aos detalhes em questões como esclarecer a documentação de `req.originalUrl` e corrigir problemas no manuseio de formulários multipart.

### Contribuições ao Framework Koa {#koa-framework-contributions}

O trabalho de Nick com o [framework Koa](https://github.com/koajs/koa)—uma alternativa moderna e mais leve ao Express também criada por TJ Holowaychuk—mostra ainda mais seu compromisso com melhores ferramentas para desenvolvimento web. Suas contribuições ao Koa incluem tanto issues quanto código via pull requests, abordando tratamento de erros, gerenciamento de tipos de conteúdo e melhorias na documentação.

Seu trabalho tanto no Express quanto no Koa lhe dá uma visão única do desenvolvimento web em Node.js, ajudando nossa equipe a criar pacotes que funcionam bem com múltiplos ecossistemas de frameworks.

### De Colaborador Individual a Líder de Organização {#from-individual-contributor-to-organization-leader}

O que começou como ajuda a projetos existentes cresceu para a criação e manutenção de ecossistemas inteiros de pacotes. Nick fundou múltiplas organizações no GitHub—incluindo [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs) e [Bree](https://github.com/breejs)—cada uma resolvendo necessidades específicas na comunidade JavaScript.

Essa transição de colaborador para líder mostra a visão de Nick para software bem projetado que resolve problemas reais. Ao organizar pacotes relacionados sob organizações focadas no GitHub, ele construiu ecossistemas de ferramentas que funcionam juntos enquanto permanecem modulares e flexíveis para a comunidade de desenvolvedores em geral.


## Nossas Organizações no GitHub: Ecossistemas de Inovação {#our-github-organizations-ecosystems-of-innovation}

Organizamos nosso trabalho de código aberto em torno de organizações focadas no GitHub, cada uma resolvendo necessidades específicas em JavaScript. Essa estrutura cria famílias coesas de pacotes que funcionam bem juntas enquanto permanecem modulares.

### Cabin: Logging Estruturado para Aplicações Modernas {#cabin-structured-logging-for-modern-applications}

A [organização Cabin](https://github.com/cabinjs) é nossa visão de logging simples e poderoso para apps. O principal pacote [`cabin`](https://github.com/cabinjs/cabin) tem quase 900 estrelas no GitHub e mais de 100.000 downloads semanais\[^1]. O Cabin fornece logging estruturado que funciona com serviços populares como Sentry, LogDNA e Papertrail.

O que torna o Cabin especial é sua API pensada e sistema de plugins. Pacotes complementares como [`axe`](https://github.com/cabinjs/axe) para middleware Express e [`parse-request`](https://github.com/cabinjs/parse-request) para parsing de requisições HTTP mostram nosso compromisso com soluções completas em vez de ferramentas isoladas.

O pacote [`bson-objectid`](https://github.com/cabinjs/bson-objectid) merece menção especial, com mais de 1,7 milhão de downloads em apenas dois meses\[^2]. Essa implementação leve do MongoDB ObjectID se tornou a escolha principal para desenvolvedores que precisam de IDs sem dependências completas do MongoDB.

### Spam Scanner: Combatendo o Abuso de Email {#spam-scanner-fighting-email-abuse}

A [organização Spam Scanner](https://github.com/spamscanner) demonstra nosso compromisso em resolver problemas reais. O principal pacote [`spamscanner`](https://github.com/spamscanner/spamscanner) oferece detecção avançada de spam por email, mas é o pacote [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) que teve uma adoção incrível.

Com mais de 1,2 milhão de downloads em dois meses\[^3], o `url-regex-safe` corrige problemas críticos de segurança em outras expressões regulares de detecção de URLs. Esse pacote mostra nossa abordagem ao código aberto: encontrar um problema comum (neste caso, vulnerabilidades [ReDoS](https://en.wikipedia.org/wiki/ReDoS) na validação de URLs), criar uma solução sólida e mantê-la cuidadosamente.
### Bree: Agendamento Moderno de Tarefas com Worker Threads {#bree-modern-job-scheduling-with-worker-threads}

A [organização Bree](https://github.com/breejs) é nossa resposta para um desafio comum no Node.js: agendamento confiável de tarefas. O pacote principal [`bree`](https://github.com/breejs/bree), com mais de 3.100 estrelas no GitHub, oferece um agendador moderno de tarefas usando worker threads do Node.js para melhor desempenho e confiabilidade.

> \[!NOTE]
> Bree foi criado após ajudarmos a manter o [Agenda](https://github.com/agenda/agenda), aplicando as lições aprendidas para construir um agendador de tarefas melhor. Nossas contribuições para o Agenda nos ajudaram a encontrar maneiras de melhorar o agendamento de tarefas.

O que torna o Bree diferente de outros agendadores como o Agenda:

* **Sem Dependências Externas**: Diferente do Agenda, que precisa do MongoDB, o Bree não requer Redis ou MongoDB para gerenciar o estado das tarefas.
* **Worker Threads**: O Bree usa worker threads do Node.js para processos isolados, proporcionando melhor isolamento e desempenho.
* **API Simples**: O Bree oferece controle detalhado com simplicidade, facilitando a implementação de necessidades complexas de agendamento.
* **Suporte Embutido**: Recursos como recarga graciosa, tarefas cron, datas e tempos amigáveis para humanos estão incluídos por padrão.

O Bree é uma parte fundamental do [forwardemail.net](https://github.com/forwardemail/forwardemail.net), lidando com tarefas críticas em segundo plano como processamento de e-mails, limpeza e manutenção agendada. Usar o Bree no Forward Email demonstra nosso compromisso em usar nossas próprias ferramentas em produção, garantindo que elas atendam a altos padrões de confiabilidade.

Também usamos e apreciamos outros excelentes pacotes de worker threads como o [piscina](https://github.com/piscinajs/piscina) e clientes HTTP como o [undici](https://github.com/nodejs/undici). O Piscina, assim como o Bree, usa worker threads do Node.js para processamento eficiente de tarefas. Agradecemos ao [Matteo Collina](https://github.com/mcollina), que mantém tanto o undici quanto o piscina, por suas grandes contribuições ao Node.js. Matteo faz parte do Comitê Técnico do Node.js e melhorou significativamente as capacidades dos clientes HTTP no Node.js.

### Forward Email: Infraestrutura de Email Open Source {#forward-email-open-source-email-infrastructure}

Nosso projeto mais ambicioso é o [Forward Email](https://github.com/forwardemail), um serviço de e-mail open source que oferece encaminhamento de e-mails, armazenamento e serviços de API. O repositório principal tem mais de 1.100 estrelas no GitHub\[^4], mostrando a apreciação da comunidade por essa alternativa aos serviços de e-mail proprietários.

O pacote [`preview-email`](https://github.com/forwardemail/preview-email) desta organização, com mais de 2,5 milhões de downloads em dois meses\[^5], tornou-se uma ferramenta essencial para desenvolvedores que trabalham com templates de e-mail. Ao fornecer uma maneira simples de pré-visualizar e-mails durante o desenvolvimento, ele resolve um ponto crítico comum na construção de aplicações com suporte a e-mail.

### Lad: Utilitários e Ferramentas Essenciais para Koa {#lad-essential-koa-utilities-and-tools}

A [organização Lad](https://github.com/ladjs) oferece uma coleção de utilitários e ferramentas essenciais focadas principalmente em aprimorar o ecossistema do framework Koa. Esses pacotes resolvem desafios comuns no desenvolvimento web e são projetados para funcionar perfeitamente juntos, mantendo-se úteis de forma independente.

#### koa-better-error-handler: Tratamento de Erros Aprimorado para Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) oferece uma solução melhor para tratamento de erros em aplicações Koa. Com mais de 50 estrelas no GitHub, este pacote faz com que `ctx.throw` produza mensagens de erro amigáveis ao usuário enquanto resolve várias limitações do manipulador de erros embutido do Koa:

* Detecta e trata corretamente erros DNS do Node.js, erros do Mongoose e erros do Redis
* Usa [Boom](https://github.com/hapijs/boom) para criar respostas de erro consistentes e bem formatadas
* Preserva headers (ao contrário do manipulador embutido do Koa)
* Mantém códigos de status apropriados em vez de usar o padrão 500
* Suporta mensagens flash e preservação de sessão
* Fornece listas de erros em HTML para erros de validação
* Suporta múltiplos tipos de resposta (HTML, JSON e texto simples)
Este pacote é particularmente valioso quando usado juntamente com [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) para um gerenciamento abrangente de erros em aplicações Koa.

#### passport: Autenticação para Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) estende o popular middleware de autenticação Passport.js com melhorias específicas para aplicações web modernas. Este pacote suporta múltiplas estratégias de autenticação prontas para uso:

* Autenticação local com email
* Login com Apple
* Autenticação GitHub
* Autenticação Google
* Autenticação por senha única (OTP)

O pacote é altamente personalizável, permitindo que desenvolvedores ajustem nomes de campos e frases para corresponder aos requisitos da aplicação. Foi projetado para integrar-se perfeitamente com Mongoose para gerenciamento de usuários, tornando-se uma solução ideal para aplicações baseadas em Koa que precisam de autenticação robusta.

#### graceful: Encerramento Elegante da Aplicação {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) resolve o desafio crítico de encerrar aplicações Node.js de forma elegante. Com mais de 70 estrelas no GitHub, este pacote garante que sua aplicação possa terminar de forma limpa sem perder dados ou deixar conexões abertas. Principais recursos incluem:

* Suporte para fechamento elegante de servidores HTTP (Express/Koa/Fastify)
* Encerramento limpo de conexões de banco de dados (MongoDB/Mongoose)
* Fechamento adequado de clientes Redis
* Gerenciamento de agendadores de tarefas Bree
* Suporte para handlers personalizados de encerramento
* Configuração de tempo limite
* Integração com sistemas de logging

Este pacote é essencial para aplicações em produção onde encerramentos inesperados podem levar à perda ou corrupção de dados. Ao implementar procedimentos adequados de encerramento, `@ladjs/graceful` ajuda a garantir a confiabilidade e estabilidade da sua aplicação.

### Upptime: Monitoramento de Uptime Open Source {#upptime-open-source-uptime-monitoring}

A [organização Upptime](https://github.com/upptime) representa nosso compromisso com monitoramento transparente e open source. O repositório principal [`upptime`](https://github.com/upptime/upptime) possui mais de 13.000 estrelas no GitHub, tornando-se um dos projetos mais populares aos quais contribuímos. O Upptime fornece um monitor de uptime e página de status alimentados pelo GitHub que operam inteiramente sem servidor.

Usamos o Upptime para nossa própria página de status em <https://status.forwardemail.net> com o código-fonte disponível em <https://github.com/forwardemail/status.forwardemail.net>.

O que torna o Upptime especial é sua arquitetura:

* **100% Open Source**: Cada componente é totalmente open source e personalizável.
* **Alimentado pelo GitHub**: Utiliza GitHub Actions, Issues e Pages para uma solução de monitoramento sem servidor.
* **Sem Necessidade de Servidor**: Diferente das ferramentas tradicionais, o Upptime não exige que você execute ou mantenha um servidor.
* **Página de Status Automática**: Gera uma página de status bonita que pode ser hospedada no GitHub Pages.
* **Notificações Poderosas**: Integra-se com vários canais de notificação, incluindo email, SMS e Slack.

Para melhorar a experiência dos nossos usuários, integramos [@octokit/core](https://github.com/octokit/core.js/) na base de código do forwardemail.net para exibir atualizações de status e incidentes em tempo real diretamente em nosso site. Essa integração oferece transparência clara aos nossos usuários em caso de quaisquer problemas em toda a nossa stack (Website, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, etc.) com notificações instantâneas tipo toast, mudanças no ícone de badge, cores de aviso e mais.

A biblioteca @octokit/core nos permite buscar dados em tempo real do nosso repositório Upptime no GitHub, processá-los e exibi-los de forma amigável ao usuário. Quando algum serviço apresenta falha ou desempenho degradado, os usuários são imediatamente notificados por meio de indicadores visuais sem precisar sair da aplicação principal. Essa integração perfeita garante que nossos usuários sempre tenham informações atualizadas sobre o status do sistema, aumentando a transparência e a confiança.

O Upptime foi adotado por centenas de organizações que buscam uma forma transparente e confiável de monitorar seus serviços e comunicar o status aos usuários. O sucesso do projeto demonstra o poder de construir ferramentas que aproveitam a infraestrutura existente (neste caso, o GitHub) para resolver problemas comuns de maneiras inovadoras.
## Nossas Contribuições para o Ecossistema Forward Email {#our-contributions-to-the-forward-email-ecosystem}

Enquanto nossos pacotes open source são usados por desenvolvedores em todo o mundo, eles também formam a base do nosso próprio serviço Forward Email. Esse papel duplo — como criadores e usuários dessas ferramentas — nos dá uma perspectiva única sobre sua aplicação no mundo real e impulsiona melhorias contínuas.

### De Pacotes para Produção {#from-packages-to-production}

A jornada de pacotes individuais para um sistema de produção coeso envolve integração e extensão cuidadosas. Para o Forward Email, esse processo inclui:

* **Extensões Personalizadas**: Construir extensões específicas do Forward Email para nossos pacotes open source que atendem aos nossos requisitos únicos.
* **Padrões de Integração**: Desenvolver padrões para como esses pacotes interagem em um ambiente de produção.
* **Otimizações de Desempenho**: Identificar e resolver gargalos de desempenho que só surgem em escala.
* **Fortalecimento de Segurança**: Adicionar camadas adicionais de segurança específicas para o manuseio de e-mails e proteção de dados dos usuários.

Este trabalho representa milhares de horas de desenvolvimento além dos próprios pacotes principais, resultando em um serviço de e-mail robusto e seguro que aproveita o melhor de nossas contribuições open source.

### O Ciclo de Feedback {#the-feedback-loop}

Talvez o aspecto mais valioso de usar nossos próprios pacotes em produção seja o ciclo de feedback que isso cria. Quando encontramos limitações ou casos extremos no Forward Email, não apenas corrigimos localmente — melhoramos os pacotes subjacentes, beneficiando tanto nosso serviço quanto a comunidade em geral.

Essa abordagem levou a inúmeras melhorias:

* **Desligamento Gracioso do Bree**: A necessidade do Forward Email por implantações sem tempo de inatividade levou a capacidades aprimoradas de desligamento gracioso no Bree.
* **Reconhecimento de Padrões do Spam Scanner**: Padrões reais de spam encontrados no Forward Email informaram os algoritmos de detecção do Spam Scanner.
* **Otimizações de Desempenho do Cabin**: O registro de alto volume em produção revelou oportunidades de otimização no Cabin que beneficiam todos os usuários.

Mantendo esse ciclo virtuoso entre nosso trabalho open source e o serviço de produção, garantimos que nossos pacotes permaneçam soluções práticas e testadas em batalha, em vez de implementações teóricas.

## Princípios Centrais do Forward Email: Uma Fundação para a Excelência {#forward-emails-core-principles-a-foundation-for-excellence}

O Forward Email é projetado de acordo com um conjunto de princípios centrais que guiam todas as nossas decisões de desenvolvimento. Esses princípios, detalhados em nosso [site](/blog/docs/best-quantum-safe-encrypted-email-service#principles), garantem que nosso serviço permaneça amigável para desenvolvedores, seguro e focado na privacidade do usuário.

### Sempre Amigável para Desenvolvedores, Focado em Segurança e Transparente {#always-developer-friendly-security-focused-and-transparent}

Nosso primeiro e principal princípio é criar software que seja amigável para desenvolvedores, mantendo os mais altos padrões de segurança e privacidade. Acreditamos que a excelência técnica nunca deve vir às custas da usabilidade, e que a transparência constrói confiança com nossa comunidade.

Esse princípio se manifesta em nossa documentação detalhada, mensagens de erro claras e comunicação aberta sobre sucessos e desafios. Ao tornar todo o nosso código open source, convidamos à análise e colaboração, fortalecendo tanto nosso software quanto o ecossistema mais amplo.

### Aderência a Princípios de Desenvolvimento de Software Testados pelo Tempo {#adherence-to-time-tested-software-development-principles}

Seguimos vários princípios estabelecidos de desenvolvimento de software que provaram seu valor ao longo de décadas:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Separação de responsabilidades através do padrão Model-View-Controller
* **[Filosofia Unix](https://en.wikipedia.org/wiki/Unix_philosophy)**: Criar componentes modulares que fazem uma coisa bem feita
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Manter Simples e Direto
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Não se Repita, promovendo reutilização de código
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Você Não Vai Precisar Disso, evitando otimizações prematuras
* **[Twelve Factor](https://12factor.net/)**: Seguir as melhores práticas para construir aplicações modernas e escaláveis
* **[Navalha de Occam](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Escolher a solução mais simples que atenda aos requisitos
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Usar extensivamente nossos próprios produtos
Esses princípios não são apenas conceitos teóricos—eles estão incorporados em nossas práticas diárias de desenvolvimento. Por exemplo, nossa adesão à filosofia Unix é evidente em como estruturamos nossos pacotes npm: módulos pequenos e focados que podem ser compostos juntos para resolver problemas complexos.

### Alvo: o Desenvolvedor Persistente e Autossustentável {#targeting-the-scrappy-bootstrapped-developer}

Nosso foco é especificamente o desenvolvedor persistente, autossustentável e [ramen-profitable](https://www.paulgraham.com/ramenprofitable.html). Essa ênfase molda tudo, desde nosso modelo de precificação até nossas decisões técnicas. Entendemos os desafios de construir produtos com recursos limitados porque já estivemos nessa situação.

Esse princípio é particularmente importante na forma como abordamos o código aberto. Criamos e mantemos pacotes que resolvem problemas reais para desenvolvedores sem orçamentos empresariais, tornando ferramentas poderosas acessíveis a todos, independentemente de seus recursos.

### Princípios na Prática: A Base de Código do Forward Email {#principles-in-practice-the-forward-email-codebase}

Esses princípios são claramente visíveis na base de código do Forward Email. Nosso arquivo package.json revela uma seleção cuidadosa de dependências, cada uma escolhida para alinhar-se com nossos valores centrais:

* Pacotes focados em segurança como `mailauth` para autenticação de email
* Ferramentas amigáveis para desenvolvedores como `preview-email` para facilitar a depuração
* Componentes modulares como as diversas utilidades `p-*` de Sindre Sorhus

Seguindo esses princípios consistentemente ao longo do tempo, construímos um serviço no qual os desenvolvedores podem confiar para sua infraestrutura de email—seguro, confiável e alinhado com os valores da comunidade de código aberto.

### Privacidade desde o Design {#privacy-by-design}

Privacidade não é um pensamento posterior ou um recurso de marketing para o Forward Email—é um princípio fundamental de design que informa todos os aspectos do nosso serviço e código:

* **Criptografia de Acesso Zero**: Implementamos sistemas que tornam tecnicamente impossível para nós ler os emails dos usuários.
* **Coleta Mínima de Dados**: Coletamos apenas os dados necessários para fornecer nosso serviço, nada mais.
* **Políticas Transparentes**: Nossa política de privacidade é escrita em linguagem clara e compreensível, sem jargões legais.
* **Verificação por Código Aberto**: Nossa base de código open source permite que pesquisadores de segurança verifiquem nossas alegações de privacidade.

Esse compromisso se estende aos nossos pacotes open source, que são projetados com as melhores práticas de segurança e privacidade incorporadas desde o início.

### Código Aberto Sustentável {#sustainable-open-source}

Acreditamos que o software open source precisa de modelos sustentáveis para prosperar a longo prazo. Nossa abordagem inclui:

* **Suporte Comercial**: Oferecer suporte premium e serviços em torno de nossas ferramentas open source.
* **Licenciamento Equilibrado**: Usar licenças que protejam tanto as liberdades dos usuários quanto a sustentabilidade do projeto.
* **Engajamento Comunitário**: Engajar ativamente com colaboradores para construir uma comunidade de apoio.
* **Roteiros Transparentes**: Compartilhar nossos planos de desenvolvimento para permitir que os usuários planejem adequadamente.

Ao focar na sustentabilidade, garantimos que nossas contribuições open source possam continuar a crescer e melhorar ao longo do tempo, em vez de cair no abandono.

## Os Números Não Mentem: Nossas Impressionantes Estatísticas de Downloads no npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Quando falamos sobre o impacto do software open source, as estatísticas de downloads fornecem uma medida tangível de adoção e confiança. Muitos dos pacotes que ajudamos a manter alcançaram uma escala que poucos projetos open source conseguem, com downloads combinados na casa dos bilhões.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Embora tenhamos orgulho de ajudar a manter vários pacotes altamente baixados no ecossistema JavaScript, queremos reconhecer que muitos desses pacotes foram originalmente criados por outros desenvolvedores talentosos. Pacotes como superagent e supertest foram originalmente criados por TJ Holowaychuk, cujas contribuições prolíficas para o código aberto foram fundamentais para moldar o ecossistema Node.js.
### Uma Visão Geral do Nosso Impacto {#a-birds-eye-view-of-our-impact}

No período de apenas dois meses, de fevereiro a março de 2025, os principais pacotes aos quais contribuímos e ajudamos a manter registraram números impressionantes de downloads:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84.575.829 downloads\[^7] (originalmente criado por TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76.432.591 downloads\[^8] (originalmente criado por TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28.539.295 downloads\[^34] (originalmente criado por TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11.007.327 downloads\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3.498.918 downloads\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 downloads\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2.500.000 downloads\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1.800.000 downloads\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 downloads\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1.128.139 downloads\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1.124.686 downloads\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1.200.000 downloads\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894.666 downloads\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839.585 downloads\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145.000 downloads\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24.270 downloads\[^30]

> \[!NOTE]
> Vários outros pacotes que ajudamos a manter, mas que não criamos, têm contagens de downloads ainda maiores, incluindo `form-data` (mais de 738M downloads), `toidentifier` (mais de 309M downloads), `stackframe` (mais de 116M downloads) e `error-stack-parser` (mais de 113M downloads). Temos a honra de contribuir para esses pacotes respeitando o trabalho de seus autores originais.

Esses não são apenas números impressionantes — eles representam desenvolvedores reais resolvendo problemas reais com código que ajudamos a manter. Cada download é uma instância em que esses pacotes ajudaram alguém a construir algo significativo, desde projetos amadores até aplicações empresariais usadas por milhões.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Impacto Diário em Escala {#daily-impact-at-scale}

Os padrões diários de download revelam um uso consistente e em alto volume, com picos que alcançam milhões de downloads por dia\[^13]. Essa consistência demonstra a estabilidade e confiabilidade desses pacotes — os desenvolvedores não apenas os experimentam; eles os integram em seus fluxos de trabalho principais e dependem deles dia após dia.

Os padrões semanais de download mostram números ainda mais impressionantes, mantendo-se consistentemente em torno de dezenas de milhões de downloads por semana\[^14]. Isso representa uma pegada massiva no ecossistema JavaScript, com esses pacotes rodando em ambientes de produção ao redor do mundo.

### Além dos Números Brutos {#beyond-the-raw-numbers}

Embora as estatísticas de download sejam impressionantes por si só, elas contam uma história mais profunda sobre a confiança que a comunidade deposita nesses pacotes. Manter pacotes nessa escala requer um compromisso inabalável com:

* **Compatibilidade Retroativa**: As mudanças devem ser cuidadosamente consideradas para evitar quebrar implementações existentes.
* **Segurança**: Com milhões de aplicações dependendo desses pacotes, vulnerabilidades de segurança podem ter consequências de grande alcance.
* **Performance**: Nessa escala, até pequenas melhorias de desempenho podem trazer benefícios agregados significativos.
* **Documentação**: Documentação clara e abrangente é essencial para pacotes usados por desenvolvedores de todos os níveis de experiência.

O crescimento consistente nos números de download ao longo do tempo reflete o sucesso em cumprir esses compromissos, construindo confiança com a comunidade de desenvolvedores por meio de pacotes confiáveis e bem mantidos.
## Apoiar o Ecossistema: Nossas Patrocínios de Código Aberto {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> A sustentabilidade do código aberto não é apenas sobre contribuir com código — também é sobre apoiar os desenvolvedores que mantêm a infraestrutura crítica.

Além de nossas contribuições diretas para o ecossistema JavaScript, temos orgulho de patrocinar contribuintes proeminentes do Node.js cujo trabalho forma a base de muitas aplicações modernas. Nossos patrocínios incluem:

### Andris Reinman: Pioneiro da Infraestrutura de Email {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) é o criador do [Nodemailer](https://github.com/nodemailer/nodemailer), a biblioteca de envio de email mais popular para Node.js com mais de 14 milhões de downloads semanais\[^15]. Seu trabalho se estende a outros componentes críticos da infraestrutura de email como [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) e [WildDuck](https://github.com/nodemailer/wildduck).

Nosso patrocínio ajuda a garantir a manutenção e desenvolvimento contínuos dessas ferramentas essenciais que alimentam a comunicação por email para inúmeras aplicações Node.js, incluindo nosso próprio serviço Forward Email.

### Sindre Sorhus: Mestre dos Pacotes Utilitários {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) é um dos contribuintes de código aberto mais prolíficos no ecossistema JavaScript, com mais de 1.000 pacotes npm em seu nome. Suas utilidades como [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry) e [is-stream](https://github.com/sindresorhus/is-stream) são blocos fundamentais usados em todo o ecossistema Node.js.

Ao patrocinar o trabalho de Sindre, ajudamos a sustentar o desenvolvimento dessas utilidades críticas que tornam o desenvolvimento em JavaScript mais eficiente e confiável.

Esses patrocínios refletem nosso compromisso com o ecossistema mais amplo de código aberto. Reconhecemos que nosso próprio sucesso é construído sobre a base estabelecida por esses e outros contribuintes, e estamos dedicados a garantir a sustentabilidade de todo o ecossistema.


## Descobrindo Vulnerabilidades de Segurança no Ecossistema JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Nosso compromisso com o código aberto vai além do desenvolvimento de funcionalidades para incluir a identificação e resolução de vulnerabilidades de segurança que podem impactar milhões de desenvolvedores. Várias de nossas contribuições mais significativas para o ecossistema JavaScript têm sido na área de segurança.

### O Resgate do Koa-Router {#the-koa-router-rescue}

Em fevereiro de 2019, Nick identificou um problema crítico com a manutenção do popular pacote koa-router. Como ele [relatou no Hacker News](https://news.ycombinator.com/item?id=19156707), o pacote havia sido abandonado pelo mantenedor original, deixando vulnerabilidades de segurança sem solução e a comunidade sem atualizações.

> \[!WARNING]
> Pacotes abandonados com vulnerabilidades de segurança representam riscos significativos para todo o ecossistema, especialmente quando são baixados milhões de vezes por semana.

Em resposta, Nick criou [@koa/router](https://github.com/koajs/router) e ajudou a alertar a comunidade sobre a situação. Ele tem mantido esse pacote crítico desde então, garantindo que os usuários do Koa tenham uma solução de roteamento segura e bem mantida.

### Abordando Vulnerabilidades ReDoS {#addressing-redos-vulnerabilities}

Em 2020, Nick identificou e resolveu uma vulnerabilidade crítica de [Negação de Serviço por Expressão Regular (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) no amplamente utilizado pacote `url-regex`. Essa vulnerabilidade ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) poderia permitir que atacantes causassem negação de serviço fornecendo uma entrada especialmente criada que causava retrocesso catastrófico na expressão regular.

Em vez de simplesmente corrigir o pacote existente, Nick criou [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), uma implementação completamente reescrita que resolve a vulnerabilidade mantendo a compatibilidade com a API original. Ele também publicou um [post abrangente no blog](/blog/docs/url-regex-javascript-node-js) explicando a vulnerabilidade e como mitigá-la.
Este trabalho mostra nossa abordagem para segurança: não apenas corrigir problemas, mas educar a comunidade e fornecer alternativas robustas que previnem problemas semelhantes no futuro.

### Advocacia pela Segurança do Node.js e Chromium {#advocating-for-nodejs-and-chromium-security}

Nick também tem sido ativo na defesa de melhorias de segurança no ecossistema mais amplo. Em agosto de 2020, ele identificou um problema significativo de segurança no Node.js relacionado ao seu tratamento de cabeçalhos HTTP, que foi reportado em [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Esse problema, que decorreu de um patch no Chromium, poderia potencialmente permitir que atacantes contornassem medidas de segurança. A defesa de Nick ajudou a garantir que o problema fosse resolvido rapidamente, protegendo milhões de aplicações Node.js de possíveis explorações.

### Protegendo a Infraestrutura do npm {#securing-npm-infrastructure}

No mesmo mês, Nick identificou outro problema crítico de segurança, desta vez na infraestrutura de e-mail do npm. Conforme reportado em [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), o npm não estava implementando corretamente os protocolos de autenticação de e-mail DMARC, SPF e DKIM, permitindo potencialmente que atacantes enviassem e-mails de phishing que pareciam vir do npm.

O relatório de Nick levou a melhorias na postura de segurança de e-mail do npm, protegendo os milhões de desenvolvedores que dependem do npm para gerenciamento de pacotes contra possíveis ataques de phishing.


## Nossas Contribuições para o Ecossistema Forward Email {#our-contributions-to-the-forward-email-ecosystem-1}

O Forward Email é construído sobre vários projetos open source críticos, incluindo Nodemailer, WildDuck e mailauth. Nossa equipe fez contribuições significativas para esses projetos, ajudando a identificar e corrigir problemas profundos que afetam a entrega e segurança de e-mails.

### Aprimorando a Funcionalidade Central do Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) é a espinha dorsal do envio de e-mails no Node.js, e nossas contribuições ajudaram a torná-lo mais robusto:

* **Melhorias no Servidor SMTP**: Corrigimos bugs de parsing, problemas no manuseio de streams e problemas de configuração TLS no componente do servidor SMTP\[^16]\[^17].
* **Aprimoramentos no Parser de E-mails**: Abordamos erros de decodificação de sequências de caracteres e problemas no parser de endereços que poderiam causar falhas no processamento de e-mails\[^18]\[^19].

Essas contribuições garantem que o Nodemailer continue sendo uma base confiável para o processamento de e-mails em aplicações Node.js, incluindo o Forward Email.

### Avançando na Autenticação de E-mails com Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) fornece funcionalidades críticas de autenticação de e-mails, e nossas contribuições melhoraram significativamente suas capacidades:

* **Melhorias na Verificação DKIM**: Descobrimos e reportamos que o X/Twitter tinha problemas de cache DNS causando falha no DKIM para suas mensagens enviadas, reportando no Hacker One\[^20].
* **Aprimoramentos em DMARC e ARC**: Corrigimos problemas na verificação de DMARC e ARC que poderiam levar a resultados incorretos de autenticação\[^21]\[^22].
* **Otimizações de Performance**: Contribuímos com otimizações que melhoram o desempenho dos processos de autenticação de e-mails\[^23]\[^24]\[^25]\[^26].

Essas melhorias ajudam a garantir que a autenticação de e-mails seja precisa e confiável, protegendo os usuários contra ataques de phishing e spoofing.

### Principais Melhorias no Upptime {#key-upptime-enhancements}

Nossas contribuições para o Upptime incluem:

* **Monitoramento de Certificados SSL**: Adicionamos funcionalidade para monitorar a expiração de certificados SSL, prevenindo downtime inesperado devido a certificados expirados\[^27].
* **Suporte a Múltiplos Números de SMS**: Implementamos suporte para alertar múltiplos membros da equipe via SMS quando incidentes ocorrem, melhorando os tempos de resposta\[^28].
* **Correções nas Verificações IPv6**: Corrigimos problemas nas verificações de conectividade IPv6, garantindo monitoramento mais preciso em ambientes de rede modernos\[^29].
* **Suporte a Modo Escuro/Claro**: Adicionamos suporte a temas para melhorar a experiência do usuário nas páginas de status\[^31].
* **Melhor Suporte a TCP-Ping**: Aprimoramos a funcionalidade de ping TCP para fornecer testes de conexão mais confiáveis\[^32].
Essas melhorias não beneficiam apenas o monitoramento de status do Forward Email, mas estão disponíveis para toda a comunidade de usuários do Upptime, demonstrando nosso compromisso em aprimorar as ferramentas das quais dependemos.


## A Cola Que Mantém Tudo Junto: Código Personalizado em Escala {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Embora nossos pacotes npm e contribuições para projetos existentes sejam significativos, é o código personalizado que integra esses componentes que realmente demonstra nossa expertise técnica. A base de código do Forward Email representa uma década de esforço em desenvolvimento, remontando a 2017, quando o projeto começou como [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) antes de ser incorporado a um monorepo.

### Um Esforço Massivo de Desenvolvimento {#a-massive-development-effort}

A escala desse código de integração personalizado é impressionante:

* **Contribuições Totais**: Mais de 3.217 commits
* **Tamanho da Base de Código**: Mais de 421.545 linhas de código distribuídas entre arquivos JavaScript, Pug, CSS e JSON\[^33]

Isso representa milhares de horas de trabalho de desenvolvimento, sessões de depuração e otimizações de desempenho. É o "ingrediente secreto" que transforma pacotes individuais em um serviço coeso e confiável usado por milhares de clientes diariamente.

### Integração das Dependências Principais {#core-dependencies-integration}

A base de código do Forward Email integra inúmeras dependências em um todo harmonioso:

* **Processamento de Email**: Integra Nodemailer para envio, SMTP Server para recebimento e Mailparser para análise
* **Autenticação**: Usa Mailauth para verificação de DKIM, SPF, DMARC e ARC
* **Resolução DNS**: Utiliza Tangerine para DNS-over-HTTPS com cache global
* **Conexão MX**: Utiliza mx-connect com integração Tangerine para conexões confiáveis com servidores de email
* **Agendamento de Tarefas**: Emprega Bree para processamento confiável de tarefas em segundo plano com worker threads
* **Templating**: Usa email-templates para reutilizar folhas de estilo do site nas comunicações com clientes
* **Armazenamento de Email**: Implementa caixas de correio SQLite criptografadas individualmente usando better-sqlite3-multiple-ciphers com criptografia ChaCha20-Poly1305 para privacidade resistente a computação quântica, garantindo isolamento completo entre usuários e que somente o usuário tenha acesso à sua caixa de correio

Cada uma dessas integrações requer consideração cuidadosa de casos extremos, implicações de desempenho e preocupações de segurança. O resultado é um sistema robusto que lida com milhões de transações de email de forma confiável. Nossa implementação SQLite também utiliza msgpackr para serialização binária eficiente e WebSockets (via ws) para atualizações de status em tempo real em toda a nossa infraestrutura.

### Infraestrutura DNS com Tangerine e mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Um componente crítico da infraestrutura do Forward Email é nosso sistema de resolução DNS, construído em torno de dois pacotes-chave:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Nossa implementação Node.js de DNS-over-HTTPS fornece um substituto direto para o resolvedor DNS padrão, com tentativas automáticas, timeouts, rotação inteligente de servidores e suporte a cache.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Este pacote estabelece conexões TCP com servidores MX, recebendo um domínio alvo ou endereço de email, resolvendo os servidores MX apropriados e conectando-se a eles em ordem de prioridade.

Integramos o Tangerine com o mx-connect por meio do [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), garantindo requisições DNS sobre HTTP na camada de aplicação em todo o Forward Email. Isso proporciona cache global para DNS em escala com consistência 1:1 em qualquer região, aplicativo ou processo — fundamental para entrega confiável de emails em um sistema distribuído.


## Impacto Empresarial: De Código Aberto a Soluções Críticas para Missão {#enterprise-impact-from-open-source-to-mission-critical-solutions}

A culminação de nossa jornada de uma década em desenvolvimento open source permitiu que o Forward Email atendesse não apenas desenvolvedores individuais, mas também grandes empresas e instituições educacionais que formam a espinha dorsal do próprio movimento open source.
### Estudos de Caso em Infraestrutura de Email Crítica para Missão {#case-studies-in-mission-critical-email-infrastructure}

Nosso compromisso com confiabilidade, privacidade e princípios de código aberto fez do Forward Email a escolha confiável para organizações com requisitos rigorosos de email:

* **Instituições Educacionais**: Conforme detalhado em nosso [estudo de caso sobre encaminhamento de email para ex-alunos](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), grandes universidades dependem da nossa infraestrutura para manter conexões ao longo da vida com centenas de milhares de ex-alunos por meio de serviços confiáveis de encaminhamento de email.

* **Soluções Empresariais Linux**: O [estudo de caso empresarial de email da Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) demonstra como nossa abordagem de código aberto se alinha perfeitamente às necessidades dos provedores empresariais de Linux, oferecendo a transparência e o controle que eles exigem.

* **Fundações de Código Aberto**: Talvez o mais validante seja nossa parceria com a Linux Foundation, conforme documentado no [estudo de caso empresarial de email da Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), onde nosso serviço alimenta a comunicação da própria organização que gerencia o desenvolvimento do Linux.

Há uma bela simetria em como nossos pacotes de código aberto, mantidos com cuidado ao longo de muitos anos, nos permitiram construir um serviço de email que agora suporta as próprias comunidades e organizações que defendem o software de código aberto. Essa jornada completa — desde contribuir com pacotes individuais até alimentar uma infraestrutura de email de nível empresarial para líderes de código aberto — representa a validação máxima da nossa abordagem ao desenvolvimento de software.


## Uma Década de Código Aberto: Olhando para o Futuro {#a-decade-of-open-source-looking-forward}

Ao olharmos para trás em uma década de contribuições de código aberto e para os próximos dez anos, estamos cheios de gratidão pela comunidade que apoiou nosso trabalho e empolgação pelo que está por vir.

Nossa jornada de contribuidores de pacotes individuais a mantenedores de uma infraestrutura abrangente de email usada por grandes empresas e fundações de código aberto tem sido notável. É um testemunho do poder do desenvolvimento de código aberto e do impacto que um software bem pensado e bem mantido pode ter no ecossistema mais amplo.

Nos próximos anos, estamos comprometidos a:

* **Continuar a manter e melhorar nossos pacotes existentes**, garantindo que permaneçam ferramentas confiáveis para desenvolvedores em todo o mundo.
* **Expandir nossas contribuições para projetos de infraestrutura crítica**, particularmente nos domínios de email e segurança.
* **Aprimorar as capacidades do Forward Email** enquanto mantemos nosso compromisso com privacidade, segurança e transparência.
* **Apoiar a próxima geração de contribuidores de código aberto** por meio de mentoria, patrocínio e engajamento comunitário.

Acreditamos que o futuro do desenvolvimento de software é aberto, colaborativo e construído sobre uma base de confiança. Ao continuar a contribuir com pacotes de alta qualidade e focados em segurança para o ecossistema JavaScript, esperamos desempenhar um pequeno papel na construção desse futuro.

Obrigado a todos que usaram nossos pacotes, contribuíram para nossos projetos, relataram problemas ou simplesmente divulgaram nosso trabalho. Seu apoio tornou possível esta década de impacto, e estamos animados para ver o que podemos realizar juntos nos próximos dez anos.

\[^1]: estatísticas de download do npm para cabin, abril de 2025  
\[^2]: estatísticas de download do npm para bson-objectid, fevereiro-março de 2025  
\[^3]: estatísticas de download do npm para url-regex-safe, abril de 2025  
\[^4]: contagem de estrelas no GitHub para forwardemail/forwardemail.net em abril de 2025  
\[^5]: estatísticas de download do npm para preview-email, abril de 2025  
\[^7]: estatísticas de download do npm para superagent, fevereiro-março de 2025  
\[^8]: estatísticas de download do npm para supertest, fevereiro-março de 2025  
\[^9]: estatísticas de download do npm para preview-email, fevereiro-março de 2025  
\[^10]: estatísticas de download do npm para cabin, fevereiro-março de 2025  
\[^11]: estatísticas de download do npm para url-regex-safe, fevereiro-março de 2025  
\[^12]: estatísticas de download do npm para spamscanner, fevereiro-março de 2025  
\[^13]: padrões diários de download das estatísticas do npm, abril de 2025  
\[^14]: padrões semanais de download das estatísticas do npm, abril de 2025  
\[^15]: estatísticas de download do npm para nodemailer, abril de 2025  
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>  
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>  
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>  
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>  
\[^20]: <https://github.com/postalsys/mailauth/issues/30>  
\[^21]: <https://github.com/postalsys/mailauth/issues/58>  
\[^22]: <https://github.com/postalsys/mailauth/issues/48>  
\[^23]: <https://github.com/postalsys/mailauth/issues/74>  
\[^24]: <https://github.com/postalsys/mailauth/issues/75>  
\[^25]: <https://github.com/postalsys/mailauth/issues/60>  
\[^26]: <https://github.com/postalsys/mailauth/issues/73>  
\[^27]: Baseado em issues do GitHub no repositório Upptime  
\[^28]: Baseado em issues do GitHub no repositório Upptime  
\[^29]: Baseado em issues do GitHub no repositório Upptime  
\[^30]: estatísticas de download do npm para bree, fevereiro-março de 2025  
\[^31]: Baseado em pull requests do GitHub para Upptime  
\[^32]: Baseado em pull requests do GitHub para Upptime  
\[^34]: estatísticas de download do npm para koa, fevereiro-março de 2025  
\[^35]: estatísticas de download do npm para @koa/router, fevereiro-março de 2025  
\[^36]: estatísticas de download do npm para koa-router, fevereiro-março de 2025  
\[^37]: estatísticas de download do npm para url-regex, fevereiro-março de 2025  
\[^38]: estatísticas de download do npm para @breejs/later, fevereiro-março de 2025  
\[^39]: estatísticas de download do npm para email-templates, fevereiro-março de 2025  
\[^40]: estatísticas de download do npm para get-paths, fevereiro-março de 2025  
\[^41]: estatísticas de download do npm para dotenv-parse-variables, fevereiro-março de 2025  
\[^42]: estatísticas de download do npm para @koa/multer, fevereiro-março de 2025
