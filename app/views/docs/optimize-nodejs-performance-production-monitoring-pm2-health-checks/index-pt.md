# Como Otimizar a Infraestrutura de Produção Node.js: Melhores Práticas {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Guia de otimização de desempenho Node.js" class="rounded-lg" />


## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [Nossa Revolução de Otimização de Desempenho de Núcleo Único de 573%](#our-573-single-core-performance-optimization-revolution)
  * [Por que a Otimização de Desempenho de Núcleo Único é Importante para Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Conteúdo Relacionado](#related-content)
* [Configuração do Ambiente de Produção Node.js: Nossa Pilha Tecnológica](#nodejs-production-environment-setup-our-technology-stack)
  * [Gerenciador de Pacotes: pnpm para Eficiência em Produção](#package-manager-pnpm-for-production-efficiency)
  * [Framework Web: Koa para Produção Moderna Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Processamento de Jobs em Segundo Plano: Bree para Confiabilidade em Produção](#background-job-processing-bree-for-production-reliability)
  * [Tratamento de Erros: @hapi/boom para Confiabilidade em Produção](#error-handling-hapiboom-for-production-reliability)
* [Como Monitorar Aplicações Node.js em Produção](#how-to-monitor-nodejs-applications-in-production)
  * [Monitoramento de Produção Node.js em Nível de Sistema](#system-level-nodejs-production-monitoring)
  * [Monitoramento em Nível de Aplicação para Produção Node.js](#application-level-monitoring-for-nodejs-production)
  * [Monitoramento Específico de Aplicação](#application-specific-monitoring)
* [Monitoramento de Produção Node.js com Verificações de Saúde PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Nosso Sistema de Verificação de Saúde PM2](#our-pm2-health-check-system)
  * [Nossa Configuração PM2 para Produção](#our-pm2-production-configuration)
  * [Implantação Automatizada PM2](#automated-pm2-deployment)
* [Sistema de Tratamento e Classificação de Erros em Produção](#production-error-handling-and-classification-system)
  * [Nossa Implementação isCodeBug para Produção](#our-iscodebug-implementation-for-production)
  * [Integração com Nosso Logging de Produção](#integration-with-our-production-logging)
  * [Conteúdo Relacionado](#related-content-1)
* [Depuração Avançada de Desempenho com v8-profiler-next e cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Nossa Abordagem de Profiling para Produção Node.js](#our-profiling-approach-for-nodejs-production)
  * [Como Implementamos Análise de Heap Snapshot](#how-we-implement-heap-snapshot-analysis)
  * [Fluxo de Trabalho de Depuração de Desempenho](#performance-debugging-workflow)
  * [Implementação Recomendada para Sua Aplicação Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Integração com Nosso Monitoramento de Produção](#integration-with-our-production-monitoring)
* [Segurança da Infraestrutura de Produção Node.js](#nodejs-production-infrastructure-security)
  * [Segurança em Nível de Sistema para Produção Node.js](#system-level-security-for-nodejs-production)
  * [Segurança de Aplicação para Aplicações Node.js](#application-security-for-nodejs-applications)
  * [Automação de Segurança da Infraestrutura](#infrastructure-security-automation)
  * [Nosso Conteúdo de Segurança](#our-security-content)
* [Arquitetura de Banco de Dados para Aplicações Node.js](#database-architecture-for-nodejs-applications)
  * [Implementação SQLite para Produção Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implementação MongoDB para Produção Node.js](#mongodb-implementation-for-nodejs-production)
* [Processamento de Jobs em Segundo Plano para Produção Node.js](#nodejs-production-background-job-processing)
  * [Nossa Configuração do Servidor Bree para Produção](#our-bree-server-setup-for-production)
  * [Exemplos de Jobs em Produção](#production-job-examples)
  * [Nossos Padrões de Agendamento de Jobs para Produção Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Manutenção Automatizada para Aplicações Node.js em Produção](#automated-maintenance-for-production-nodejs-applications)
  * [Nossa Implementação de Limpeza](#our-cleanup-implementation)
  * [Gerenciamento de Espaço em Disco para Produção Node.js](#disk-space-management-for-nodejs-production)
  * [Automação de Manutenção da Infraestrutura](#infrastructure-maintenance-automation)
* [Guia de Implementação de Implantação para Produção Node.js](#nodejs-production-deployment-implementation-guide)
  * [Estude Nosso Código Real para Melhores Práticas de Produção](#study-our-actual-code-for-production-best-practices)
  * [Aprenda com Nossos Posts no Blog](#learn-from-our-blog-posts)
  * [Automação de Infraestrutura para Produção Node.js](#infrastructure-automation-for-nodejs-production)
  * [Nossos Estudos de Caso](#our-case-studies)
* [Conclusão: Melhores Práticas para Implantação em Produção Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Lista Completa de Recursos para Produção Node.js](#complete-resource-list-for-nodejs-production)
  * [Nossos Arquivos de Implementação Core](#our-core-implementation-files)
  * [Nossas Implementações de Servidor](#our-server-implementations)
  * [Nossa Automação de Infraestrutura](#our-infrastructure-automation)
  * [Nossos Posts Técnicos no Blog](#our-technical-blog-posts)
  * [Nossos Estudos de Caso Empresariais](#our-enterprise-case-studies)
## Prefácio {#foreword}

Na Forward Email, passamos anos aperfeiçoando nossa configuração de ambiente de produção Node.js. Este guia abrangente compartilha nossas melhores práticas testadas em batalha para implantação de produção Node.js, focando na otimização de desempenho, monitoramento e nas lições que aprendemos ao escalar aplicações Node.js para lidar com milhões de transações diárias.

## Nossa Revolução de Otimização de Desempenho de Núcleo Único de 573% {#our-573-single-core-performance-optimization-revolution}

Quando migramos de processadores Intel para AMD Ryzen, alcançamos uma **melhoria de desempenho de 573%** em nossas aplicações Node.js. Isso não foi apenas uma otimização menor — mudou fundamentalmente como nossas aplicações Node.js performam em produção e demonstra a importância da otimização de desempenho de núcleo único para qualquer aplicação Node.js.

> \[!TIP]
> Para melhores práticas de implantação de produção Node.js, a escolha do hardware é crítica. Escolhemos especificamente a hospedagem DataPacket pela disponibilidade de AMD Ryzen porque o desempenho de núcleo único é crucial para aplicações Node.js, já que a execução do JavaScript é single-threaded.

### Por que a Otimização de Desempenho de Núcleo Único Importa para Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Nossa migração de Intel para AMD Ryzen resultou em:

* **Melhoria de desempenho de 573%** no processamento de requisições (documentado na [Issue #1519 do nosso status page no GitHub](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Eliminação de atrasos no processamento** para respostas quase instantâneas (mencionado na [Issue #298 do GitHub](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Melhor relação custo-benefício** para ambientes de produção Node.js
* **Melhoria nos tempos de resposta** em todos os nossos endpoints de aplicação

O aumento de desempenho foi tão significativo que agora consideramos os processadores AMD Ryzen essenciais para qualquer implantação séria de produção Node.js, seja para aplicações web, APIs, microsserviços ou qualquer outra carga de trabalho Node.js.

### Conteúdo Relacionado {#related-content}

Para mais detalhes sobre nossas escolhas de infraestrutura, confira:

* [Melhor Serviço de Encaminhamento de Email](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Comparações de desempenho
* [Solução Self-Hosted](https://forwardemail.net/blog/docs/self-hosted-solution) - Recomendações de hardware

## Configuração do Ambiente de Produção Node.js: Nossa Pilha Tecnológica {#nodejs-production-environment-setup-our-technology-stack}

Nossas melhores práticas para implantação de produção Node.js incluem escolhas tecnológicas deliberadas baseadas em anos de experiência em produção. Aqui está o que usamos e por que essas escolhas se aplicam a qualquer aplicação Node.js:

### Gerenciador de Pacotes: pnpm para Eficiência em Produção {#package-manager-pnpm-for-production-efficiency}

**O que usamos:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (versão fixa)

Escolhemos pnpm em vez de npm e yarn para nossa configuração de ambiente de produção Node.js porque:

* **Tempos de instalação mais rápidos** em pipelines CI/CD
* **Eficiência no uso de espaço em disco** através de hard linking
* **Resolução estrita de dependências** que previne dependências fantasmas
* **Melhor desempenho** em implantações de produção

> \[!NOTE]
> Como parte das nossas melhores práticas para implantação de produção Node.js, fixamos versões exatas de ferramentas críticas como o pnpm para garantir comportamento consistente em todos os ambientes e máquinas dos membros da equipe.

**Detalhes da implementação:**

* [Nossa configuração package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Nosso post no blog sobre o ecossistema NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Framework Web: Koa para Produção Moderna Node.js {#web-framework-koa-for-modern-nodejs-production}

**O que usamos:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Escolhemos Koa em vez do Express para nossa infraestrutura de produção Node.js por seu suporte moderno a async/await e composição de middleware mais limpa. Nosso fundador Nick Baugh contribuiu para ambos Express e Koa, nos dando uma visão profunda de ambos os frameworks para uso em produção.

Esses padrões se aplicam quer você esteja construindo APIs REST, servidores GraphQL, aplicações web ou microsserviços.

**Nossos exemplos de implementação:**

* [Configuração do servidor web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Configuração do servidor API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Guia de implementação de formulários de contato](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Processamento de Jobs em Segundo Plano: Bree para Confiabilidade em Produção {#background-job-processing-bree-for-production-reliability}

**O que usamos:** scheduler [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Criamos e mantemos o Bree porque os agendadores de jobs existentes não atendiam às nossas necessidades de suporte a worker threads e recursos modernos do JavaScript em ambientes Node.js de produção. Isso se aplica a qualquer aplicação Node.js que precise de processamento em segundo plano, tarefas agendadas ou worker threads.

**Nossos exemplos de implementação:**

* [Configuração do servidor Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Todas as nossas definições de jobs](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Job de verificação de saúde do PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementação do job de limpeza](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Tratamento de Erros: @hapi/boom para Confiabilidade em Produção {#error-handling-hapiboom-for-production-reliability}

**O que usamos:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Usamos @hapi/boom para respostas de erro estruturadas em todas as nossas aplicações Node.js de produção. Esse padrão funciona para qualquer aplicação Node.js que precise de tratamento consistente de erros.

**Nossos exemplos de implementação:**

* [Helper de classificação de erros](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implementação do logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Como Monitorar Aplicações Node.js em Produção {#how-to-monitor-nodejs-applications-in-production}

Nossa abordagem para monitorar aplicações Node.js em produção evoluiu ao longo de anos rodando aplicações em escala. Implementamos monitoramento em múltiplas camadas para garantir confiabilidade e desempenho para qualquer tipo de aplicação Node.js.

### Monitoramento de Produção Node.js em Nível de Sistema {#system-level-nodejs-production-monitoring}

**Nossa implementação principal:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**O que usamos:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nossos limites de monitoramento em produção (do nosso código real de produção):

* **Limite de heap de 2GB** com alertas automáticos
* **25% de uso de memória** limite de aviso
* **80% de uso de CPU** limite de alerta
* **75% de uso de disco** limite de aviso

> \[!WARNING]
> Esses limites funcionam para nossa configuração específica de hardware. Ao implementar monitoramento de produção Node.js, revise nossa implementação monitor-server.js para entender a lógica exata e adaptar os valores para sua configuração.

### Monitoramento em Nível de Aplicação para Produção Node.js {#application-level-monitoring-for-nodejs-production}

**Nossa classificação de erros:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Esse helper distingue entre:

* **Bugs reais de código** que requerem atenção imediata
* **Erros do usuário** que são comportamento esperado
* **Falhas de serviços externos** que não podemos controlar

Esse padrão se aplica a qualquer aplicação Node.js - apps web, APIs, microsserviços ou serviços em segundo plano.
**Nossa implementação de logging:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Implementamos uma redação abrangente de campos para proteger informações sensíveis enquanto mantemos capacidades úteis de depuração em nosso ambiente de produção Node.js.

### Monitoramento Específico da Aplicação {#application-specific-monitoring}

**Nossas implementações de servidor:**

* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Servidor IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Servidor POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Monitoramento de fila:** Implementamos limites de fila de 5GB e timeouts de 180 segundos para processamento de requisições para evitar exaustão de recursos. Esses padrões se aplicam a qualquer aplicação Node.js com filas ou processamento em segundo plano.


## Monitoramento de Produção Node.js com Verificações de Saúde PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Aprimoramos nossa configuração de ambiente de produção Node.js com PM2 ao longo de anos de experiência em produção. Nossas verificações de saúde PM2 são essenciais para manter a confiabilidade em qualquer aplicação Node.js.

### Nosso Sistema de Verificação de Saúde PM2 {#our-pm2-health-check-system}

**Nossa implementação principal:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Nosso monitoramento de produção Node.js com verificações de saúde PM2 inclui:

* **Executa a cada 20 minutos** via agendamento cron
* **Requer no mínimo 15 minutos de uptime** antes de considerar um processo saudável
* **Valida status do processo e uso de memória**
* **Reinicia automaticamente processos falhos**
* **Previne loops de reinício** através de verificação inteligente de saúde

> \[!CAUTION]
> Para melhores práticas de implantação em produção Node.js, exigimos mais de 15 minutos de uptime antes de considerar um processo saudável para evitar loops de reinício. Isso previne falhas em cascata quando processos estão enfrentando problemas de memória ou outros.

### Nossa Configuração de Produção PM2 {#our-pm2-production-configuration}

**Nossa configuração do ecossistema:** Estude nossos arquivos de inicialização de servidor para configuração do ambiente de produção Node.js:

* [Servidor Web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Servidor API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Agendador Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Esses padrões se aplicam independentemente de você estar executando apps Express, servidores Koa, APIs GraphQL ou qualquer outra aplicação Node.js.

### Implantação Automatizada PM2 {#automated-pm2-deployment}

**Implantação PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Automatizamos toda nossa configuração PM2 através do Ansible para garantir implantações consistentes de produção Node.js em todos os nossos servidores.


## Sistema de Tratamento e Classificação de Erros em Produção {#production-error-handling-and-classification-system}

Uma das nossas melhores práticas mais valiosas para implantação em produção Node.js é a classificação inteligente de erros que se aplica a qualquer aplicação Node.js:

### Nossa Implementação isCodeBug para Produção {#our-iscodebug-implementation-for-production}

**Fonte:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Este helper fornece classificação inteligente de erros para aplicações Node.js em produção para:

* **Priorizar bugs reais** em vez de erros de usuário
* **Melhorar nossa resposta a incidentes** focando em problemas reais
* **Reduzir fadiga de alertas** causados por erros esperados de usuários
* **Entender melhor** problemas gerados pela aplicação versus pelo usuário

Esse padrão funciona para qualquer aplicação Node.js - seja você construindo sites de e-commerce, plataformas SaaS, APIs ou microsserviços.

### Integração com Nosso Logging de Produção {#integration-with-our-production-logging}

**Nossa integração de logger:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Nosso logger usa `isCodeBug` para determinar níveis de alerta e redação de campos, garantindo que sejamos notificados sobre problemas reais enquanto filtramos ruídos em nosso ambiente de produção Node.js.

### Conteúdo Relacionado {#related-content-1}

Saiba mais sobre nossos padrões de tratamento de erros:

* [Construindo Sistema de Pagamento Confiável](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Padrões de tratamento de erros
* [Proteção de Privacidade de Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Tratamento de erros de segurança


## Depuração Avançada de Performance com v8-profiler-next e cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Usamos ferramentas avançadas de profiling para analisar snapshots de heap e depurar problemas de OOM (Out of Memory), gargalos de performance e problemas de memória do Node.js em nosso ambiente de produção. Essas ferramentas são essenciais para qualquer aplicação Node.js que esteja enfrentando vazamentos de memória ou problemas de desempenho.

### Nossa Abordagem de Profiling para Produção Node.js {#our-profiling-approach-for-nodejs-production}

**Ferramentas que recomendamos:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Para gerar snapshots de heap e perfis de CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Para analisar perfis de CPU e snapshots de heap

> \[!TIP]
> Usamos v8-profiler-next e cpupro juntos para criar um fluxo completo de depuração de performance para nossas aplicações Node.js. Essa combinação nos ajuda a identificar vazamentos de memória, gargalos de performance e otimizar nosso código de produção.

### Como Implementamos a Análise de Heap Snapshot {#how-we-implement-heap-snapshot-analysis}

**Nossa implementação de monitoramento:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Nosso monitoramento de produção inclui geração automática de snapshots de heap quando os limites de memória são ultrapassados. Isso nos ajuda a depurar problemas de OOM antes que causem falhas na aplicação.

**Padrões chave de implementação:**

* **Snapshots automáticos** quando o tamanho do heap ultrapassa o limite de 2GB
* **Profiling baseado em sinais** para análise sob demanda em produção
* **Políticas de retenção** para gerenciar o armazenamento dos snapshots
* **Integração com nossos jobs de limpeza** para manutenção automatizada

### Fluxo de Trabalho de Depuração de Performance {#performance-debugging-workflow}

**Estude nossa implementação real:**

* [Implementação do servidor de monitoramento](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Monitoramento de heap e geração de snapshots
* [Job de limpeza](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Retenção e limpeza de snapshots
* [Integração com logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Registro de performance

### Implementação Recomendada para Sua Aplicação Node.js {#recommended-implementation-for-your-nodejs-application}

**Para análise de heap snapshot:**

1. **Instale v8-profiler-next** para geração de snapshots
2. **Use cpupro** para analisar os snapshots gerados
3. **Implemente limites de monitoramento** similar ao nosso monitor-server.js
4. **Configure limpeza automatizada** para gerenciar o armazenamento dos snapshots
5. **Crie handlers de sinais** para profiling sob demanda em produção

**Para profiling de CPU:**

1. **Gere perfis de CPU** durante períodos de alta carga
2. **Analise com cpupro** para identificar gargalos
3. **Foque em caminhos críticos** e oportunidades de otimização
4. **Monitore antes/depois** das melhorias de performance

> \[!WARNING]
> Gerar snapshots de heap e perfis de CPU pode impactar a performance. Recomendamos implementar limitação e habilitar o profiling apenas ao investigar problemas específicos ou durante janelas de manutenção.

### Integração com Nosso Monitoramento de Produção {#integration-with-our-production-monitoring}

Nossas ferramentas de profiling se integram com nossa estratégia mais ampla de monitoramento:

* **Disparo automático** baseado em limites de memória/CPU
* **Integração de alertas** quando problemas de performance são detectados
* **Análise histórica** para acompanhar tendências de performance ao longo do tempo
* **Correlação com métricas da aplicação** para depuração abrangente
Esta abordagem nos ajudou a identificar e resolver vazamentos de memória, otimizar caminhos críticos de código e manter desempenho estável em nosso ambiente de produção Node.js.


## Segurança da Infraestrutura de Produção Node.js {#nodejs-production-infrastructure-security}

Implementamos segurança abrangente para nossa infraestrutura de produção Node.js por meio da automação Ansible. Essas práticas se aplicam a qualquer aplicação Node.js:

### Segurança em Nível de Sistema para Produção Node.js {#system-level-security-for-nodejs-production}

**Nossa implementação Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Nossas principais medidas de segurança para ambientes de produção Node.js:

* **Swap desabilitado** para evitar que dados sensíveis sejam gravados no disco
* **Core dumps desabilitados** para evitar despejos de memória contendo informações sensíveis
* **Armazenamento USB bloqueado** para prevenir acesso não autorizado a dados
* **Ajuste de parâmetros do kernel** para segurança e desempenho

> \[!WARNING]
> Ao implementar as melhores práticas de implantação para produção Node.js, desabilitar o swap pode causar encerramentos por falta de memória se sua aplicação exceder a RAM disponível. Monitoramos o uso de memória cuidadosamente e dimensionamos nossos servidores adequadamente.

### Segurança da Aplicação para Aplicações Node.js {#application-security-for-nodejs-applications}

**Nossa redação de campos de log:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Redigimos campos sensíveis dos logs, incluindo senhas, tokens, chaves de API e informações pessoais. Isso protege a privacidade do usuário enquanto mantém a capacidade de depuração em qualquer ambiente de produção Node.js.

### Automação de Segurança da Infraestrutura {#infrastructure-security-automation}

**Nossa configuração completa Ansible para produção Node.js:**

* [Playbook de segurança](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Gerenciamento de chaves SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Gerenciamento de certificados](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Configuração DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Nosso Conteúdo de Segurança {#our-security-content}

Saiba mais sobre nossa abordagem de segurança:

* [Melhores Empresas de Auditoria de Segurança](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Email Criptografado Quantum Safe](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Por que Segurança de Email Open Source](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Arquitetura de Banco de Dados para Aplicações Node.js {#database-architecture-for-nodejs-applications}

Usamos uma abordagem híbrida de banco de dados otimizada para nossas aplicações Node.js. Esses padrões podem ser adaptados para qualquer aplicação Node.js:

### Implementação SQLite para Produção Node.js {#sqlite-implementation-for-nodejs-production}

**O que usamos:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Nossa configuração:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Usamos SQLite para dados específicos do usuário em nossas aplicações Node.js porque oferece:

* **Isolamento de dados** por usuário/locatário
* **Melhor desempenho** para consultas de usuário único
* **Backup** e migração simplificados
* **Complexidade reduzida** comparado a bancos de dados compartilhados

Esse padrão funciona bem para aplicações SaaS, sistemas multi-tenant ou qualquer aplicação Node.js que precise de isolamento de dados.

### Implementação MongoDB para Produção Node.js {#mongodb-implementation-for-nodejs-production}

**O que usamos:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Nossa implementação de configuração:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Nossa configuração:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Usamos MongoDB para dados da aplicação em nosso ambiente de produção Node.js porque ele oferece:

* **Esquema flexível** para estruturas de dados em evolução
* **Melhor desempenho** para consultas complexas
* **Capacidades de escalonamento horizontal**
* **Linguagem de consulta rica**

> \[!NOTE]
> Nossa abordagem híbrida é otimizada para nosso caso de uso específico. Estude nossos padrões reais de uso do banco de dados no código para entender se essa abordagem se encaixa nas necessidades da sua aplicação Node.js.


## Processamento de Jobs em Segundo Plano em Produção Node.js {#nodejs-production-background-job-processing}

Construímos nossa arquitetura de jobs em segundo plano em torno do Bree para implantação confiável em produção Node.js. Isso se aplica a qualquer aplicação Node.js que precise de processamento em segundo plano:

### Nossa Configuração do Servidor Bree para Produção {#our-bree-server-setup-for-production}

**Nossa implementação principal:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Nossa implantação Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Exemplos de Jobs em Produção {#production-job-examples}

**Monitoramento de saúde:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automação de limpeza:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Todos os nossos jobs:** [Navegue pelo nosso diretório completo de jobs](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Esses padrões se aplicam a qualquer aplicação Node.js que precise de:

* Tarefas agendadas (processamento de dados, relatórios, limpeza)
* Processamento em segundo plano (redimensionamento de imagens, envio de e-mails, importação de dados)
* Monitoramento de saúde e manutenção
* Utilização de threads de trabalho para tarefas intensivas em CPU

### Nossos Padrões de Agendamento de Jobs para Produção Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Estude nossos padrões reais de agendamento de jobs em nosso diretório de jobs para entender:

* Como implementamos agendamento tipo cron em produção Node.js
* Nossa lógica de tratamento de erros e tentativas
* Como usamos threads de trabalho para tarefas intensivas em CPU


## Manutenção Automatizada para Aplicações Node.js em Produção {#automated-maintenance-for-production-nodejs-applications}

Implementamos manutenção proativa para prevenir problemas comuns em produção Node.js. Esses padrões se aplicam a qualquer aplicação Node.js:

### Nossa Implementação de Limpeza {#our-cleanup-implementation}

**Fonte:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Nossa manutenção automatizada para aplicações Node.js em produção foca em:

* **Arquivos temporários** com mais de 24 horas
* **Arquivos de log** além dos limites de retenção
* **Arquivos de cache** e dados temporários
* **Arquivos enviados** que não são mais necessários
* **Snapshots de heap** de depuração de desempenho

Esses padrões se aplicam a qualquer aplicação Node.js que gere arquivos temporários, logs ou dados em cache.

### Gerenciamento de Espaço em Disco para Produção Node.js {#disk-space-management-for-nodejs-production}

**Nossos limites de monitoramento:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Limites de fila** para processamento em segundo plano
* **Aviso de 75% de uso do disco**
* **Limpeza automática** quando os limites são ultrapassados

### Automação de Manutenção de Infraestrutura {#infrastructure-maintenance-automation}

**Nossa automação Ansible para produção Node.js:**

* [Implantação do ambiente](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Gerenciamento de chaves de implantação](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Guia de Implementação para Implantação em Produção Node.js {#nodejs-production-deployment-implementation-guide}
### Estude Nosso Código Real para Melhores Práticas de Produção {#study-our-actual-code-for-production-best-practices}

**Comece com estes arquivos-chave para configuração do ambiente de produção Node.js:**

1. **Configuração:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitoramento:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Tratamento de erros:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Registro de logs:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Saúde do processo:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Aprenda com Nossos Posts no Blog {#learn-from-our-blog-posts}

**Nossos guias técnicos de implementação para produção Node.js:**

* [Ecossistema de Pacotes NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Construindo Sistemas de Pagamento](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementação de Privacidade de Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formulários de Contato em JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integração de Email com React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Automação de Infraestrutura para Produção Node.js {#infrastructure-automation-for-nodejs-production}

**Nossos playbooks Ansible para estudar sobre implantação de produção Node.js:**

* [Diretório completo de playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Endurecimento de segurança](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuração Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Nossos Estudos de Caso {#our-case-studies}

**Nossas implementações empresariais:**

* [Estudo de Caso Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Estudo de Caso Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Encaminhamento de Email para Ex-Alunos](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Conclusão: Melhores Práticas para Implantação de Produção Node.js {#conclusion-nodejs-production-deployment-best-practices}

Nossa infraestrutura de produção Node.js demonstra que aplicações Node.js podem alcançar confiabilidade de nível empresarial através de:

* **Escolhas comprovadas de hardware** (AMD Ryzen para otimização de desempenho single core em 573%)
* **Monitoramento de produção Node.js testado em campo** com limites específicos e respostas automatizadas
* **Classificação inteligente de erros** para melhorar a resposta a incidentes em ambientes de produção
* **Depuração avançada de desempenho** com v8-profiler-next e cpupro para prevenção de OOM
* **Endurecimento abrangente de segurança** através de automação Ansible
* **Arquitetura híbrida de banco de dados** otimizada para necessidades da aplicação
* **Manutenção automatizada** para prevenir problemas comuns em produção Node.js

**Principal lição:** Estude nossos arquivos de implementação reais e posts no blog em vez de seguir práticas genéricas. Nossa base de código fornece padrões do mundo real para implantação de produção Node.js que podem ser adaptados para qualquer aplicação Node.js - apps web, APIs, microsserviços ou serviços em background.


## Lista Completa de Recursos para Produção Node.js {#complete-resource-list-for-nodejs-production}

### Nossos Arquivos Principais de Implementação {#our-core-implementation-files}

* [Configuração principal](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Dependências do pacote](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Monitoramento do servidor](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Classificação de erros](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Sistema de logs](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Verificações de saúde PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Limpeza automatizada](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Nossas Implementações de Servidor {#our-server-implementations}

* [Servidor web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Servidor API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Agendador Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Servidor IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Servidor POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Nossa Automação de Infraestrutura {#our-infrastructure-automation}

* [Todos os nossos playbooks Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Endurecimento de segurança](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuração do Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Configuração do banco de dados](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Nossos Posts Técnicos no Blog {#our-technical-blog-posts}

* [Análise do Ecossistema NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementação do Sistema de Pagamento](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Guia Técnico de Privacidade de Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formulários de Contato em JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integração de Email com React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Guia de Solução Auto-Hospedada](https://forwardemail.net/blog/docs/self-hosted-solution)

### Nossos Estudos de Caso Empresariais {#our-enterprise-case-studies}

* [Implementação da Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Estudo de Caso Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Conformidade do Governo Federal](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Sistemas de Email para Alumni](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
