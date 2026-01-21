# Uma década de impacto: como nossos pacotes npm atingiram 1 bilhão de downloads e moldaram o JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [Os pioneiros que confiam em nós: Isaac Z. Schlueter e Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Da criação do npm à liderança do Node.js](#from-npms-creation-to-nodejs-leadership)
* [O arquiteto por trás do código: a jornada de Nick Baugh](#the-architect-behind-the-code-nick-baughs-journey)
  * [Comitê Técnico Expresso e Contribuições Principais](#express-technical-committee-and-core-contributions)
  * [Contribuições do Framework Koa](#koa-framework-contributions)
  * [De colaborador individual a líder organizacional](#from-individual-contributor-to-organization-leader)
* [Nossas Organizações do GitHub: Ecossistemas de Inovação](#our-github-organizations-ecosystems-of-innovation)
  * [Cabine: Registro Estruturado para Aplicações Modernas](#cabin-structured-logging-for-modern-applications)
  * [Verificador de Spam: Combatendo o Abuso de E-mail](#spam-scanner-fighting-email-abuse)
  * [Bree: Agendamento de tarefas moderno com threads de trabalho](#bree-modern-job-scheduling-with-worker-threads)
  * [Encaminhar e-mail: Infraestrutura de e-mail de código aberto](#forward-email-open-source-email-infrastructure)
  * [Lad: Utilitários e ferramentas essenciais da Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Monitoramento de tempo de atividade de código aberto](#upptime-open-source-uptime-monitoring)
* [Nossas contribuições para o ecossistema de e-mail de encaminhamento](#our-contributions-to-the-forward-email-ecosystem)
  * [Das embalagens à produção](#from-packages-to-production)
  * [O ciclo de feedback](#the-feedback-loop)
* [Princípios básicos do Forward Email: uma base para a excelência](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Sempre amigável ao desenvolvedor, focado na segurança e transparente](#always-developer-friendly-security-focused-and-transparent)
  * [Adesão aos princípios de desenvolvimento de software testados pelo tempo](#adherence-to-time-tested-software-development-principles)
  * [Visando o desenvolvedor desorganizado e autossuficiente](#targeting-the-scrappy-bootstrapped-developer)
  * [Princípios na prática: a base de código do Forward Email](#principles-in-practice-the-forward-email-codebase)
  * [Privacidade por Design](#privacy-by-design)
  * [Código Aberto Sustentável](#sustainable-open-source)
* [Os números não mentem: Nossas estatísticas impressionantes de download do npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Uma visão panorâmica do nosso impacto](#a-birds-eye-view-of-our-impact)
  * [Impacto diário em escala](#daily-impact-at-scale)
  * [Além dos números brutos](#beyond-the-raw-numbers)
* [Apoiando o ecossistema: nossos patrocínios de código aberto](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pioneiro em infraestrutura de e-mail](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: idealizador do pacote de utilitários](#sindre-sorhus-utility-package-mastermind)
* [Descobrindo vulnerabilidades de segurança no ecossistema JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [O resgate do Koa-Router](#the-koa-router-rescue)
  * [Abordando vulnerabilidades ReDoS](#addressing-redos-vulnerabilities)
  * [Defendendo a segurança do Node.js e do Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Protegendo a infraestrutura npm](#securing-npm-infrastructure)
* [Nossas contribuições para o ecossistema de e-mail de encaminhamento](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Aprimorando a funcionalidade principal do Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Avançando na autenticação de e-mail com Mailauth](#advancing-email-authentication-with-mailauth)
  * [Principais melhorias no tempo de atividade](#key-upptime-enhancements)
* [A cola que mantém tudo unido: código personalizado em escala](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Um esforço de desenvolvimento massivo](#a-massive-development-effort)
  * [Integração de Dependências Principais](#core-dependencies-integration)
  * [Infraestrutura DNS com Tangerine e mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Impacto empresarial: do código aberto às soluções de missão crítica](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Estudos de caso em infraestrutura de e-mail de missão crítica](#case-studies-in-mission-critical-email-infrastructure)
* [Uma década de código aberto: olhando para o futuro](#a-decade-of-open-source-looking-forward)

## Prefácio {#foreword}

No mundo [JavaScript](https://en.wikipedia.org/wiki/JavaScript) e [Node.js](https://en.wikipedia.org/wiki/Node.js), alguns pacotes são essenciais — baixados milhões de vezes por dia e que alimentam aplicativos no mundo todo. Por trás dessas ferramentas, há desenvolvedores focados na qualidade do código aberto. Hoje, mostraremos como nossa equipe ajuda a criar e manter pacotes npm que se tornaram partes essenciais do ecossistema JavaScript.

## Os pioneiros que confiam em nós: Isaac Z. Schlueter e e-mail de encaminhamento {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Temos orgulho de ter [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) como usuário. Isaac criou [npm](https://en.wikipedia.org/wiki/Npm_\(software\) e ajudou a construir [Node.js](https://en.wikipedia.org/wiki/Node.js). Sua confiança no Forward Email demonstra nosso foco em qualidade e segurança. Isaac usa o Forward Email para vários domínios, incluindo izs.me.

O impacto de Isaac no JavaScript é enorme. Em 2009, ele foi um dos primeiros a enxergar o potencial do Node.js, trabalhando com [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), que criou a plataforma. Como Isaac disse em um [entrevista com a revista Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "No meio dessa pequena comunidade de um grupo de pessoas tentando descobrir como implementar JavaScript no lado do servidor, Ryan Dahl lançou o Node, que era claramente a abordagem certa. Eu me dediquei a isso e me envolvi bastante em meados de 2009."

> \[!NOTE]
> Para os interessados na história do Node.js, há excelentes documentários disponíveis que registram seu desenvolvimento, incluindo [A história do Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) e [10 coisas que lamento sobre o Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). [site pessoal](https://tinyclouds.org/), de Ryan Dahl, também contém insights valiosos sobre seu trabalho.

### Da criação do npm à liderança do Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac criou o npm em setembro de 2009, com a primeira versão utilizável lançada no início de 2010. Este gerenciador de pacotes atendeu a uma necessidade fundamental do Node.js, permitindo que desenvolvedores compartilhassem e reutilizassem código facilmente. De acordo com o [Página da Wikipédia sobre Node.js](https://en.wikipedia.org/wiki/Node.js), "Em janeiro de 2010, um gerenciador de pacotes foi introduzido para o ambiente Node.js, chamado npm. O gerenciador de pacotes permite que programadores publiquem e compartilhem pacotes Node.js, juntamente com o código-fonte que os acompanha, e foi projetado para simplificar a instalação, atualização e desinstalação de pacotes."

Quando Ryan Dahl se afastou do Node.js em janeiro de 2012, Isaac assumiu como líder do projeto. Conforme observado em [seu resumo](https://izs.me/resume), ele "liderou o desenvolvimento de diversas APIs fundamentais do Node.js, incluindo o sistema de módulos CommonJS, APIs de sistema de arquivos e fluxos" e "atuou como BDFL (Benevolent Dictator For Life) do projeto por 2 anos, garantindo qualidade cada vez maior e um processo de compilação confiável para as versões v0.6 a v0.10 do Node.js."

Isaac guiou o Node.js por um período crucial de crescimento, estabelecendo padrões que moldam a plataforma até hoje. Mais tarde, em 2014, fundou a npm, Inc. para dar suporte ao registro npm, que ele administrava por conta própria.

Agradecemos a Isaac por suas enormes contribuições ao JavaScript e continuamos a usar muitos dos pacotes que ele criou. Seu trabalho mudou a forma como construímos software e como milhões de desenvolvedores compartilham código em todo o mundo.

## O arquiteto por trás do código: a jornada de Nick Baugh {#the-architect-behind-the-code-nick-baughs-journey}

No centro do nosso sucesso em código aberto está Nick Baugh, fundador e proprietário da Forward Email. Seu trabalho com JavaScript abrange quase 20 anos e moldou a forma como inúmeros desenvolvedores criam aplicativos. Sua jornada em código aberto demonstra tanto habilidade técnica quanto liderança comunitária.

### Comitê Técnico Expresso e Contribuições Principais {#express-technical-committee-and-core-contributions}

A experiência de Nick em frameworks web lhe rendeu uma vaga no [Comitê Técnico Expresso](https://expressjs.com/en/resources/community.html), onde ajudou com um dos frameworks Node.js mais utilizados. Nick agora está listado como membro inativo no [Página da comunidade Express](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> O Express foi originalmente criado por TJ Holowaychuk, um prolífico colaborador de código aberto que moldou grande parte do ecossistema Node.js. Somos gratos pelo trabalho fundamental de TJ e respeitamos seu [decisão de fazer uma pausa](https://news.ycombinator.com/item?id=37687017) por suas extensas contribuições ao código aberto.

Como membro do [Comitê Técnico Expresso](https://expressjs.com/en/resources/community.html), Nick demonstrou grande atenção aos detalhes em questões como esclarecer a documentação do `req.originalUrl` e corrigir problemas de manipulação de formulários multipartes.

### Contribuições da Estrutura Koa {#koa-framework-contributions}

O trabalho de Nick com o [Estrutura Koa](https://github.com/koajs/koa) — uma alternativa moderna e mais leve ao Express, também criada por TJ Holowaychuk — demonstra ainda mais seu compromisso com ferramentas de desenvolvimento web de melhor qualidade. Suas contribuições para o Koa incluem problemas e código por meio de pull requests, abordando tratamento de erros, gerenciamento de tipos de conteúdo e melhorias na documentação.

Seu trabalho no Express e no Koa lhe dá uma visão única do desenvolvimento web em Node.js, ajudando nossa equipe a criar pacotes que funcionam bem com vários ecossistemas de framework.

### De colaborador individual a líder da organização {#from-individual-contributor-to-organization-leader}

O que começou como auxílio a projetos existentes evoluiu para a criação e manutenção de ecossistemas de pacotes completos. Nick fundou várias organizações no GitHub — incluindo [Cabine](https://github.com/cabinjs), [Verificador de spam](https://github.com/spamscanner), [Encaminhar e-mail](https://github.com/forwardemail), [Rapaz](https://github.com/ladjs) e [Bri](https://github.com/breejs) — cada uma atendendo a necessidades específicas da comunidade JavaScript.

Essa mudança de colaborador para líder demonstra a visão de Nick para um software bem projetado que solucione problemas reais. Ao organizar pacotes relacionados em organizações focadas no GitHub, ele construiu ecossistemas de ferramentas que funcionam em conjunto, permanecendo modulares e flexíveis para a comunidade de desenvolvedores em geral.

## Nossas organizações do GitHub: Ecossistemas de inovação {#our-github-organizations-ecosystems-of-innovation}

Organizamos nosso trabalho de código aberto em torno de organizações focadas no GitHub, cada uma atendendo a necessidades específicas em JavaScript. Essa estrutura cria famílias de pacotes coesas que funcionam bem juntas, mantendo-se modulares.

Cabine ###: Registro estruturado para aplicações modernas {#cabin-structured-logging-for-modern-applications}

O [Organização da cabine](https://github.com/cabinjs) é a nossa abordagem para registro de aplicativos simples e poderoso. O pacote principal [`cabin`](https://github.com/cabinjs/cabin) tem quase 900 estrelas no GitHub e mais de 100.000 downloads semanais\[^1]. O Cabin oferece registro estruturado que funciona com serviços populares como Sentry, LogDNA e Papertrail.

O que torna o Cabin especial é seu sistema de API e plugins bem pensado. Pacotes de suporte como [`axe`](https://github.com/cabinjs/axe) para middleware Express e [`parse-request`](https://github.com/cabinjs/parse-request) para análise de solicitações HTTP demonstram nosso compromisso com soluções completas em vez de ferramentas isoladas.

O pacote [`bson-objectid`](https://github.com/cabinjs/bson-objectid) merece menção especial, com mais de 1,7 milhão de downloads em apenas dois meses\[^2]. Essa implementação leve do ObjectID do MongoDB tornou-se a escolha ideal para desenvolvedores que precisam de IDs sem dependências completas do MongoDB.

### Verificador de Spam: Combatendo o Abuso de E-mail {#spam-scanner-fighting-email-abuse}

O [Organização do Spam Scanner](https://github.com/spamscanner) demonstra nosso compromisso em resolver problemas reais. O pacote principal, [`spamscanner`](https://github.com/spamscanner/spamscanner), oferece detecção avançada de spam por e-mail, mas é o pacote [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) que tem tido uma adoção incrível.

Com mais de 1,2 milhão de downloads em dois meses\[^3], o `url-regex-safe` corrige problemas críticos de segurança em outras expressões regulares de detecção de URL. Este pacote demonstra nossa abordagem ao código aberto: encontrar um problema comum (neste caso, vulnerabilidades do [Refazer](https://en.wikipedia.org/wiki/ReDoS) na validação de URL), criar uma solução sólida e mantê-la cuidadosamente.

### Bree: Agendamento de tarefas moderno com threads de trabalho {#bree-modern-job-scheduling-with-worker-threads}

O [Organização Bree](https://github.com/breejs) é a nossa resposta a um desafio comum do Node.js: agendamento confiável de tarefas. O pacote principal [`bree`](https://github.com/breejs/bree), com mais de 3.100 estrelas no GitHub, fornece um agendador de tarefas moderno usando threads de trabalho do Node.js para melhor desempenho e confiabilidade.

> \[!NOTE]
> A Bree foi criada depois que ajudamos a manter o [Agenda](https://github.com/agenda/agenda), aplicando as lições aprendidas para construir um agendador de tarefas melhor. Nossas contribuições para a Agenda nos ajudaram a encontrar maneiras de aprimorar o agendamento de tarefas.

O que torna o Bree diferente de outros agendadores como o Agenda:

* **Sem Dependências Externas**: Ao contrário do Agenda, que precisa do MongoDB, o Bree não requer Redis ou MongoDB para gerenciar o estado dos jobs.
* **Threads de Trabalho**: O Bree usa threads de trabalho do Node.js para processos em sandbox, proporcionando melhor isolamento e desempenho.
* **API Simples**: O Bree oferece controle detalhado com simplicidade, facilitando a implementação de necessidades complexas de agendamento.
* **Suporte Integrado**: Recursos como recarga suave, tarefas cron, datas e horários intuitivos são incluídos por padrão.

Bree é uma parte fundamental do [forwardemail.net](https://github.com/forwardemail/forwardemail.net), lidando com tarefas críticas em segundo plano, como processamento de e-mails, limpeza e manutenção programada. Usar Bree no Forward Email demonstra nosso compromisso em usar nossas próprias ferramentas em produção, garantindo que atendam a altos padrões de confiabilidade.

Também usamos e apreciamos outros excelentes pacotes de threads de trabalho, como [piscina](https://github.com/piscinajs/piscina), e clientes HTTP, como [onze](https://github.com/nodejs/undici). Piscina, assim como Bree, usa threads de trabalho do Node.js para um processamento eficiente de tarefas. Agradecemos a [Matthew Hill](https://github.com/mcollina), que mantém o undici e o piscina, por suas importantes contribuições ao Node.js. Matteo atua no Comitê de Direção Técnica do Node.js e aprimorou significativamente os recursos do cliente HTTP no Node.js.

### Encaminhar e-mail: Infraestrutura de e-mail de código aberto {#forward-email-open-source-email-infrastructure}

Nosso projeto mais ambicioso é o [Encaminhar e-mail](https://github.com/forwardemail), um serviço de e-mail de código aberto que oferece encaminhamento de e-mails, armazenamento e serviços de API. O repositório principal tem mais de 1.100 estrelas no GitHub\[^4], demonstrando o apreço da comunidade por essa alternativa aos serviços de e-mail proprietários.

O pacote [`preview-email`](https://github.com/forwardemail/preview-email) desta organização, com mais de 2,5 milhões de downloads em dois meses\[^5], tornou-se uma ferramenta essencial para desenvolvedores que trabalham com modelos de e-mail. Ao fornecer uma maneira simples de visualizar e-mails durante o desenvolvimento, ele resolve um problema comum na criação de aplicativos habilitados para e-mail.

### Lad: Utilitários e ferramentas essenciais do Koa {#lad-essential-koa-utilities-and-tools}

O [Organização Lad](https://github.com/ladjs) fornece uma coleção de utilitários e ferramentas essenciais com foco principal no aprimoramento do ecossistema do framework Koa. Esses pacotes resolvem desafios comuns no desenvolvimento web e foram projetados para funcionar perfeitamente em conjunto, mantendo-se úteis de forma independente.

#### koa-better-error-handler: Tratamento de erros aprimorado para Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) oferece uma solução melhor para tratamento de erros em aplicações Koa. Com mais de 50 estrelas no GitHub, este pacote permite que `ctx.throw` produza mensagens de erro intuitivas, ao mesmo tempo que aborda diversas limitações do manipulador de erros integrado do Koa:

* Detecta e trata corretamente erros de DNS do Node.js, erros do Mongoose e erros do Redis
* Utiliza [Estrondo](https://github.com/hapijs/boom) para criar respostas de erro consistentes e bem formatadas
* Preserva cabeçalhos (ao contrário do manipulador integrado do Koa)
* Mantém códigos de status apropriados em vez de usar o padrão 500
* Suporta mensagens flash e preservação de sessão
* Fornece listas de erros em HTML para erros de validação
* Suporta vários tipos de resposta (HTML, JSON e texto simples)

Este pacote é particularmente valioso quando usado junto com [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) para gerenciamento abrangente de erros em aplicativos Koa.

Passaporte ####: Autenticação para Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) estende o popular middleware de autenticação Passport.js com melhorias específicas para aplicações web modernas. Este pacote oferece suporte imediato a diversas estratégias de autenticação:

* Autenticação local por e-mail
* Login com Apple
* Autenticação GitHub
* Autenticação Google
* Autenticação por senha de uso único (OTP)

O pacote é altamente personalizável, permitindo que os desenvolvedores ajustem os nomes e frases dos campos para atender aos requisitos de seus aplicativos. Ele foi projetado para se integrar perfeitamente ao Mongoose para gerenciamento de usuários, tornando-se uma solução ideal para aplicativos baseados em Koa que exigem autenticação robusta.

#### graceful: Desligamento elegante do aplicativo {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) resolve o desafio crítico de encerrar aplicativos Node.js com elegância. Com mais de 70 estrelas no GitHub, este pacote garante que seu aplicativo possa ser encerrado sem problemas, sem perda de dados ou conexões travadas. Os principais recursos incluem:

* Suporte para fechamento adequado de servidores HTTP (Express/Koa/Fastify)
* Desligamento limpo de conexões de banco de dados (MongoDB/Mongoose)
* Fechamento correto de clientes Redis
* Tratamento de agendadores de tarefas Bree
* Suporte para manipuladores de desligamento personalizados
* Configurações de tempo limite configuráveis
* Integração com sistemas de registro

Este pacote é essencial para aplicações de produção onde desligamentos inesperados podem levar à perda ou corrupção de dados. Ao implementar procedimentos de desligamento adequados, `@ladjs/graceful` ajuda a garantir a confiabilidade e a estabilidade da sua aplicação.

### Upptime: Monitoramento de tempo de atividade de código aberto {#upptime-open-source-uptime-monitoring}

O [Organização do tempo de atividade](https://github.com/upptime) representa nosso compromisso com o monitoramento transparente e de código aberto. O repositório principal [`upptime`](https://github.com/upptime/upptime) possui mais de 13.000 estrelas no GitHub, tornando-o um dos projetos mais populares para os quais contribuímos. O Upptime fornece um monitor de tempo de atividade e uma página de status com tecnologia GitHub que opera totalmente sem um servidor.

Usamos o Upptime para nossa própria página de status em <https://status.forwardemail.net> com o código-fonte disponível em <https://github.com/forwardemail/status.forwardemail.net>.

O que torna o Upptime especial é sua arquitetura:

* **100% Código Aberto**: Todos os componentes são totalmente de código aberto e personalizáveis.
* **Desenvolvido pelo GitHub**: Utiliza Ações, Issues e Páginas do GitHub para uma solução de monitoramento sem servidor.
* **Sem Servidor Requerido**: Ao contrário das ferramentas de monitoramento tradicionais, o Upptime não exige que você execute ou mantenha um servidor.
* **Página de Status Automática**: Gera uma linda página de status que pode ser hospedada nas Páginas do GitHub.
* **Notificações Poderosas**: Integra-se a vários canais de notificação, incluindo e-mail, SMS e Slack.

Para aprimorar a experiência dos nossos usuários, integramos [@octokit/núcleo](https://github.com/octokit/core.js/) à base de código forwardemail.net para exibir atualizações de status e incidentes em tempo real diretamente em nosso site. Essa integração proporciona transparência aos nossos usuários em caso de problemas em toda a nossa pilha (site, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, etc.) com notificações instantâneas, alterações nos ícones de emblemas, cores de aviso e muito mais.

A biblioteca @octokit/core nos permite buscar dados em tempo real do nosso repositório Upptime no GitHub, processá-los e exibi-los de forma intuitiva. Quando qualquer serviço sofre uma interrupção ou degradação de desempenho, os usuários são notificados imediatamente por meio de indicadores visuais, sem precisar sair do aplicativo principal. Essa integração perfeita garante que nossos usuários tenham sempre informações atualizadas sobre o status do nosso sistema, aumentando a transparência e a confiança.

O Upptime foi adotado por centenas de organizações que buscam uma maneira transparente e confiável de monitorar seus serviços e comunicar o status aos usuários. O sucesso do projeto demonstra o poder da construção de ferramentas que aproveitam a infraestrutura existente (neste caso, o GitHub) para resolver problemas comuns de novas maneiras.

## Nossas contribuições para o ecossistema de e-mail encaminhado {#our-contributions-to-the-forward-email-ecosystem}

Embora nossos pacotes de código aberto sejam usados por desenvolvedores no mundo todo, eles também formam a base do nosso próprio serviço de Encaminhamento de E-mails. Essa dupla função — como criadores e usuários dessas ferramentas — nos dá uma perspectiva única sobre sua aplicação no mundo real e impulsiona a melhoria contínua.

### Dos Pacotes para Produção {#from-packages-to-production}

A jornada de pacotes individuais para um sistema de produção coeso envolve integração e expansão cuidadosas. Para o Forward Email, esse processo inclui:

* **Extensões Personalizadas**: Desenvolvendo extensões específicas para o Forward Email em nossos pacotes de código aberto que atendem aos nossos requisitos exclusivos.
* **Padrões de Integração**: Desenvolvendo padrões para a interação desses pacotes em um ambiente de produção.
* **Otimizações de Desempenho**: Identificando e abordando gargalos de desempenho que só surgem em escala.
* **Reforço da Segurança**: Adicionando camadas de segurança adicionais específicas para o tratamento de e-mails e a proteção de dados do usuário.

Este trabalho representa milhares de horas de desenvolvimento além dos pacotes principais, resultando em um serviço de e-mail robusto e seguro que aproveita o melhor de nossas contribuições de código aberto.

### O ciclo de feedback {#the-feedback-loop}

Talvez o aspecto mais valioso de usar nossos próprios pacotes em produção seja o ciclo de feedback que isso cria. Quando encontramos limitações ou casos extremos no Forward Email, não os corrigimos apenas localmente — aprimoramos os pacotes subjacentes, beneficiando tanto o nosso serviço quanto a comunidade em geral.

Essa abordagem levou a inúmeras melhorias:

* **Desligamento Gracioso do Bree**: A necessidade do Forward Email por implantações sem tempo de inatividade levou a recursos aprimorados de desligamento gradual no Bree.
* **Reconhecimento de Padrões do Spam Scanner**: Padrões reais de spam encontrados no Forward Email orientaram os algoritmos de detecção do Spam Scanner.
* **Otimizações de Desempenho do Cabin**: O alto volume de registros em produção revelou oportunidades de otimização no Cabin que beneficiam todos os usuários.

Ao manter esse ciclo virtuoso entre nosso trabalho de código aberto e serviço de produção, garantimos que nossos pacotes continuem sendo soluções práticas e testadas em prática, em vez de implementações teóricas.

## Princípios básicos do Forward Email: uma base para a excelência {#forward-emails-core-principles-a-foundation-for-excellence}

O Forward Email foi desenvolvido de acordo com um conjunto de princípios básicos que norteiam todas as nossas decisões de desenvolvimento. Esses princípios, detalhados em nosso [site](/blog/docs/best-quantum-safe-encrypted-email-service#principles), garantem que nosso serviço permaneça amigável ao desenvolvedor, seguro e focado na privacidade do usuário.

### Sempre amigável ao desenvolvedor, focado na segurança e transparente {#always-developer-friendly-security-focused-and-transparent}

Nosso principal princípio é criar softwares amigáveis ao desenvolvedor, mantendo os mais altos padrões de segurança e privacidade. Acreditamos que a excelência técnica nunca deve comprometer a usabilidade e que a transparência gera confiança em nossa comunidade.

Esse princípio se reflete em nossa documentação detalhada, mensagens de erro claras e comunicação aberta sobre sucessos e desafios. Ao tornar toda a nossa base de código de código aberto, convidamos ao escrutínio e à colaboração, fortalecendo tanto nosso software quanto o ecossistema em geral.

### Adesão aos princípios de desenvolvimento de software testados pelo tempo {#adherence-to-time-tested-software-development-principles}

Seguimos vários princípios estabelecidos de desenvolvimento de software que provaram seu valor ao longo de décadas:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Separando preocupações por meio do padrão Model-View-Controller
* **[Filosofia Unix](https://en.wikipedia.org/wiki/Unix_philosophy)**: Criando componentes modulares que fazem uma coisa bem
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Mantendo a simplicidade e a objetividade
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Não se repita, promovendo a reutilização de código
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Você não vai precisar disso, evitando otimização prematura
* **[Fator Doze](https://12factor.net/)**: Seguindo as melhores práticas para construir aplicativos modernos e escaláveis
* **[Navalha de Occam](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Escolhendo a solução mais simples que atenda aos requisitos
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Usando nossos próprios produtos extensivamente

Esses princípios não são apenas conceitos teóricos — eles estão incorporados às nossas práticas diárias de desenvolvimento. Por exemplo, nossa adesão à filosofia Unix fica evidente na forma como estruturamos nossos pacotes npm: módulos pequenos e focados que podem ser compostos juntos para resolver problemas complexos.

### Visando o desenvolvedor desorganizado e bootstrapped {#targeting-the-scrappy-bootstrapped-developer}

Nosso foco é voltado especificamente para desenvolvedores desorganizados, que usam bootstrap e que precisam de um [ramen lucrativo](https://www.paulgraham.com/ramenprofitable.html). Esse foco molda tudo, desde nosso modelo de precificação até nossas decisões técnicas. Entendemos os desafios de desenvolver produtos com recursos limitados porque já passamos por isso.

Este princípio é particularmente importante na forma como abordamos o código aberto. Criamos e mantemos pacotes que resolvem problemas reais para desenvolvedores sem orçamentos corporativos, tornando ferramentas poderosas acessíveis a todos, independentemente de seus recursos.

### Princípios na prática: Código-base de encaminhamento de e-mail {#principles-in-practice-the-forward-email-codebase}

Esses princípios são claramente visíveis na base de código do Forward Email. Nosso arquivo package.json revela uma seleção criteriosa de dependências, cada uma escolhida para se alinhar aos nossos valores fundamentais:

* Pacotes focados em segurança, como `mailauth` para autenticação de e-mail
* Ferramentas amigáveis ao desenvolvedor, como `preview-email`, para depuração mais fácil
* Componentes modulares, como os diversos utilitários `p-*` da Sindre Sorhus

Ao seguir esses princípios consistentemente ao longo do tempo, criamos um serviço no qual os desenvolvedores podem confiar sua infraestrutura de e-mail: seguro, confiável e alinhado aos valores da comunidade de código aberto.

### Privacidade por Design {#privacy-by-design}

A privacidade não é uma reflexão tardia ou um recurso de marketing do Forward Email; é um princípio fundamental de design que informa todos os aspectos do nosso serviço e código:

* **Criptografia de Acesso Zero**: Implementamos sistemas que tornam tecnicamente impossível a leitura dos e-mails dos usuários.
* **Coleta Mínima de Dados**: Coletamos apenas os dados necessários para fornecer nosso serviço, nada mais.
* **Políticas Transparentes**: Nossa política de privacidade é escrita em linguagem clara e compreensível, sem jargões jurídicos.
* **Verificação de Código Aberto**: Nossa base de código aberto permite que pesquisadores de segurança verifiquem nossas declarações de privacidade.

Esse compromisso se estende aos nossos pacotes de código aberto, que são projetados com as melhores práticas de segurança e privacidade incorporadas desde o início.

### Código aberto sustentável {#sustainable-open-source}

Acreditamos que o software de código aberto precisa de modelos sustentáveis para prosperar a longo prazo. Nossa abordagem inclui:

* **Suporte Comercial**: Oferecendo suporte e serviços premium em torno de nossas ferramentas de código aberto.
* **Licenciamento Equilibrado**: Usando licenças que protegem tanto a liberdade do usuário quanto a sustentabilidade do projeto.
* **Engajamento da Comunidade**: Interagindo ativamente com os colaboradores para construir uma comunidade de apoio.
* **Roteiros Transparentes**: Compartilhando nossos planos de desenvolvimento para permitir que os usuários planejem adequadamente.

Ao focar na sustentabilidade, garantimos que nossas contribuições de código aberto possam continuar a crescer e melhorar ao longo do tempo, em vez de caírem no esquecimento.

## Os números não mentem: Nossas impressionantes estatísticas de download do npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Quando falamos sobre o impacto do software de código aberto, as estatísticas de download fornecem uma medida tangível da adoção e da confiança. Muitos dos pacotes que ajudamos a manter atingiram uma escala que poucos projetos de código aberto alcançam, com downloads combinados na casa dos bilhões.

![Principais pacotes npm por downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Embora tenhamos orgulho de ajudar a manter diversos pacotes bastante baixados no ecossistema JavaScript, gostaríamos de reconhecer que muitos desses pacotes foram originalmente criados por outros desenvolvedores talentosos. Pacotes como superagent e supertest foram originalmente criados por TJ Holowaychuk, cujas contribuições prolíficas ao código aberto foram fundamentais para moldar o ecossistema Node.js.

### Uma visão panorâmica do nosso impacto {#a-birds-eye-view-of-our-impact}

Somente no período de dois meses, de fevereiro a março de 2025, os principais pacotes para os quais contribuímos e ajudamos a manter números impressionantes de downloads:

* **[superagente](https://www.npmjs.com/package/superagent)**: 84.575.829 downloads\[^7] (criado originalmente por TJ Holowaychuk)
* **[super teste](https://www.npmjs.com/package/supertest)**: 76.432.591 downloads\[^8] (criado originalmente por TJ Holowaychuk)
* **[também](https://www.npmjs.com/package/koa)**: 28.539.295 downloads\[^34] (criado originalmente por TJ Holowaychuk)
* **[@koa/roteador](https://www.npmjs.com/package/@koa/router)**: 11.007.327 downloads\[^35]
* **[roteador koa](https://www.npmjs.com/package/koa-router)**: 3.498.918 downloads\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 downloads\[^37]
* **[e-mail de pré-visualização](https://www.npmjs.com/package/preview-email)**: 2.500.000 downloads\[^9]
* **[cabine](https://www.npmjs.com/package/cabin)**: 1.800.000 downloads\[^10]
* **[@breejs/mais tarde](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 downloads\[^38]
* **[modelos de e-mail](https://www.npmjs.com/package/email-templates)**: 1.128.139 downloads\[^39]
* **__PROTECTED_LINK_259__0**: 1.124.686 downloads\[^40]
* **__PROTECTED_LINK_259__1**: 1.200.000 downloads\[^11]
* **__PROTECTED_LINK_259__2**: 894.666 downloads\[^41]
* **__PROTECTED_LINK_259__3**: 839.585 downloads\[^42]
* **__PROTECTED_LINK_259__4**: 145.000 downloads\[^12]
* **__PROTECTED_LINK_259__5**: 24.270 downloads\[^30]

> \[!NOTE]
> Vários outros pacotes que ajudamos a manter, mas não criamos, têm contagens de downloads ainda maiores, incluindo `form-data` (mais de 738 milhões de downloads), `toidentifier` (mais de 309 milhões de downloads), `stackframe` (mais de 116 milhões de downloads) e `error-stack-parser` (mais de 113 milhões de downloads). Temos a honra de contribuir para esses pacotes, respeitando o trabalho de seus autores originais.

Esses números não são apenas impressionantes — eles representam desenvolvedores reais resolvendo problemas reais com códigos que ajudamos a manter. Cada download é um exemplo de como esses pacotes ajudaram alguém a construir algo significativo, desde projetos amadores até aplicativos corporativos usados por milhões.

![Distribuição de categorias de pacotes](/img/art/category_pie_chart.svg)

### Impacto diário em escala {#daily-impact-at-scale}

Os padrões diários de download revelam um uso consistente e de alto volume, com picos que chegam a milhões de downloads por dia\[^13]. Essa consistência demonstra a estabilidade e a confiabilidade desses pacotes — os desenvolvedores não apenas os testam; eles os integram aos seus principais fluxos de trabalho e dependem deles dia após dia.

Os padrões semanais de download mostram números ainda mais impressionantes, oscilando consistentemente em torno de dezenas de milhões de downloads por semana\[^14]. Isso representa uma pegada enorme no ecossistema JavaScript, com esses pacotes sendo executados em ambientes de produção em todo o mundo.

### Além dos números brutos {#beyond-the-raw-numbers}

Embora as estatísticas de download sejam impressionantes por si só, elas revelam uma história mais profunda sobre a confiança que a comunidade deposita nesses pacotes. Manter pacotes nessa escala exige um compromisso inabalável com:

* **Compatibilidade com versões anteriores**: Alterações devem ser cuidadosamente consideradas para evitar a interrupção de implementações existentes.
* **Segurança**: Com milhões de aplicativos dependendo desses pacotes, vulnerabilidades de segurança podem ter consequências de longo alcance.
* **Desempenho**: Nessa escala, mesmo pequenas melhorias de desempenho podem gerar benefícios agregados significativos.
* **Documentação**: Uma documentação clara e abrangente é essencial para pacotes usados por desenvolvedores de todos os níveis de experiência.

O crescimento consistente nos números de downloads ao longo do tempo reflete o sucesso no cumprimento desses compromissos, construindo confiança com a comunidade de desenvolvedores por meio de pacotes confiáveis e bem mantidos.

## Apoiando o ecossistema: Nossos patrocínios de código aberto {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> A sustentabilidade do código aberto não se trata apenas de contribuir com código — também se trata de dar suporte aos desenvolvedores que mantêm a infraestrutura crítica.

Além de nossas contribuições diretas ao ecossistema JavaScript, temos orgulho de patrocinar importantes colaboradores do Node.js, cujo trabalho constitui a base de muitas aplicações modernas. Nossos patrocínios incluem:

### Andris Reinman: Pioneiro em infraestrutura de e-mail {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) é o criador de [Nodemailer](https://github.com/nodemailer/nodemailer), a biblioteca de envio de e-mail mais popular para Node.js, com mais de 14 milhões de downloads semanais\[^15]. Seu trabalho se estende a outros componentes críticos da infraestrutura de e-mail, como [Servidor SMTP](https://github.com/nodemailer/smtp-server), [Analisador de e-mail](https://github.com/nodemailer/mailparser) e [Pato Selvagem](https://github.com/nodemailer/wildduck).

Nosso patrocínio ajuda a garantir a manutenção e o desenvolvimento contínuos dessas ferramentas essenciais que impulsionam a comunicação por e-mail para inúmeros aplicativos Node.js, incluindo nosso próprio serviço de encaminhamento de e-mail.

### Sindre Sorhus: idealizador do pacote de utilitários {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) é um dos contribuidores de código aberto mais prolíficos do ecossistema JavaScript, com mais de 1.000 pacotes npm em seu nome. Seus utilitários, como [p-mapa](https://github.com/sindresorhus/p-map), [p-repetição](https://github.com/sindresorhus/p-retry) e [é-fluxo](https://github.com/sindresorhus/is-stream), são blocos de construção fundamentais usados em todo o ecossistema Node.js.

Ao patrocinar o trabalho de Sindre, ajudamos a sustentar o desenvolvimento desses utilitários essenciais que tornam o desenvolvimento de JavaScript mais eficiente e confiável.

Esses patrocínios refletem nosso compromisso com o ecossistema de código aberto em geral. Reconhecemos que nosso próprio sucesso se baseia na base estabelecida por esses e outros colaboradores, e nos dedicamos a garantir a sustentabilidade de todo o ecossistema.

## Descobrindo vulnerabilidades de segurança no ecossistema JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Nosso compromisso com o código aberto vai além do desenvolvimento de recursos, incluindo a identificação e o tratamento de vulnerabilidades de segurança que podem impactar milhões de desenvolvedores. Várias de nossas contribuições mais significativas para o ecossistema JavaScript foram na área de segurança.

### O resgate do Koa-Router {#the-koa-router-rescue}

Em fevereiro de 2019, Nick identificou um problema crítico com a manutenção do popular pacote koa-router. Como ele [relatado no Hacker News](https://news.ycombinator.com/item?id=19156707), o pacote havia sido abandonado pelo seu mantenedor original, deixando vulnerabilidades de segurança sem solução e a comunidade sem atualizações.

> \[!WARNING]
> Pacotes abandonados com vulnerabilidades de segurança representam riscos significativos para todo o ecossistema, especialmente quando são baixados milhões de vezes por semana.

Em resposta, Nick criou o [@koa/roteador](https://github.com/koajs/router) e ajudou a alertar a comunidade sobre a situação. Ele vem mantendo esse pacote essencial desde então, garantindo que os usuários do Koa tenham uma solução de roteamento segura e bem mantida.

### Abordando vulnerabilidades ReDoS {#addressing-redos-vulnerabilities}

Em 2020, Nick identificou e corrigiu uma vulnerabilidade crítica [Negação de Serviço de Expressão Regular (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) no pacote `url-regex`, amplamente utilizado. Essa vulnerabilidade ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) poderia permitir que invasores causassem negação de serviço ao fornecer uma entrada especialmente criada que causava um retrocesso catastrófico na expressão regular.

Em vez de simplesmente corrigir o pacote existente, Nick criou o [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), uma implementação completamente reescrita que corrige a vulnerabilidade, mantendo a compatibilidade com a API original. Ele também publicou um [postagem de blog abrangente](/blog/docs/url-regex-javascript-node-js) explicando a vulnerabilidade e como mitigá-la.

Este trabalho mostra nossa abordagem à segurança: não apenas corrigir problemas, mas educar a comunidade e fornecer alternativas robustas que evitem problemas semelhantes no futuro.

### Defendendo a segurança do Node.js e do Chromium {#advocating-for-nodejs-and-chromium-security}

Nick também tem atuado ativamente na defesa de melhorias de segurança em todo o ecossistema. Em agosto de 2020, ele identificou um problema de segurança significativo no Node.js relacionado ao processamento de cabeçalhos HTTP, relatado em [O Registro](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Esse problema, que surgiu de um patch no Chromium, poderia permitir que invasores contornassem as medidas de segurança. A defesa de Nick ajudou a garantir que o problema fosse resolvido prontamente, protegendo milhões de aplicativos Node.js de possíveis explorações.

### Protegendo a infraestrutura npm {#securing-npm-infrastructure}

Mais tarde, naquele mesmo mês, Nick identificou outro problema crítico de segurança, desta vez na infraestrutura de e-mail do npm. Conforme relatado em [O Registro](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), o npm não estava implementando corretamente os protocolos de autenticação de e-mail DMARC, SPF e DKIM, o que poderia permitir que invasores enviassem e-mails de phishing que pareciam vir do npm.

O relatório de Nick levou a melhorias na postura de segurança de e-mail do npm, protegendo os milhões de desenvolvedores que dependem do npm para gerenciamento de pacotes contra possíveis ataques de phishing.

## Nossas contribuições para o ecossistema de e-mail encaminhado {#our-contributions-to-the-forward-email-ecosystem-1}

O Forward Email foi desenvolvido com base em diversos projetos críticos de código aberto, incluindo Nodemailer, WildDuck e mailauth. Nossa equipe contribuiu significativamente para esses projetos, ajudando a identificar e corrigir problemas profundos que afetam a entrega e a segurança dos e-mails.

### Aprimorando a funcionalidade principal do Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) é a espinha dorsal do envio de e-mails no Node.js, e nossas contribuições ajudaram a torná-lo mais robusto:

* **Melhorias no Servidor SMTP**: Corrigimos bugs de análise, problemas de gerenciamento de fluxo e problemas de configuração de TLS no componente do servidor SMTP\[^16]\[^17].
* **Melhorias no Analisador de E-mail**: Corrigimos erros de decodificação de sequência de caracteres e problemas no analisador que poderiam causar falhas no processamento de e-mail\[^18]\[^19].

Essas contribuições garantem que o Nodemailer continue sendo uma base confiável para processamento de e-mail em aplicativos Node.js, incluindo o Forward Email.

### Aprimorando a autenticação de e-mail com o Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) fornece funcionalidade crítica de autenticação de e-mail, e nossas contribuições melhoraram significativamente suas capacidades:

* **Melhorias na Verificação de DKIM**: Descobrimos e relatamos que o X/Twitter tinha problemas de cache DNS que causavam falhas de DKIM em suas mensagens de saída, relatando isso ao Hacker One\[^20].
* **Melhorias no DMARC e ARC**: Corrigimos problemas com a verificação de DMARC e ARC que poderiam levar a resultados de autenticação incorretos\[^21]\[^22].
* **Otimizações de Desempenho**: Contribuímos com otimizações que melhoram o desempenho dos processos de autenticação de e-mail\[^23]\[^24]\[^25]\[^26].

Essas melhorias ajudam a garantir que a autenticação de e-mail seja precisa e confiável, protegendo os usuários contra ataques de phishing e spoofing.

### Principais melhorias no tempo de atividade {#key-upptime-enhancements}

Nossas contribuições para o Upptime incluem:

* **Monitoramento de Certificado SSL**: Adicionamos a funcionalidade de monitoramento da expiração do certificado SSL, evitando tempo de inatividade inesperado devido a certificados expirados\[^27].
* **Suporte a vários números de SMS**: Implementamos o suporte para alertar vários membros da equipe por SMS quando ocorrem incidentes, melhorando os tempos de resposta\[^28].
* **Correções de Verificação IPv6**: Corrigimos problemas com verificações de conectividade IPv6, garantindo um monitoramento mais preciso em ambientes de rede modernos\[^29].
* **Suporte aos Modos Claro/Escuro**: Adicionamos suporte a temas para melhorar a experiência do usuário nas páginas de status\[^31].
* **Melhor Suporte a Ping TCP**: Aprimoramos a funcionalidade de ping TCP para fornecer testes de conexão mais confiáveis\[^32].

Essas melhorias não beneficiam apenas o monitoramento de status do Forward Email, mas estão disponíveis para toda a comunidade de usuários do Upptime, demonstrando nosso comprometimento em melhorar as ferramentas das quais dependemos.

## A cola que mantém tudo unido: código personalizado em escala {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Embora nossos pacotes npm e contribuições para projetos existentes sejam significativos, é o código personalizado que integra esses componentes que realmente demonstra nossa expertise técnica. A base de código do Forward Email representa uma década de trabalho de desenvolvimento, que remonta a 2017, quando o projeto começou como [encaminhamento de e-mail gratuito](https://github.com/forwardemail/free-email-forwarding) antes de ser incorporado a um monorepo.

### Um esforço de desenvolvimento massivo {#a-massive-development-effort}

A escala deste código de integração personalizado é impressionante:

* **Contribuições Totais**: Mais de 3.217 commits
* **Tamanho da Base de Código**: Mais de 421.545 linhas de código em arquivos JavaScript, Pug, CSS e JSON\[^33]

Isso representa milhares de horas de trabalho de desenvolvimento, sessões de depuração e otimizações de desempenho. É o "ingrediente secreto" que transforma pacotes individuais em um serviço coeso e confiável, usado por milhares de clientes diariamente.

### Integração de dependências principais {#core-dependencies-integration}

A base de código do Forward Email integra inúmeras dependências em um todo perfeito:

* **Processamento de E-mail**: Integra o Nodemailer para envio, o Servidor SMTP para recebimento e o Mailparser para análise
* **Autenticação**: Utiliza o Mailauth para verificação de DKIM, SPF, DMARC e ARC
* **Resolução de DNS**: Utiliza o Tangerine para DNS sobre HTTPS com cache global
* **Conexão MX**: Utiliza o mx-connect com integração ao Tangerine para conexões confiáveis com servidores de e-mail
* **Agendamento de Tarefas**: Utiliza o Bree para processamento confiável de tarefas em segundo plano com threads de trabalho
* **Templação**: Utiliza modelos de e-mail para reutilizar folhas de estilo do site nas comunicações com os clientes
* **Armazenamento de E-mail**: Implementa caixas de correio SQLite criptografadas individualmente usando better-sqlite3-multiple-ciphers com criptografia ChaCha20-Poly1305 para privacidade quântica segura, garantindo isolamento completo entre usuários e que apenas o usuário tenha acesso à sua caixa de correio

Cada uma dessas integrações exige uma análise cuidadosa de casos extremos, implicações de desempenho e preocupações com segurança. O resultado é um sistema robusto que processa milhões de transações de e-mail de forma confiável. Nossa implementação em SQLite também utiliza o msgpackr para serialização binária eficiente e WebSockets (via ws) para atualizações de status em tempo real em toda a nossa infraestrutura.

### Infraestrutura DNS com Tangerine e mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Um componente crítico da infraestrutura do Forward Email é nosso sistema de resolução de DNS, construído em torno de dois pacotes principais:

* **[tangerina](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Nossa implementação Node.js DNS-over-HTTPS fornece um substituto imediato para o resolvedor DNS padrão, com tentativas integradas, tempos limite, rotação inteligente de servidor e suporte a cache.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Este pacote estabelece conexões TCP com servidores MX, pegando um domínio de destino ou endereço de e-mail, resolvendo servidores MX apropriados e conectando-se a eles em ordem de prioridade.

Integramos o Tangerine com o mx-connect por meio do [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), garantindo DNS da camada de aplicação sobre solicitações HTTP em todo o Forward Email. Isso fornece cache global para DNS em escala com consistência 1:1 em qualquer região, aplicativo ou processo — essencial para a entrega confiável de e-mails em um sistema distribuído.

## Impacto Corporativo: Do Código Aberto às Soluções de Missão Crítica {#enterprise-impact-from-open-source-to-mission-critical-solutions}

O ápice de nossa jornada de uma década no desenvolvimento de código aberto permitiu que o Forward Email atendesse não apenas a desenvolvedores individuais, mas também a grandes empresas e instituições educacionais que formam a espinha dorsal do próprio movimento de código aberto.

### Estudos de Caso em Infraestrutura de E-mail de Missão Crítica {#case-studies-in-mission-critical-email-infrastructure}

Nosso compromisso com a confiabilidade, privacidade e princípios de código aberto tornou o Forward Email a escolha confiável para organizações com requisitos de e-mail exigentes:

* **Instituições de Ensino**: Conforme detalhado em nosso [estudo de caso de encaminhamento de e-mail de ex-alunos]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study). Grandes universidades contam com nossa infraestrutura para manter conexões duradouras com centenas de milhares de ex-alunos por meio de serviços confiáveis de encaminhamento de e-mail.

* **Soluções Linux Corporativas**: O [Estudo de caso empresarial do Canonical Ubuntu Email](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) demonstra como nossa abordagem de código aberto se alinha perfeitamente com as necessidades dos provedores de Linux corporativo, oferecendo a eles a transparência e o controle que eles exigem.

* **Open Source Foundations**: Talvez o mais gratificante seja nossa parceria com a Linux Foundation, conforme documentado no [Estudo de caso de e-mail empresarial da Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), onde nosso serviço potencializa a comunicação para a própria organização que administra o desenvolvimento do Linux.

Há uma bela simetria na forma como nossos pacotes de código aberto, mantidos com cuidado ao longo de muitos anos, nos permitiram construir um serviço de e-mail que agora oferece suporte às próprias comunidades e organizações que defendem o software de código aberto. Essa jornada completa — da contribuição de pacotes individuais ao desenvolvimento de infraestrutura de e-mail de nível empresarial para líderes em código aberto — representa a validação definitiva da nossa abordagem ao desenvolvimento de software.

## Uma década de código aberto: olhando para o futuro {#a-decade-of-open-source-looking-forward}

Ao olharmos para trás, para uma década de contribuições de código aberto e para os próximos dez anos, ficamos cheios de gratidão pela comunidade que apoiou nosso trabalho e entusiasmados com o que está por vir.

Nossa jornada de contribuidores individuais de pacotes a mantenedores de uma infraestrutura de e-mail abrangente usada por grandes empresas e fundações de código aberto tem sido notável. É uma prova do poder do desenvolvimento de código aberto e do impacto que um software bem pensado e bem mantido pode ter no ecossistema mais amplo.

Nos próximos anos, estamos comprometidos a:

* **Continuando a manter e aprimorar nossos pacotes existentes**, garantindo que continuem sendo ferramentas confiáveis para desenvolvedores em todo o mundo.
* **Expandindo nossas contribuições para projetos de infraestrutura crítica**, especialmente nas áreas de e-mail e segurança.
* **Aprimorando os recursos do Forward Email**, mantendo nosso compromisso com privacidade, segurança e transparência.
* **Apoiando a próxima geração de colaboradores de código aberto** por meio de mentoria, patrocínio e engajamento da comunidade.

Acreditamos que o futuro do desenvolvimento de software é aberto, colaborativo e construído sobre uma base de confiança. Ao continuar a contribuir com pacotes de alta qualidade e focados em segurança para o ecossistema JavaScript, esperamos desempenhar um pequeno papel na construção desse futuro.

Agradecemos a todos que utilizaram nossos pacotes, contribuíram para nossos projetos, relataram problemas ou simplesmente divulgaram nosso trabalho. Seu apoio tornou esta década de impacto possível, e estamos animados para ver o que podemos realizar juntos nos próximos dez anos.

\[^1]: estatísticas de download do npm para cabin, abril de 2025
\[^2]: estatísticas de download do npm para bson-objectid, fevereiro-março de 2025
\[^3]: estatísticas de download do npm para url-regex-safe, abril de 2025
\[^4]: contagem de estrelas do GitHub para forwardemail/forwardemail.net em abril de 2025
\[^5]: estatísticas de download do npm para preview-email, abril de 2025
\[^7]: estatísticas de download do npm para superagent, fevereiro-março de 2025
\[^8]: estatísticas de download do npm para supertest, fevereiro-março de 2025
\[^9]: estatísticas de download do npm para preview-email, fevereiro-março de 2025
\[^10]: estatísticas de download do npm para cabin, fevereiro-março de 2025
\[^11]: estatísticas de download do npm para url-regex-safe, fevereiro-março de 2025
\[^12]: estatísticas de download do NPM para o SpamScanner, fevereiro-março de 2025
\[^13]: padrões de download diários das estatísticas do NPM, abril de 2025
\[^14]: padrões de download semanais das estatísticas do NPM, abril de 2025
\[^15]: estatísticas de download do NPM para o NodeMailer, abril de 2025
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
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Com base em problemas do GitHub no repositório Upptime
\[^28]: Com base em problemas do GitHub no repositório Upptime
\[^29]: Com base em problemas do GitHub no repositório Upptime
\[^30]: estatísticas de download do npm para bree, fevereiro-março de 2025
\[^31]: Com base em solicitações de pull do GitHub para o Upptime
\[^32]: Com base em solicitações de pull do GitHub para o Upptime
\[^34]: estatísticas de download do npm para koa, fevereiro-março de 2025
\[^35]: estatísticas de download do npm para @koa/router, fevereiro-março de 2025
\[^36]: estatísticas de download do npm para koa-router, fevereiro-março de 2025
\[^37]: estatísticas de download do npm para url-regex, fevereiro-março de 2025
\[^38]: estatísticas de download do npm para @breejs/later, fevereiro-março de 2025
\[^39]: estatísticas de download do npm para email-templates, fevereiro-março de 2025
\[^40]: estatísticas de download do npm para get-paths, fevereiro-março de 2025
\[^41]: estatísticas de download do npm para dotenv-parse-variables, fevereiro-março de 2025
\[^42]: estatísticas de download do npm para @koa/multer, fevereiro-março de 2025