# Como otimizar a infraestrutura de produção do Node.js: práticas recomendadas {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [Nossa Revolução de Otimização de Desempenho de Núcleo Único de 573%](#our-573-single-core-performance-optimization-revolution)
  * [Por que a otimização de desempenho de núcleo único é importante para o Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Conteúdo Relacionado](#related-content)
* [Configuração do ambiente de produção Node.js: nossa pilha de tecnologia](#nodejs-production-environment-setup-our-technology-stack)
  * [Gerenciador de Pacotes: pnpm para Eficiência de Produção](#package-manager-pnpm-for-production-efficiency)
  * [Framework Web: Koa para Produção Moderna de Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Processamento de trabalho em segundo plano: Bree para confiabilidade de produção](#background-job-processing-bree-for-production-reliability)
  * [Tratamento de erros: @hapi/boom para confiabilidade da produção](#error-handling-hapiboom-for-production-reliability)
* [Como monitorar aplicativos Node.js em produção](#how-to-monitor-nodejs-applications-in-production)
  * [Monitoramento de produção Node.js em nível de sistema](#system-level-nodejs-production-monitoring)
  * [Monitoramento em nível de aplicativo para produção Node.js](#application-level-monitoring-for-nodejs-production)
  * [Monitoramento específico da aplicação](#application-specific-monitoring)
* [Monitoramento de produção do Node.js com verificações de integridade do PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Nosso sistema de verificação de saúde PM2](#our-pm2-health-check-system)
  * [Nossa configuração de produção PM2](#our-pm2-production-configuration)
  * [Implantação automatizada do PM2](#automated-pm2-deployment)
* [Sistema de classificação e tratamento de erros de produção](#production-error-handling-and-classification-system)
  * [Nossa implementação isCodeBug para produção](#our-iscodebug-implementation-for-production)
  * [Integração com nosso registro de produção](#integration-with-our-production-logging)
  * [Conteúdo Relacionado](#related-content-1)
* [Depuração de desempenho avançada com v8-profiler-next e cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Nossa abordagem de criação de perfil para produção em Node.js](#our-profiling-approach-for-nodejs-production)
  * [Como implementamos a análise de instantâneos de heap](#how-we-implement-heap-snapshot-analysis)
  * [Fluxo de trabalho de depuração de desempenho](#performance-debugging-workflow)
  * [Implementação recomendada para seu aplicativo Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Integração com nosso monitoramento de produção](#integration-with-our-production-monitoring)
* [Segurança da infraestrutura de produção do Node.js](#nodejs-production-infrastructure-security)
  * [Segurança em nível de sistema para produção Node.js](#system-level-security-for-nodejs-production)
  * [Segurança de aplicativos para aplicativos Node.js](#application-security-for-nodejs-applications)
  * [Automação de Segurança de Infraestrutura](#infrastructure-security-automation)
  * [Nosso conteúdo de segurança](#our-security-content)
* [Arquitetura de banco de dados para aplicativos Node.js](#database-architecture-for-nodejs-applications)
  * [Implementação do SQLite para produção em Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implementação do MongoDB para produção em Node.js](#mongodb-implementation-for-nodejs-production)
* [Processamento de trabalho em segundo plano de produção do Node.js](#nodejs-production-background-job-processing)
  * [Nossa configuração de servidor Bree para produção](#our-bree-server-setup-for-production)
  * [Exemplos de empregos de produção](#production-job-examples)
  * [Nossos padrões de agendamento de tarefas para produção em Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Manutenção automatizada para aplicações Node.js de produção](#automated-maintenance-for-production-nodejs-applications)
  * [Nossa implementação de limpeza](#our-cleanup-implementation)
  * [Gerenciamento de espaço em disco para produção Node.js](#disk-space-management-for-nodejs-production)
  * [Automação de Manutenção de Infraestrutura](#infrastructure-maintenance-automation)
* [Guia de implementação de implantação de produção do Node.js](#nodejs-production-deployment-implementation-guide)
  * [Estude nosso código atual para melhores práticas de produção](#study-our-actual-code-for-production-best-practices)
  * [Aprenda com nossas postagens de blog](#learn-from-our-blog-posts)
  * [Automação de infraestrutura para produção Node.js](#infrastructure-automation-for-nodejs-production)
  * [Nossos estudos de caso](#our-case-studies)
* [Conclusão: Melhores práticas de implantação de produção do Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Lista completa de recursos para produção do Node.js](#complete-resource-list-for-nodejs-production)
  * [Nossos principais arquivos de implementação](#our-core-implementation-files)
  * [Nossas implementações de servidores](#our-server-implementations)
  * [Nossa Automação de Infraestrutura](#our-infrastructure-automation)
  * [Nossas postagens de blog técnico](#our-technical-blog-posts)
  * [Nossos estudos de caso empresariais](#our-enterprise-case-studies)

## Prefácio {#foreword}

Na Forward Email, passamos anos aperfeiçoando a configuração do nosso ambiente de produção Node.js. Este guia abrangente compartilha nossas práticas recomendadas de implantação de produção Node.js, testadas em campo, com foco na otimização de desempenho, monitoramento e nas lições que aprendemos escalando aplicativos Node.js para lidar com milhões de transações diárias.

## Nossa Revolução de Otimização de Desempenho de Núcleo Único de 573% {#our-573-single-core-performance-optimization-revolution}

Ao migrarmos dos processadores Intel para os AMD Ryzen, alcançamos uma **melhoria de 573% no desempenho** em nossos aplicativos Node.js. Não se trata apenas de uma pequena otimização — mudou fundamentalmente o desempenho de nossos aplicativos Node.js em produção e demonstra a importância da otimização do desempenho de um único núcleo para qualquer aplicativo Node.js.

> \[!TIP]
> Para as melhores práticas de implantação de produção do Node.js, a escolha do hardware é crucial. Escolhemos especificamente a hospedagem DataPacket para a disponibilidade do AMD Ryzen porque o desempenho de núcleo único é crucial para aplicativos Node.js, já que a execução do JavaScript é de thread única.

### Por que a otimização de desempenho de núcleo único é importante para o Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Nossa migração do Intel para o AMD Ryzen resultou em:

* **Melhoria de 573% no desempenho** no processamento de solicitações (documentado em [Problema do GitHub #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671 da nossa página de status))
* **Eliminação de atrasos de processamento** para respostas quase instantâneas (mencionadas em [Problema do GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Melhor relação custo-benefício** para ambientes de produção Node.js
* **Tempos de resposta aprimorados** em todos os nossos endpoints de aplicativos

O aumento de desempenho foi tão significativo que agora consideramos os processadores AMD Ryzen essenciais para qualquer implantação séria de produção Node.js, seja executando aplicativos web, APIs, microsserviços ou qualquer outra carga de trabalho Node.js.

### Conteúdo Relacionado {#related-content}

Para mais detalhes sobre nossas opções de infraestrutura, confira:

* [Melhor Serviço de Encaminhamento de E-mail]](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Comparações de desempenho
* [Solução auto-hospedada](https://forwardemail.net/blog/docs/self-hosted-solution) - Recomendações de hardware

Configuração do ambiente de produção Node.js ##: Nossa pilha de tecnologia {#nodejs-production-environment-setup-our-technology-stack}

Nossas melhores práticas de implantação de produção do Node.js incluem escolhas tecnológicas bem pensadas, baseadas em anos de experiência em produção. Veja o que usamos e por que essas escolhas se aplicam a qualquer aplicação Node.js:

Gerenciador de pacotes ###: pnpm para eficiência de produção {#package-manager-pnpm-for-production-efficiency}

**O que usamos:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (versão fixada)

Escolhemos pnpm em vez de npm e yarn para nossa configuração de ambiente de produção Node.js porque:

* **Tempos de instalação mais rápidos** em pipelines de CI/CD
* **Eficiência de espaço em disco** por meio de hard linking
* **Resolução rigorosa de dependências** que evita dependências fantasmas
* **Melhor desempenho** em implantações de produção

> \[!NOTE]
> Como parte das nossas práticas recomendadas de implantação de produção do Node.js, fixamos versões exatas de ferramentas críticas, como o pnpm, para garantir um comportamento consistente em todos os ambientes e máquinas dos membros da equipe.

**Detalhes da implementação:**

* [Nossa configuração package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Nossa postagem no blog sobre o ecossistema NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Estrutura da Web: Koa para produção moderna de Node.js {#web-framework-koa-for-modern-nodejs-production}

**O que usamos:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Escolhemos o Koa em vez do Express para nossa infraestrutura de produção Node.js devido ao seu suporte moderno a async/await e à composição de middleware mais limpa. Nosso fundador, Nick Baugh, contribuiu tanto para o Express quanto para o Koa, nos dando uma visão aprofundada de ambos os frameworks para uso em produção.

Esses padrões se aplicam quer você esteja criando APIs REST, servidores GraphQL, aplicativos web ou microsserviços.

**Nossos exemplos de implementação:**

* [Configuração do servidor web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Configuração do servidor API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Guia de implementação de formulários de contato](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Processamento de trabalho em segundo plano: Bree para confiabilidade de produção {#background-job-processing-bree-for-production-reliability}

**O que usamos:** Agendador [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Criamos e mantemos o Bree porque os agendadores de tarefas existentes não atendiam às nossas necessidades de suporte a threads de trabalho e recursos JavaScript modernos em ambientes de produção Node.js. Isso se aplica a qualquer aplicativo Node.js que precise de processamento em segundo plano, tarefas agendadas ou threads de trabalho.

**Nossos exemplos de implementação:**

* [Configuração do servidor Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Todas as nossas definições de trabalho](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Trabalho de verificação de saúde do PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementação do trabalho de limpeza](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Tratamento de erros ###: @hapi/boom para confiabilidade de produção {#error-handling-hapiboom-for-production-reliability}

**O que usamos:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Usamos @hapi/boom para respostas de erro estruturadas em todos os nossos aplicativos de produção Node.js. Esse padrão funciona para qualquer aplicativo Node.js que precise de tratamento de erros consistente.

**Nossos exemplos de implementação:**

* [Auxiliar de classificação de erros](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implementação do Logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Como monitorar aplicativos Node.js em produção {#how-to-monitor-nodejs-applications-in-production}

Nossa abordagem para monitorar aplicações Node.js em produção evoluiu ao longo de anos de execução de aplicações em escala. Implementamos o monitoramento em múltiplas camadas para garantir confiabilidade e desempenho para qualquer tipo de aplicação Node.js.

### Monitoramento de produção Node.js em nível de sistema {#system-level-nodejs-production-monitoring}

**Nossa implementação principal:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**O que usamos:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nossos limites de monitoramento de produção (do nosso código de produção atual):

* **Limite de tamanho de heap de 2 GB** com alertas automáticos
* **Limite de alerta de uso de memória de 25%**
* **Limite de alerta de uso de CPU de 80%**
* **Limite de alerta de uso de disco de 75%**

> \[!WARNING]
> Esses limites funcionam para nossa configuração específica de hardware. Ao implementar o monitoramento de produção do Node.js, revise nossa implementação monitor-server.js para entender a lógica exata e adaptar os valores à sua configuração.

### Monitoramento em nível de aplicativo para produção Node.js {#application-level-monitoring-for-nodejs-production}

**Nossa classificação de erro:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Este auxiliar distingue entre:

* **Bugs de código reais** que exigem atenção imediata
* **Erros do usuário** que são comportamentos esperados
* **Falhas de serviço externo** que não podemos controlar

Esse padrão se aplica a qualquer aplicativo Node.js: aplicativos web, APIs, microsserviços ou serviços em segundo plano.

**Nossa implementação de registro:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Implementamos redação de campo abrangente para proteger informações confidenciais, mantendo recursos de depuração úteis em nosso ambiente de produção Node.js.

### Monitoramento específico do aplicativo {#application-specific-monitoring}

**Nossas implementações de servidor:**

* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Servidor IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Servidor POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Monitoramento de filas:** Implementamos limites de fila de 5 GB e tempos limite de 180 segundos para o processamento de solicitações a fim de evitar o esgotamento de recursos. Esses padrões se aplicam a qualquer aplicativo Node.js com filas ou processamento em segundo plano.

## Monitoramento de produção Node.js com verificações de integridade do PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Refinamos a configuração do nosso ambiente de produção Node.js com PM2 ao longo de anos de experiência em produção. Nossas verificações de integridade do PM2 são essenciais para manter a confiabilidade em qualquer aplicativo Node.js.

### Nosso Sistema de Verificação de Saúde PM2 {#our-pm2-health-check-system}

**Nossa implementação principal:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Nosso monitoramento de produção do Node.js com verificações de integridade do PM2 inclui:

* **Executa a cada 20 minutos** via agendamento cron
* **Requer no mínimo 15 minutos de atividade** antes de considerar um processo saudável
* **Valida o status do processo e o uso de memória**
* **Reinicia automaticamente processos com falha**
* **Evita loops de reinicialização** por meio de verificação inteligente de integridade

> \[!CAUTION]
> Para as práticas recomendadas de implantação de produção do Node.js, exigimos um tempo de atividade de mais de 15 minutos antes de considerar um processo saudável para evitar loops de reinicialização. Isso evita falhas em cascata quando os processos estão com problemas de memória ou outros problemas.

### Nossa configuração de produção PM2 {#our-pm2-production-configuration}

**Nossa configuração de ecossistema:** Estude nossos arquivos de inicialização do servidor para configuração do ambiente de produção do Node.js:

* [Servidor web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Servidor de API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Agendador Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Esses padrões se aplicam quer você esteja executando aplicativos Express, servidores Koa, APIs GraphQL ou qualquer outro aplicativo Node.js.

### Implantação automatizada de PM2 {#automated-pm2-deployment}

**Implantação do PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Automatizamos toda a nossa configuração do PM2 por meio do Ansible para garantir implantações de produção consistentes do Node.js em todos os nossos servidores.

## Sistema de classificação e tratamento de erros de produção {#production-error-handling-and-classification-system}

Uma das nossas práticas recomendadas mais valiosas de implantação de produção do Node.js é a classificação inteligente de erros que se aplica a qualquer aplicativo Node.js:

### Nossa implementação isCodeBug para produção {#our-iscodebug-implementation-for-production}

**Fonte:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Este auxiliar fornece classificação de erros inteligente para aplicativos Node.js em produção para:

* **Priorizar bugs reais** em vez de erros do usuário
* **Aprimorar nossa resposta a incidentes** focando em problemas reais
* **Reduzir a fadiga de alertas** devido a erros esperados do usuário
* **Entender melhor** os problemas gerados pelo aplicativo em comparação aos gerados pelo usuário

Esse padrão funciona para qualquer aplicativo Node.js, esteja você criando sites de comércio eletrônico, plataformas SaaS, APIs ou microsserviços.

Integração ### com nosso registro de produção {#integration-with-our-production-logging}

**Nossa integração com o registrador:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Nosso registrador usa `isCodeBug` para determinar níveis de alerta e redação de campos, garantindo que sejamos notificados sobre problemas reais enquanto filtramos ruídos em nosso ambiente de produção Node.js.

### Conteúdo relacionado {#related-content-1}

Saiba mais sobre nossos padrões de tratamento de erros:

* [Construindo um Sistema de Pagamento Confiável](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Padrões de tratamento de erros
* [Proteção de privacidade de e-mail](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Tratamento de erros de segurança

## Depuração de desempenho avançada com v8-profiler-next e cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Utilizamos ferramentas avançadas de criação de perfil para analisar snapshots de heap e depurar problemas de OOM (falta de memória), gargalos de desempenho e problemas de memória do Node.js em nosso ambiente de produção. Essas ferramentas são essenciais para qualquer aplicativo Node.js que apresente vazamentos de memória ou problemas de desempenho.

### Nossa abordagem de criação de perfil para produção Node.js {#our-profiling-approach-for-nodejs-production}

**Ferramentas que recomendamos:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Para gerar snapshots de heap e perfis de CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Para analisar perfis de CPU e snapshots de heap

> \[!TIP]
> Usamos o v8-profiler-next e o cpupro juntos para criar um fluxo de trabalho completo de depuração de desempenho para nossos aplicativos Node.js. Essa combinação nos ajuda a identificar vazamentos de memória, gargalos de desempenho e otimizar nosso código de produção.

### Como implementamos a análise de instantâneos de heap {#how-we-implement-heap-snapshot-analysis}

**Nossa implementação de monitoramento:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Nosso monitoramento de produção inclui a geração automática de snapshots de heap quando os limites de memória são excedidos. Isso nos ajuda a depurar problemas de falta de memória (OOM) antes que causem travamentos nos aplicativos.

**Principais padrões de implementação:**

* **Snapshots automáticos** quando o tamanho do heap excede o limite de 2 GB
* **Criação de perfil baseada em sinal** para análise sob demanda em produção
* **Políticas de retenção** para gerenciar o armazenamento de snapshots
* **Integração com nossas tarefas de limpeza** para manutenção automatizada

### Fluxo de trabalho de depuração de desempenho {#performance-debugging-workflow}

**Estude nossa implementação atual:**

* [Implementação do servidor de monitoramento](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Monitoramento de heap e geração de snapshots
* [Trabalho de limpeza](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Retenção e limpeza de snapshots
* [Integração do Logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Registro de desempenho

### Implementação recomendada para seu aplicativo Node.js {#recommended-implementation-for-your-nodejs-application}

**Para análise de instantâneo de heap:**

1. **Instale o v8-profiler-next** para geração de snapshots
2. **Use o cpupro** para analisar os snapshots gerados
3. **Implemente limites de monitoramento** semelhantes ao nosso monitor-server.js
4. **Configure a limpeza automatizada** para gerenciar o armazenamento de snapshots
5. **Crie manipuladores de sinais** para criação de perfis sob demanda em produção

**Para criação de perfil de CPU:**

1. **Gerar perfis de CPU** durante períodos de alta carga
2. **Analisar com cpupro** para identificar gargalos
3. **Focar em caminhos críticos** e oportunidades de otimização
4. **Monitorar antes/depois** das melhorias de desempenho

> \[!WARNING]
> A geração de snapshots de heap e perfis de CPU pode afetar o desempenho. Recomendamos implementar a limitação e habilitar a criação de perfil apenas ao investigar problemas específicos ou durante janelas de manutenção.

Integração ### com nosso monitoramento de produção {#integration-with-our-production-monitoring}

Nossas ferramentas de criação de perfil se integram à nossa estratégia de monitoramento mais ampla:

* **Disparo automático** com base nos limites de memória/CPU
* **Integração de alertas** quando problemas de desempenho são detectados
* **Análise histórica** para rastrear tendências de desempenho ao longo do tempo
* **Correlação com métricas do aplicativo** para depuração abrangente

Essa abordagem nos ajudou a identificar e resolver vazamentos de memória, otimizar caminhos de código ativos e manter o desempenho estável em nosso ambiente de produção Node.js.

## Segurança de infraestrutura de produção do Node.js {#nodejs-production-infrastructure-security}

Implementamos segurança abrangente para nossa infraestrutura de produção Node.js por meio da automação Ansible. Estas práticas se aplicam a qualquer aplicação Node.js:

### Segurança em nível de sistema para produção do Node.js {#system-level-security-for-nodejs-production}

**Nossa implementação Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Nossas principais medidas de segurança para ambientes de produção Node.js:

* **Swap desabilitado** para impedir que dados confidenciais sejam gravados no disco
* **Despejos de núcleo desabilitados** para evitar despejos de memória contendo informações confidenciais
* **Armazenamento USB bloqueado** para impedir acesso não autorizado a dados
* **Ajuste de parâmetros do kernel** para segurança e desempenho

> \[!WARNING]
> Ao implementar as práticas recomendadas de implantação de produção do Node.js, desabilitar a troca pode causar interrupções por falta de memória se o seu aplicativo exceder a RAM disponível. Monitoramos o uso de memória cuidadosamente e dimensionamos nossos servidores adequadamente.

### Segurança de aplicativos para aplicativos Node.js {#application-security-for-nodejs-applications}

**Nossa redação do campo de log:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Removemos campos confidenciais de logs, incluindo senhas, tokens, chaves de API e informações pessoais. Isso protege a privacidade do usuário e, ao mesmo tempo, mantém os recursos de depuração em qualquer ambiente de produção Node.js.

### Automação de Segurança de Infraestrutura {#infrastructure-security-automation}

**Nossa configuração completa do Ansible para produção do Node.js:**

* [Manual de segurança](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Gerenciamento de chaves SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Gestão de certificados](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Configuração DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Nosso conteúdo de segurança {#our-security-content}

Saiba mais sobre nossa abordagem de segurança:

* [Melhores empresas de auditoria de segurança](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [E-mail criptografado Quantum Safe](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Por que segurança de e-mail de código aberto](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Arquitetura de banco de dados para aplicativos Node.js {#database-architecture-for-nodejs-applications}

Utilizamos uma abordagem de banco de dados híbrido otimizada para nossos aplicativos Node.js. Estes padrões podem ser adaptados para qualquer aplicativo Node.js:

### Implementação SQLite para produção Node.js {#sqlite-implementation-for-nodejs-production}

**O que usamos:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Nossa configuração:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Usamos SQLite para dados específicos do usuário em nossos aplicativos Node.js porque ele fornece:

* **Isolamento de dados** por usuário/locatário
* **Melhor desempenho** para consultas de usuário único
* **Backup e migração simplificados**
* **Complexidade reduzida** em comparação com bancos de dados compartilhados

Esse padrão funciona bem para aplicativos SaaS, sistemas multilocatários ou qualquer aplicativo Node.js que precise de isolamento de dados.

### Implementação do MongoDB para produção do Node.js {#mongodb-implementation-for-nodejs-production}

**O que usamos:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Nossa implementação de configuração:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Nossa configuração:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Usamos o MongoDB para dados de aplicativos em nosso ambiente de produção Node.js porque ele fornece:

* **Esquema flexível** para estruturas de dados em evolução
* **Melhor desempenho** para consultas complexas
* **Recursos de escala horizontal**
* **Linguagem de consulta avançada**

> \[!NOTE]
> Nossa abordagem híbrida otimiza nosso caso de uso específico. Estude nossos padrões reais de uso de banco de dados na base de código para entender se essa abordagem atende às necessidades do seu aplicativo Node.js.

## Processamento de trabalho em segundo plano de produção do Node.js {#nodejs-production-background-job-processing}

Construímos nossa arquitetura de tarefas em segundo plano com base no Bree para uma implantação confiável do Node.js em produção. Isso se aplica a qualquer aplicativo Node.js que precise de processamento em segundo plano:

### Nossa configuração do servidor Bree para produção {#our-bree-server-setup-for-production}

**Nossa principal implementação:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Nossa implantação do Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Exemplos de trabalhos de produção {#production-job-examples}

**Monitoramento de saúde:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automação de limpeza:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Todos os nossos empregos:** [Navegue em nosso diretório completo de empregos](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Esses padrões se aplicam a qualquer aplicativo Node.js que precise:

* Tarefas agendadas (processamento de dados, relatórios, limpeza)
* Processamento em segundo plano (redimensionamento de imagens, envio de e-mails, importação de dados)
* Monitoramento e manutenção da integridade
* Utilização de threads de trabalho para tarefas que exigem uso intensivo de CPU

### Nossos padrões de agendamento de tarefas para produção Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Estude nossos padrões atuais de agendamento de tarefas em nosso diretório de empregos para entender:

* Como implementamos o agendamento cron em produção com Node.js
* Nossa lógica de tratamento de erros e repetição
* Como usamos threads de trabalho para tarefas que exigem muita CPU

## Manutenção automatizada para aplicativos Node.js de produção {#automated-maintenance-for-production-nodejs-applications}

Implementamos manutenção proativa para evitar problemas comuns de produção em Node.js. Estes padrões se aplicam a qualquer aplicação Node.js:

### Nossa implementação de limpeza {#our-cleanup-implementation}

**Fonte:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Nossa manutenção automatizada para aplicativos de produção Node.js tem como alvo:

* **Arquivos temporários** com mais de 24 horas
* **Arquivos de log** além dos limites de retenção
* **Arquivos de cache** e dados temporários
* **Arquivos enviados** que não são mais necessários
* **Snapshots de heap** da depuração de desempenho

Esses padrões se aplicam a qualquer aplicativo Node.js que gere arquivos temporários, logs ou dados em cache.

### Gerenciamento de espaço em disco para produção do Node.js {#disk-space-management-for-nodejs-production}

**Nossos limites de monitoramento:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Limites de fila** para processamento em segundo plano
* **Limite de alerta de uso de disco de 75%**
* **Limpeza automática** quando os limites são excedidos

### Automação de Manutenção de Infraestrutura {#infrastructure-maintenance-automation}

**Nossa automação Ansible para produção Node.js:**

* [Implantação de ambiente](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Gerenciamento de chaves de implantação](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Guia de implementação de implantação de produção do Node.js {#nodejs-production-deployment-implementation-guide}

### Estude nosso código real para melhores práticas de produção {#study-our-actual-code-for-production-best-practices}

**Comece com estes arquivos-chave para a configuração do ambiente de produção do Node.js:**

1. **Configuração:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitoramento:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Tratamento de erros:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Registro:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Integridade do processo:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Aprenda com nossas postagens de blog {#learn-from-our-blog-posts}

**Nossos guias de implementação técnica para produção do Node.js:**

* [Ecossistema de Pacotes NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Sistemas de Pagamento de Edifícios](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementação de privacidade de e-mail](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formulários de contato JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integração de e-mail React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Automação de infraestrutura para produção Node.js {#infrastructure-automation-for-nodejs-production}

**Nossos manuais do Ansible para estudo na implantação de produção do Node.js:**

* [Diretório completo de playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Reforço da segurança](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuração do Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Nossos estudos de caso {#our-case-studies}

**Nossas implementações empresariais:**

* [Estudo de caso da Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Estudo de caso do Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Encaminhamento de e-mail de ex-alunos](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Conclusão: Melhores práticas de implantação de produção do Node.js {#conclusion-nodejs-production-deployment-best-practices}

Nossa infraestrutura de produção Node.js demonstra que os aplicativos Node.js podem atingir confiabilidade de nível empresarial por meio de:

* **Opções de hardware comprovadas** (AMD Ryzen para otimização de desempenho de núcleo único de 573%)
* **Monitoramento de produção Node.js testado em campo** com limites específicos e respostas automatizadas
* **Classificação inteligente de erros** para melhorar a resposta a incidentes em ambientes de produção
* **Depuração avançada de desempenho** com v8-profiler-next e cpupro para prevenção de OOM (Over-Oom)
* **Reforço abrangente da segurança** por meio da automação Ansible
* **Arquitetura de banco de dados híbrida** otimizada para as necessidades da aplicação
* **Manutenção automatizada** para evitar problemas comuns de produção no Node.js

**Principal conclusão:** Estude nossos arquivos de implementação e postagens de blog em vez de seguir práticas recomendadas genéricas. Nossa base de código fornece padrões reais para implantação de produção do Node.js que podem ser adaptados para qualquer aplicativo Node.js — aplicativos web, APIs, microsserviços ou serviços em segundo plano.

## Lista completa de recursos para produção do Node.js {#complete-resource-list-for-nodejs-production}

### Nossos principais arquivos de implementação {#our-core-implementation-files}

* [Configuração principal](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Dependências de pacotes](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Monitoramento de servidor](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Classificação de erros](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Sistema de registro](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Verificações de saúde do PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Limpeza automatizada](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Nossas implementações de servidor {#our-server-implementations}

* [Servidor web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Servidor de API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Agendador Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Servidor IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Servidor POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Nossa Automação de Infraestrutura {#our-infrastructure-automation}

* [Todos os nossos playbooks do Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Reforço da segurança](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuração do Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Configuração do banco de dados](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Nossas postagens técnicas do blog {#our-technical-blog-posts}

* [Análise do Ecossistema NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementação do Sistema de Pagamento](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Guia técnico de privacidade de e-mail](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formulários de contato JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integração de e-mail React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Guia de soluções auto-hospedadas](https://forwardemail.net/blog/docs/self-hosted-solution)

### Nossos estudos de caso corporativos {#our-enterprise-case-studies}

* [Implementação da Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Estudo de caso do Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Conformidade do Governo Federal](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Sistemas de e-mail para ex-alunos](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)