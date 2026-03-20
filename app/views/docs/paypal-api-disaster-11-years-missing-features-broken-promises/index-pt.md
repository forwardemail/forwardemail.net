# O desastre de 11 anos da API do PayPal: como construímos soluções alternativas enquanto eles ignoravam os desenvolvedores {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Sucesso! O PayPal finalmente adicionou o endpoint `GET /v1/billing/subscriptions`.**
>
> Depois que publicamos este post e enviamos por e-mail para a liderança executiva do PayPal, suas equipes implementaram o endpoint tão necessário para listar assinaturas. A mudança apareceu em algum momento entre [25 de junho de 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) e [9 de julho de 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> No entanto, no verdadeiro estilo PayPal, eles nunca nos notificaram. Só descobrimos essa atualização por conta própria em dezembro de 2025, meses depois do recurso ter sido lançado silenciosamente.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="Ilustração do desastre da API do PayPal" class="rounded-lg" />

<p class="lead mt-3">Na Forward Email, lidamos com as APIs quebradas do PayPal por mais de uma década. O que começou como pequenas frustrações se transformou em um desastre completo que nos forçou a construir nossas próprias soluções alternativas, bloquear seus templates de phishing e, por fim, interromper todos os pagamentos do PayPal durante uma migração crítica de conta.</p>
<p class="lead mt-3">Esta é a história de 11 anos do PayPal ignorando necessidades básicas dos desenvolvedores enquanto tentávamos de tudo para fazer a plataforma deles funcionar.</p>


## Índice {#table-of-contents}

* [A peça que faltava: sem como listar assinaturas](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: O problema surge](#2014-2017-the-problem-emerges)
* [2020: Damos um feedback extenso](#2020-we-give-them-extensive-feedback)
  * [A lista de feedback com 27 itens](#the-27-item-feedback-list)
  * [Equipes se envolveram, promessas foram feitas](#teams-got-involved-promises-were-made)
  * [O resultado? Nada.](#the-result-nothing)
* [A saída dos executivos: como o PayPal perdeu toda a memória institucional](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nova liderança, mesmos problemas](#2025-new-leadership-same-problems)
  * [O novo CEO se envolve](#the-new-ceo-gets-involved)
  * [Resposta de Michelle Gill](#michelle-gills-response)
  * [Nossa resposta: sem mais reuniões](#our-response-no-more-meetings)
  * [A resposta de Marty Brodbeck com excesso de engenharia](#marty-brodbecks-overengineering-response)
  * [A contradição do "CRUD simples"](#the-simple-crud-contradiction)
  * [A desconexão fica clara](#the-disconnect-becomes-clear)
* [Anos de relatórios de bugs que eles ignoraram](#years-of-bug-reports-they-ignored)
  * [2016: Reclamações iniciais de UI/UX](#2016-early-uiux-complaints)
  * [2021: Relatório de bug de e-mail comercial](#2021-business-email-bug-report)
  * [2021: Sugestões de melhoria de UI](#2021-ui-improvement-suggestions)
  * [2021: Falhas no ambiente sandbox](#2021-sandbox-environment-failures)
  * [2021: Sistema de relatórios completamente quebrado](#2021-reports-system-completely-broken)
  * [2022: Recurso principal da API ausente (de novo)](#2022-core-api-feature-missing-again)
* [O pesadelo da experiência do desenvolvedor](#the-developer-experience-nightmare)
  * [Interface de usuário quebrada](#broken-user-interface)
  * [Problemas com SDK](#sdk-problems)
  * [Violações da política de segurança de conteúdo](#content-security-policy-violations)
  * [Caos na documentação](#documentation-chaos)
  * [Vulnerabilidades de segurança](#security-vulnerabilities)
  * [Desastre no gerenciamento de sessão](#session-management-disaster)
* [Julho de 2025: a gota d'água](#july-2025-the-final-straw)
* [Por que não podemos simplesmente abandonar o PayPal](#why-we-cant-just-drop-paypal)
* [A solução alternativa da comunidade](#the-community-workaround)
* [Bloqueando templates do PayPal devido a phishing](#blocking-paypal-templates-due-to-phishing)
  * [O problema real: os templates do PayPal parecem golpes](#the-real-problem-paypals-templates-look-like-scams)
  * [Nossa implementação](#our-implementation)
  * [Por que tivemos que bloquear o PayPal](#why-we-had-to-block-paypal)
  * [A escala do problema](#the-scale-of-the-problem)
  * [A ironia](#the-irony)
  * [Impacto no mundo real: golpes novos do PayPal](#real-world-impact-novel-paypal-scams)
* [O processo KYC invertido do PayPal](#paypals-backwards-kyc-process)
  * [Como deveria funcionar](#how-it-should-work)
  * [Como o PayPal realmente funciona](#how-paypal-actually-works)
  * [O impacto no mundo real](#the-real-world-impact)
  * [O desastre da migração de conta em julho de 2025](#the-july-2025-account-migration-disaster)
  * [Por que isso importa](#why-this-matters)
* [Como todos os outros processadores de pagamento fazem certo](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [O padrão da indústria](#the-industry-standard)
  * [O que outros processadores oferecem vs PayPal](#what-other-processors-provide-vs-paypal)
* [A encoberta sistemática do PayPal: silenciando 6 milhões de vozes](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [A grande eliminação](#the-great-erasure)
  * [O resgate por terceiros](#the-third-party-rescue)
* [O desastre do bug de captura de 11 anos: $1.899 e contando](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [A perda de $1.899 da Forward Email](#forward-emails-1899-loss)
  * [O relatório original de 2013: mais de 11 anos de negligência](#the-2013-original-report-11-years-of-negligence)
  * [A admissão de 2016: PayPal quebra seu próprio SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [A escalada de 2024: ainda quebrado](#the-2024-escalation-still-broken)
  * [O desastre da confiabilidade do webhook](#the-webhook-reliability-disaster)
  * [O padrão de negligência sistemática](#the-pattern-of-systematic-negligence)
  * [O requisito não documentado](#the-undocumented-requirement)
* [O padrão mais amplo de engano do PayPal](#paypals-broader-pattern-of-deception)
  * [A ação do Departamento de Serviços Financeiros de Nova York](#the-new-york-department-of-financial-services-action)
  * [O processo Honey: reescrevendo links afiliados](#the-honey-lawsuit-rewriting-affiliate-links)
  * [O custo da negligência do PayPal](#the-cost-of-paypals-negligence)
  * [A mentira da documentação](#the-documentation-lie)
* [O que isso significa para os desenvolvedores](#what-this-means-for-developers)
## A Peça que Falta: Nenhuma Forma de Listar Assinaturas {#the-missing-piece-no-way-to-list-subscriptions}

Aqui está algo que nos deixa perplexos: o PayPal tem cobrança por assinatura desde 2014, mas nunca forneceu uma forma para os comerciantes listarem suas próprias assinaturas.

Pense nisso por um segundo. Você pode criar assinaturas, pode cancelá-las se tiver o ID, mas não pode obter uma lista de todas as assinaturas ativas da sua conta. É como ter um banco de dados sem uma instrução SELECT.

Precisamos disso para operações básicas de negócios:

* Suporte ao cliente (quando alguém envia um e-mail perguntando sobre sua assinatura)
* Relatórios financeiros e conciliação
* Gestão automatizada de cobranças
* Conformidade e auditoria

Mas o PayPal? Eles simplesmente... nunca construíram isso.


## 2014-2017: O Problema Surge {#2014-2017-the-problem-emerges}

O problema da listagem de assinaturas apareceu pela primeira vez nos fóruns da comunidade do PayPal em 2017. Desenvolvedores estavam fazendo a pergunta óbvia: "Como faço para obter uma lista de todas as minhas assinaturas?"

A resposta do PayPal? Silêncio total.

Membros da comunidade começaram a ficar frustrados:

> "Omissão muito estranha se um comerciante não pode listar todos os Acordos ativos. Se o ID do Acordo for perdido, isso significa que somente o usuário pode cancelar ou suspender um acordo." - leafspider

> "+1. Já se passaram quase 3 anos." - laudukang (significando que o problema existia desde \~2014)

A [postagem original da comunidade](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) de 2017 mostra desenvolvedores implorando por essa funcionalidade básica. A resposta do PayPal foi arquivar o repositório onde as pessoas estavam reportando o problema.


## 2020: Demos a Eles um Feedback Extenso {#2020-we-give-them-extensive-feedback}

Em outubro de 2020, o PayPal entrou em contato conosco para uma sessão formal de feedback. Não foi uma conversa casual - eles organizaram uma chamada de 45 minutos no Microsoft Teams com 8 executivos do PayPal, incluindo Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze e outros.

### A Lista de Feedback com 27 Itens {#the-27-item-feedback-list}

Fomos preparados. Após 6 horas tentando integrar com suas APIs, compilamos 27 problemas específicos. Mark Stuart, da equipe do PayPal Checkout, disse:

> Ei Nick, obrigado por compartilhar com todos hoje! Acho que isso será o catalisador para obter mais suporte e investimento para nossa equipe ir e corrigir essas coisas. Tem sido difícil obter um feedback rico como o que você nos deixou até agora.

O feedback não foi teórico - veio de tentativas reais de integração:

1. **Geração de token de acesso não funcionando**:

> A geração do token de acesso não está funcionando. Além disso, deveria haver mais do que apenas exemplos em cURL.

2. **Nenhuma interface web para criação de assinaturas**:

> Como diabos você pode criar assinaturas sem ter que fazer isso usando cURL? Não parece haver uma interface web para isso (como a Stripe tem)

Mark Stuart achou o problema do token de acesso particularmente preocupante:

> Normalmente não ouvimos falar de problemas relacionados à geração de token de acesso.

### Equipes se Envolveram, Promessas Foram Feitas {#teams-got-involved-promises-were-made}

À medida que descobríamos mais problemas, o PayPal continuava adicionando mais equipes à conversa. Darshan Raju, da equipe de UI de gerenciamento de Assinaturas, entrou e disse:

> Reconhecemos a lacuna. Vamos acompanhar e resolver isso. Obrigado novamente pelo seu feedback!

A sessão foi descrita como buscando uma:

> análise franca da sua experiência

para:

> fazer do PayPal o que ele deveria ser para desenvolvedores.

### O Resultado? Nada. {#the-result-nothing}

Apesar da sessão formal de feedback, da extensa lista de 27 itens, do envolvimento de múltiplas equipes e das promessas de:

> acompanhar e resolver

os problemas, absolutamente nada foi corrigido.


## A Evasão Executiva: Como o PayPal Perdeu Toda a Memória Institucional {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Aqui é onde fica realmente interessante. Todas as pessoas que receberam nosso feedback em 2020 saíram do PayPal:

**Mudanças na Liderança:**

* [Dan Schulman (CEO por 9 anos) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (setembro de 2023)
* [Sri Shivananda (CTO que organizou o feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (janeiro de 2024)
**Líderes Técnicos Que Fizeram Promessas, Depois Saíram:**

* **Mark Stuart** (prometeu que o feedback seria "catalisador") → [Agora na Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (veterano de 18 anos do PayPal) → [CEO da MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP de Produto Global para Consumidor) → [Aposentado](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (um dos últimos remanescentes) → [Acabou de sair para a Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (janeiro de 2025)

O PayPal se tornou uma porta giratória onde executivos coletam feedback dos desenvolvedores, fazem promessas e depois saem para empresas melhores como JPMorgan, Ripple e outras fintechs.

Isso explica por que a resposta ao problema no GitHub em 2025 parecia completamente desconectada do nosso feedback de 2020 - literalmente todos que receberam aquele feedback já saíram do PayPal.


## 2025: Nova Liderança, Mesmos Problemas {#2025-new-leadership-same-problems}

Avançando para 2025, o mesmo padrão exato surge. Após anos sem progresso, a nova liderança do PayPal entra em contato novamente.

### O Novo CEO Se Envolve {#the-new-ceo-gets-involved}

Em 30 de junho de 2025, escalamos diretamente para o novo CEO do PayPal, Alex Chriss. Sua resposta foi breve:

> Olá Nick – Obrigado por entrar em contato e pelo feedback. Michelle (em cópia) está à frente com sua equipe para se envolver e trabalhar isso com você. Obrigado -A

### Resposta de Michelle Gill {#michelle-gills-response}

Michelle Gill, EVP e Gerente Geral de Pequenas Empresas e Serviços Financeiros, respondeu:

> Muito obrigado Nick, movendo Alex para cópia oculta. Estamos investigando isso desde sua postagem anterior. Vamos ligar para você antes do fim da semana. Pode me enviar suas informações de contato para que um dos meus colegas possa entrar em contato? Michelle

### Nossa Resposta: Chega de Reuniões {#our-response-no-more-meetings}

Recusamos outra reunião, explicando nossa frustração:

> Obrigado. Porém, não sinto que participar de uma chamada vá adiantar. Eis o motivo... Já participei de uma chamada no passado e não levou a lugar algum. Perdi mais de 2 horas do meu tempo conversando com toda a equipe e liderança e nada foi feito... Muitas trocas de e-mails. Absolutamente nada feito. O feedback não levou a lugar algum. Tentei por anos, fui ouvido, e depois não deu em nada.

### Resposta de Superengenharia de Marty Brodbeck {#marty-brodbecks-overengineering-response}

Então Marty Brodbeck, que lidera a engenharia para consumidores no PayPal, entrou em contato:

> Olá Nick, aqui é Marty Brodbeck. Eu lidero toda a engenharia para consumidores aqui no PayPal e tenho conduzido o desenvolvimento da API para a empresa. Podemos nos conectar para discutir o problema que você está enfrentando e como podemos ajudar aqui?

Quando explicamos a necessidade simples de um endpoint para listagem de assinaturas, a resposta dele revelou o problema exato:

> Obrigado Nick, estamos no processo de criar uma única API de assinaturas com SDK completo (suporta tratamento completo de erros, rastreamento de assinaturas baseado em eventos, alta disponibilidade robusta) onde a cobrança também é separada como uma API distinta para que os comerciantes possam acessar, em vez de ter que orquestrar múltiplos endpoints para obter uma única resposta.

Essa é exatamente a abordagem errada. Não precisamos de meses de arquitetura complexa. Precisamos de um endpoint REST simples que liste assinaturas - algo que deveria existir desde 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### A Contradição do "CRUD Simples" {#the-simple-crud-contradiction}

Quando apontamos que essa era uma funcionalidade básica de CRUD que deveria existir desde 2014, a resposta de Marty foi reveladora:

> Operações CRUD simples fazem parte da API principal, meu amigo, então não vai levar meses de desenvolvimento

O SDK TypeScript do PayPal, que atualmente suporta apenas três endpoints após meses de desenvolvimento, junto com sua linha do tempo histórica, demonstra claramente que tais projetos requerem mais do que alguns meses para serem concluídos.
Esta resposta mostra que ele não entende sua própria API. Se "operações CRUD simples fazem parte da API principal", então onde está o endpoint de listagem de assinaturas? Respondemos:

> Se 'operações CRUD simples fazem parte da API principal' então onde está o endpoint de listagem de assinaturas? Desenvolvedores têm pedido essa 'operação CRUD simples' desde 2014. Já se passaram 11 anos. Todo outro processador de pagamento tem essa funcionalidade básica desde o primeiro dia.

### A Desconexão Fica Clara {#the-disconnect-becomes-clear}

As trocas de 2025 com Alex Chriss, Michelle Gill e Marty Brodbeck mostram a mesma disfunção organizacional:

1. **A nova liderança não tem conhecimento das sessões anteriores de feedback**
2. **Eles propõem as mesmas soluções superdimensionadas**
3. **Eles não entendem as limitações da própria API**
4. **Eles querem mais reuniões ao invés de simplesmente resolver o problema**

Esse padrão explica por que as equipes do PayPal em 2025 parecem completamente desconectadas do extenso feedback fornecido em 2020 - as pessoas que receberam esse feedback se foram, e a nova liderança está repetindo os mesmos erros.


## Anos de Relatórios de Bugs que Ignoraram {#years-of-bug-reports-they-ignored}

Não apenas reclamamos sobre recursos ausentes. Reportamos ativamente bugs e tentamos ajudá-los a melhorar. Aqui está uma linha do tempo abrangente dos problemas que documentamos:

### 2016: Reclamações Iniciais de UI/UX {#2016-early-uiux-complaints}

Ainda em 2016, estávamos publicamente contatando a liderança do PayPal, incluindo Dan Schulman, sobre problemas de interface e usabilidade. Isso foi há 9 anos, e os mesmos problemas de UI/UX persistem até hoje.

### 2021: Relatório de Bug no E-mail Comercial {#2021-business-email-bug-report}

Em março de 2021, reportamos que o sistema de e-mail comercial do PayPal estava enviando notificações de cancelamento incorretas. O template do e-mail tinha variáveis renderizadas incorretamente, mostrando mensagens confusas para os clientes.

Mark Stuart reconheceu o problema:

> Obrigado Nick! Mudando para CCO. @Prasy, sua equipe é responsável por este e-mail ou sabe quem é? O "Niftylettuce, LLC, não vamos mais cobrar você" me faz acreditar que há uma confusão em quem é o destinatário e o conteúdo do e-mail.

**Resultado**: Eles realmente consertaram este! Mark Stuart confirmou:

> Acabei de ouvir da equipe de notificações que o template do e-mail foi corrigido e implementado. Agradeço por ter entrado em contato para reportar. Obrigado!

Isso mostra que eles PODEM consertar as coisas quando querem - eles apenas escolhem não fazer isso na maioria dos casos.

### 2021: Sugestões de Melhoria de UI {#2021-ui-improvement-suggestions}

Em fevereiro de 2021, fornecemos feedback detalhado sobre a UI do painel, especificamente a seção "Atividade Recente do PayPal":

> Acho que o painel em paypal.com, especificamente "Atividade Recente do PayPal", precisa ser melhorado. Não acho que vocês deveriam mostrar as linhas de status "Criado" para pagamentos recorrentes de $0 - isso só adiciona muitas linhas extras e você não consegue ver facilmente de relance quanto de receita está sendo gerada no dia/últimos dias.

Mark Stuart encaminhou para a equipe de produtos para consumidores:

> Obrigado! Não tenho certeza de qual equipe é responsável pela Atividade, mas encaminhei para o chefe de produtos para consumidores para encontrar a equipe correta. Um pagamento recorrente de $0,00 parece um bug. Provavelmente deveria ser filtrado.

**Resultado**: Nunca corrigido. A UI ainda mostra essas entradas inúteis de $0.

### 2021: Falhas no Ambiente Sandbox {#2021-sandbox-environment-failures}

Em novembro de 2021, reportamos problemas críticos com o ambiente sandbox do PayPal:

* Chaves secretas da API do sandbox eram alteradas e desativadas aleatoriamente
* Todas as contas de teste do sandbox foram deletadas sem aviso
* Mensagens de erro ao tentar visualizar detalhes da conta sandbox
* Falhas intermitentes no carregamento

> Por algum motivo minha chave secreta da API do sandbox foi alterada e foi desativada. Além disso, todas as minhas contas de teste antigas do Sandbox foram deletadas.

> Às vezes elas carregam e às vezes não também. Isso é extremamente frustrante.

**Resultado**: Sem resposta, sem correção. Desenvolvedores ainda enfrentam problemas de confiabilidade no sandbox.

### 2021: Sistema de Relatórios Completamente Quebrado {#2021-reports-system-completely-broken}
Em maio de 2021, relatamos que o sistema de download do PayPal para relatórios de transações estava completamente quebrado:

> Parece que os downloads de relatórios não funcionam no momento e não funcionaram o dia todo. Também provavelmente deveria receber uma notificação por e-mail se falhar.

Também apontamos o desastre na gestão de sessões:

> Além disso, se você ficar inativo enquanto estiver logado no PayPal por cerca de 5 minutos, você é desconectado. Então, quando você atualiza o botão ao lado do relatório que deseja verificar o status (depois de esperar uma eternidade), é um saco ter que fazer login novamente.

Mark Stuart reconheceu o problema do tempo limite da sessão:

> Lembro que você havia relatado isso no passado com sua sessão expirando frequentemente e interrompendo seu fluxo de desenvolvimento enquanto você alternava entre seu IDE e developer.paypal.com ou seu painel de comerciante, então você voltava e era desconectado novamente.

**Resultado**: Os tempos limite da sessão ainda são de 60 segundos. O sistema de relatórios ainda falha regularmente.

### 2022: Recurso Principal da API Ausente (Novamente) {#2022-core-api-feature-missing-again}

Em janeiro de 2022, escalamos novamente o problema da listagem de assinaturas, desta vez com ainda mais detalhes sobre como a documentação deles estava errada:

> Não existe um GET que liste todas as assinaturas (anteriormente chamadas de acordos de cobrança)

Descobrimos que a documentação oficial deles estava completamente imprecisa:

> A documentação da API também está totalmente imprecisa. Pensamos que poderíamos fazer uma solução alternativa baixando uma lista codificada de IDs de assinaturas. Mas isso nem funciona!

> Nos documentos oficiais aqui... Diz que você pode fazer isso... Aqui está o problema - não há nenhum campo "ID da Assinatura" em lugar algum para ser marcado.

Christina Monti do PayPal respondeu:

> Pedimos desculpas pelas frustrações causadas por esses passos estarem errados, vamos corrigir isso esta semana.

Sri Shivananda (CTO) nos agradeceu:

> Obrigado pela sua ajuda contínua em nos tornar melhores. Muito apreciado.

**Resultado**: A documentação nunca foi corrigida. O endpoint de listagem de assinaturas nunca foi criado.


## O Pesadelo da Experiência do Desenvolvedor {#the-developer-experience-nightmare}

Trabalhar com as APIs do PayPal é como voltar no tempo 10 anos. Aqui estão os problemas técnicos que documentamos:

### Interface do Usuário Quebrada {#broken-user-interface}

O painel de desenvolvedor do PayPal é um desastre. Veja com o que lidamos diariamente:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  A interface do PayPal está tão quebrada que você nem consegue dispensar notificações
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Seu navegador não suporta a tag de vídeo.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  O painel do desenvolvedor literalmente faz você arrastar um controle deslizante e depois desconecta você após 60 segundos
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Seu navegador não suporta a tag de vídeo.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Mais desastres na interface do PayPal mostrando fluxos de trabalho quebrados
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Seu navegador não suporta a tag de vídeo.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  A interface de gerenciamento de assinaturas - a interface é tão ruim que tivemos que depender de código para gerar produtos e planos de assinatura
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="Captura de tela das assinaturas do PayPal" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Uma visão da interface de assinaturas quebrada com funcionalidades ausentes (você não pode criar produtos/planos/assinaturas facilmente – e parece não haver nenhuma forma de excluir produtos nem planos uma vez criados na interface)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="Captura de tela das assinaturas do PayPal 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Mensagens de erro típicas do PayPal - crípticas e pouco úteis
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problemas com o SDK {#sdk-problems}

* Não consegue lidar com pagamentos únicos e assinaturas sem soluções complexas envolvendo troca e re-renderização de botões enquanto recarrega o SDK com tags de script
* O SDK JavaScript viola convenções básicas (nomes de classes em minúsculas, sem verificação de instância)
* Mensagens de erro não indicam quais campos estão faltando
* Tipos de dados inconsistentes (exigindo valores em string ao invés de números)

### Violações da Política de Segurança de Conteúdo {#content-security-policy-violations}

O SDK deles requer unsafe-inline e unsafe-eval na sua CSP, **forçando você a comprometer a segurança do seu site**.

### Caos na Documentação {#documentation-chaos}

O próprio Mark Stuart admitiu:

> Concordo que há uma quantidade absurda de APIs legadas e novas. Realmente difícil encontrar o que procurar (mesmo para nós que trabalhamos aqui).

### Vulnerabilidades de Segurança {#security-vulnerabilities}

**A implementação de 2FA do PayPal é invertida**. Mesmo com apps TOTP ativados, eles forçam a verificação por SMS - tornando as contas vulneráveis a ataques de troca de SIM. Se você tem TOTP ativado, deveria usar isso exclusivamente. O fallback deveria ser email, não SMS.

### Desastre no Gerenciamento de Sessão {#session-management-disaster}

**O painel de desenvolvedor deles te desloga após 60 segundos de inatividade**. Tente fazer algo produtivo e você está constantemente passando por: login → captcha → 2FA → logout → repetir. Usando VPN? Boa sorte.

## Julho de 2025: A Gota d'Água {#july-2025-the-final-straw}

Após 11 anos dos mesmos problemas, o ponto de ruptura veio durante uma migração rotineira de conta. Precisávamos migrar para uma nova conta PayPal para coincidir com o nome da nossa empresa "Forward Email LLC" para uma contabilidade mais limpa.

O que deveria ser simples virou um desastre completo:

* Testes iniciais mostraram que tudo funcionava corretamente
* Horas depois, o PayPal bloqueou repentinamente todos os pagamentos de assinaturas sem aviso
* Clientes não conseguiam pagar, gerando confusão e sobrecarga no suporte
* O suporte do PayPal deu respostas contraditórias afirmando que as contas estavam verificadas
* Fomos forçados a parar completamente os pagamentos via PayPal

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  O erro que os clientes viram ao tentar pagar - sem explicação, sem registros, nada
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Suporte do PayPal afirmando que estava tudo bem enquanto os pagamentos estavam completamente quebrados. A mensagem final mostra eles dizendo que "restauraram algumas funcionalidades" mas ainda pedindo mais informações não especificadas - teatro clássico do suporte PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  O processo de verificação de identidade que supostamente "não resolveu" nada
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Mensagem vaga e ainda sem resolução. Zero informações, avisos ou qualquer coisa sobre quais informações adicionais são necessárias. O suporte ao cliente fica em silêncio.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Por Que Não Podemos Simplesmente Abandonar o PayPal {#why-we-cant-just-drop-paypal}

Apesar de todos esses problemas, não podemos abandonar completamente o PayPal porque alguns clientes só têm o PayPal como opção de pagamento. Como um cliente disse em nossa [página de status](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal é minha única opção de pagamento

**Estamos presos a suportar uma plataforma quebrada porque o PayPal criou um monopólio de pagamento para certos usuários.**


## A Solução da Comunidade {#the-community-workaround}

Como o PayPal não fornece funcionalidade básica de listagem de assinaturas, a comunidade de desenvolvedores criou soluções alternativas. Criamos um script que ajuda a gerenciar assinaturas do PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Este script referencia um [gist da comunidade](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) onde desenvolvedores compartilham soluções. Os usuários estão realmente [nos agradecendo](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) por fornecer o que o PayPal deveria ter criado anos atrás.


## Bloqueando Templates do PayPal Devido a Phishing {#blocking-paypal-templates-due-to-phishing}

Os problemas vão além das APIs. Os templates de email do PayPal são tão mal projetados que tivemos que implementar filtragem específica em nosso serviço de email porque eles são indistinguíveis de tentativas de phishing.

### O Verdadeiro Problema: Os Templates do PayPal Parecem Golpes {#the-real-problem-paypals-templates-look-like-scams}

Recebemos regularmente relatos de emails do PayPal que parecem exatamente tentativas de phishing. Aqui está um exemplo real dos nossos relatórios de abuso:

**Assunto:** `[Sandbox] TESTE - Nova fatura do PaypalBilling434567 sandbox #A4D369E8-0001`

Este email foi encaminhado para `abuse@microsoft.com` porque parecia ser uma tentativa de phishing. O problema? Na verdade, era do ambiente sandbox do PayPal, mas o design do template deles é tão ruim que aciona sistemas de detecção de phishing.

### Nossa Implementação {#our-implementation}

Você pode ver nossa filtragem específica para PayPal implementada em nosso [código de filtragem de email](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Por Que Tivemos Que Bloquear o PayPal {#why-we-had-to-block-paypal}

Implementamos isso porque o PayPal se recusou a corrigir enormes problemas de spam/phishing/fraude apesar dos nossos repetidos relatórios para suas equipes de abuso. Os tipos específicos de email que bloqueamos incluem:

* **RT000238** - Notificações suspeitas de fatura
* **PPC001017** - Confirmações de pagamento problemáticas
* **RT000542** - Tentativas de hack de mensagem de presente

### A Escala do Problema {#the-scale-of-the-problem}

Nossos logs de filtragem de spam mostram o enorme volume de spam de faturas do PayPal que processamos diariamente. Exemplos de assuntos bloqueados incluem:

* "Fatura da Equipe de Cobrança do PayPal:- Esta cobrança será debitada automaticamente da sua conta. Por favor, entre em contato imediatamente pelo \[PHONE]"
* "Fatura de \[COMPANY NAME] (\[ORDER-ID])"
* Várias variações com diferentes números de telefone e IDs de pedido falsos
Esses e-mails frequentemente vêm de hosts `outlook.com`, mas parecem originar-se dos sistemas legítimos do PayPal, tornando-os particularmente perigosos. Os e-mails passam pela autenticação SPF, DKIM e DMARC porque são enviados através da infraestrutura real do PayPal.

Nossos logs técnicos mostram que esses e-mails de spam contêm cabeçalhos legítimos do PayPal:

* `X-Email-Type-Id: RT000238` (o mesmo ID que bloqueamos)
* `From: "service@paypal.com" <service@paypal.com>`
* Assinaturas DKIM válidas de `paypal.com`
* Registros SPF adequados mostrando os servidores de e-mail do PayPal

Isso cria uma situação impossível: e-mails legítimos do PayPal e spam têm características técnicas idênticas.

### The Irony {#the-irony}

PayPal, uma empresa que deveria liderar a luta contra fraudes financeiras, possui modelos de e-mail tão mal projetados que acionam sistemas anti-phishing. Somos forçados a bloquear e-mails legítimos do PayPal porque eles são indistinguíveis de golpes.

Isso está documentado em pesquisas de segurança: [Cuidado com a nova fraude de endereço do PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – mostrando como os próprios sistemas do PayPal são explorados para fraudes.

### Real-World Impact: Novel PayPal Scams {#real-world-impact-novel-paypal-scams}

O problema vai além do design ruim dos modelos. O sistema de faturas do PayPal é tão facilmente explorado que golpistas o abusam regularmente para enviar faturas fraudulentas com aparência legítima. O pesquisador de segurança Gavin Anderegg documentou [Um Novo Golpe do PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) onde golpistas enviam faturas reais do PayPal que passam por todas as verificações de autenticação:

> "Inspecionando a origem, o e-mail parecia realmente ter vindo do PayPal (SPF, DKIM e DMARC todos aprovados). O botão também apontava para o que parecia ser uma URL legítima do PayPal... Demorou um segundo para eu perceber que era um e-mail legítimo. Eu acabara de receber uma 'fatura' aleatória de um golpista."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Captura de tela mostrando múltiplas faturas fraudulentas do PayPal inundando uma caixa de entrada, todas parecendo legítimas porque realmente vêm dos sistemas do PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

O pesquisador observou:

> "Também parece ser um recurso de conveniência que o PayPal deveria considerar restringir. Assumi imediatamente que isso era algum tipo de golpe e estava interessado apenas nos detalhes técnicos. Parece fácil demais de ser realizado, e me preocupo que outros possam cair nele."

Isso ilustra perfeitamente o problema: os próprios sistemas legítimos do PayPal são tão mal projetados que permitem fraudes enquanto simultaneamente fazem as comunicações legítimas parecerem suspeitas.

Para piorar, isso afetou nossa entregabilidade com o Yahoo, resultando em reclamações de clientes e horas de testes meticulosos e verificação de padrões.

## PayPal's Backwards KYC Process {#paypals-backwards-kyc-process}

Um dos aspectos mais frustrantes da plataforma do PayPal é sua abordagem invertida para conformidade e procedimentos de Conheça Seu Cliente (KYC). Diferente de todos os outros processadores de pagamento, o PayPal permite que desenvolvedores integrem suas APIs e comecem a coletar pagamentos em produção antes de completar a verificação adequada.

### How It Should Work {#how-it-should-work}

Todo processador de pagamento legítimo segue esta sequência lógica:

1. **Completar a verificação KYC primeiro**
2. **Aprovar a conta do comerciante**
3. **Fornecer acesso à API de produção**
4. **Permitir a coleta de pagamentos**

Isso protege tanto o processador de pagamento quanto o comerciante, garantindo conformidade antes que qualquer dinheiro seja movimentado.

### How PayPal Actually Works {#how-paypal-actually-works}

O processo do PayPal é completamente invertido:

1. **Fornecer acesso à API de produção imediatamente**
2. **Permitir a coleta de pagamentos por horas ou dias**
3. **De repente bloquear pagamentos sem aviso**
4. **Exigir documentação KYC após os clientes já serem afetados**
5. **Não fornecer nenhuma notificação ao comerciante**
6. **Deixar os clientes descobrirem o problema e reportá-lo**
### O Impacto no Mundo Real {#the-real-world-impact}

Esse processo invertido cria desastres para os negócios:

* **Clientes não conseguem completar compras** durante períodos de pico de vendas
* **Nenhum aviso prévio** de que a verificação é necessária
* **Nenhuma notificação por e-mail** quando pagamentos são bloqueados
* **Comerciantes descobrem problemas por clientes confusos**
* **Perda de receita** durante períodos críticos para o negócio
* **Dano à confiança do cliente** quando pagamentos falham misteriosamente

### O Desastre da Migração de Contas de Julho de 2025 {#the-july-2025-account-migration-disaster}

Esse cenário exato aconteceu durante nossa migração rotineira de contas em julho de 2025. O PayPal permitiu que os pagamentos funcionassem inicialmente, depois os bloqueou de repente sem qualquer notificação. Só descobrimos o problema quando os clientes começaram a relatar que não conseguiam pagar.

Quando entramos em contato com o suporte, recebemos respostas contraditórias sobre quais documentos eram necessários, sem um prazo claro para resolução. Isso nos forçou a interromper completamente os pagamentos via PayPal, confundindo clientes que não tinham outras opções de pagamento.

### Por Que Isso Importa {#why-this-matters}

A abordagem do PayPal para conformidade mostra um entendimento fundamentalmente equivocado de como os negócios operam. O KYC adequado deveria acontecer **antes** da integração em produção, não depois que os clientes já estão tentando pagar. A falta de comunicação proativa quando surgem problemas demonstra o distanciamento do PayPal das necessidades dos comerciantes.

Esse processo invertido é sintomático dos problemas organizacionais mais amplos do PayPal: eles priorizam seus processos internos em detrimento da experiência do comerciante e do cliente, levando a desastres operacionais que afastam os negócios da sua plataforma.


## Como Todos os Outros Processadores de Pagamento Fazem Certo {#how-every-other-payment-processor-does-it-right}

A funcionalidade de listagem de assinaturas que o PayPal se recusa a implementar é padrão na indústria há mais de uma década. Veja como outros processadores de pagamento lidam com esse requisito básico:

### Stripe {#stripe}

O Stripe tem listagem de assinaturas desde o lançamento da sua API. A documentação deles mostra claramente como recuperar todas as assinaturas de um cliente ou conta de comerciante. Isso é considerado funcionalidade CRUD básica.

### Paddle {#paddle}

O Paddle oferece APIs abrangentes de gerenciamento de assinaturas, incluindo listagem, filtragem e paginação. Eles entendem que os comerciantes precisam ver suas receitas recorrentes.

### Coinbase Commerce {#coinbase-commerce}

Até processadores de pagamento em criptomoedas como o Coinbase Commerce oferecem melhor gerenciamento de assinaturas do que o PayPal.

### Square {#square}

A API do Square inclui listagem de assinaturas como um recurso fundamental, não como um detalhe secundário.

### O Padrão da Indústria {#the-industry-standard}

Todo processador de pagamento moderno oferece:

* Listar todas as assinaturas
* Filtrar por status, data, cliente
* Paginação para grandes conjuntos de dados
* Notificações via webhook para mudanças nas assinaturas
* Documentação abrangente com exemplos funcionais

### O Que Outros Processadores Oferecem vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Listar Todas as Assinaturas:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Filtrar por Cliente:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrar por Status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - O Que Você Realmente Recebe:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Você pode obter APENAS UMA assinatura se já souber o ID
# NÃO existe endpoint para listar todas as assinaturas
# NÃO há como buscar ou filtrar
# Você deve rastrear todos os IDs de assinaturas por conta própria
```

**Endpoints Disponíveis do PayPal:**

* `POST /v1/billing/subscriptions` - Criar uma assinatura
* `GET /v1/billing/subscriptions/{id}` - Obter UMA assinatura (se souber o ID)
* `PATCH /v1/billing/subscriptions/{id}` - Atualizar uma assinatura
* `POST /v1/billing/subscriptions/{id}/cancel` - Cancelar assinatura
* `POST /v1/billing/subscriptions/{id}/suspend` - Suspender assinatura
**O que falta no PayPal:**

* ❌ Não há `GET /v1/billing/subscriptions` (listar todos)
* ❌ Sem funcionalidade de busca
* ❌ Sem filtro por status, cliente, data
* ❌ Sem suporte a paginação

O PayPal é o único grande processador de pagamentos que obriga os desenvolvedores a rastrear manualmente os IDs de assinaturas em seus próprios bancos de dados.


## A Encoberta Sistemática do PayPal: Silenciando 6 Milhões de Vozes {#paypals-systematic-cover-up-silencing-6-million-voices}

Em uma ação que encapsula perfeitamente a abordagem do PayPal para lidar com críticas, eles recentemente tiraram todo o fórum da comunidade do ar, silenciando efetivamente mais de 6 milhões de membros e apagando centenas de milhares de posts que documentavam suas falhas.

### A Grande Apagada {#the-great-erasure}

A Comunidade original do PayPal em `paypal-community.com` hospedava **6.003.558 membros** e continha centenas de milhares de posts, relatórios de bugs, reclamações e discussões sobre as falhas da API do PayPal. Isso representava mais de uma década de evidências documentadas dos problemas sistemáticos do PayPal.

Em 30 de junho de 2025, o PayPal silenciosamente tirou todo o fórum do ar. Todos os links `paypal-community.com` agora retornam erros 404. Isso não foi uma migração ou atualização.

### O Resgate de Terceiros {#the-third-party-rescue}

Felizmente, um serviço de terceiros em [ppl.lithium.com](https://ppl.lithium.com/) preservou parte do conteúdo, permitindo que acessemos as discussões que o PayPal tentou esconder. No entanto, essa preservação por terceiros é incompleta e pode desaparecer a qualquer momento.

Esse padrão de esconder evidências não é novo para o PayPal. Eles têm um histórico documentado de:

* Remover relatórios críticos de bugs da vista pública
* Descontinuar ferramentas para desenvolvedores sem aviso
* Mudar APIs sem documentação adequada
* Silenciar discussões da comunidade sobre suas falhas

A remoção do fórum representa a tentativa mais descarada até agora de esconder suas falhas sistemáticas do escrutínio público.


## O Desastre do Bug de Captura de 11 Anos: $1.899 e Contando {#the-11-year-capture-bug-disaster-1899-and-counting}

Enquanto o PayPal estava ocupado organizando sessões de feedback e fazendo promessas, seu sistema principal de processamento de pagamentos esteve fundamentalmente quebrado por mais de 11 anos. As evidências são devastadoras.

### A Perda de $1.899 do Forward Email {#forward-emails-1899-loss}

Em nossos sistemas de produção, descobrimos 108 pagamentos do PayPal totalizando **$1.899** que foram perdidos devido a falhas na captura do PayPal. Esses pagamentos mostram um padrão consistente:

* Webhooks `CHECKOUT.ORDER.APPROVED` foram recebidos
* A API de captura do PayPal retornou erros 404
* Pedidos ficaram inacessíveis pela API do PayPal

É impossível determinar se os clientes foram cobrados, pois o PayPal esconde completamente os logs de depuração após 14 dias e apaga todos os dados do painel para IDs de pedidos que não foram capturados.

Isso representa apenas um negócio. **As perdas coletivas entre milhares de comerciantes ao longo de mais de 11 anos provavelmente totalizam milhões de dólares.**

**Vamos repetir: as perdas coletivas entre milhares de comerciantes ao longo de mais de 11 anos provavelmente totalizam milhões de dólares.**

A única razão pela qual descobrimos isso é porque somos incrivelmente meticulosos e orientados por dados.

### O Relatório Original de 2013: Mais de 11 Anos de Negligência {#the-2013-original-report-11-years-of-negligence}

O relatório documentado mais antigo desse exato problema aparece no [Stack Overflow em novembro de 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arquivado](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Continuo recebendo erro 404 com a Rest API ao fazer uma captura"

O erro reportado em 2013 é **idêntico** ao que o Forward Email experimentou em 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "O ID do recurso solicitado não foi encontrado",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

A resposta da comunidade em 2013 foi reveladora:

> "Há um problema relatado no momento com a REST API. O PayPal está trabalhando nisso."
**Mais de 11 anos depois, eles ainda estão "trabalhando nisso."**

### A Confissão de 2016: PayPal Quebra Seu Próprio SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

Em 2016, o próprio repositório do PayPal no GitHub documentou [falhas massivas de captura](https://github.com/paypal/PayPal-PHP-SDK/issues/660) que afetavam seu SDK oficial para PHP. A escala era impressionante:

> "Desde 20/09/2016, todas as tentativas de captura do PayPal estão falhando com 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. Nada foi alterado entre 19/09 e 20/09 na integração da API. **100% das tentativas de captura desde 20/09 retornaram esse erro.**"

Um comerciante relatou:

> "Tive **mais de 1.400 tentativas de captura falhadas nas últimas 24 horas**, todas com a resposta de erro INVALID_RESOURCE_ID."

A resposta inicial do PayPal foi culpar o comerciante e encaminhá-lo ao suporte técnico. Só após enorme pressão eles admitiram a falha:

> "Tenho uma atualização dos nossos Desenvolvedores de Produto. Eles notaram nos cabeçalhos que estão sendo enviados que o PayPal-Request-ID está sendo enviado com 42 caracteres, mas **parece que uma mudança recente limitou esse ID a apenas 38 caracteres.**"

Essa confissão revela a negligência sistemática do PayPal:

1. **Eles fizeram mudanças quebrando funcionalidades sem documentação**
2. **Eles quebraram seu próprio SDK oficial**
3. **Culparam os comerciantes primeiro**
4. **Só admitiram a falha sob pressão**

Mesmo após "corrigir" o problema, comerciantes relataram:

> "Atualizei o SDK para a v1.7.4 e **o problema ainda está acontecendo.**"

### A Escalada de 2024: Ainda Quebrado {#the-2024-escalation-still-broken}

Relatos recentes da comunidade preservada do PayPal mostram que o problema na verdade piorou. Uma [discussão de setembro de 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arquivada](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) documenta os mesmos problemas exatos:

> "O problema só começou a aparecer há cerca de 2 semanas e não afeta todos os pedidos. **O mais comum parece ser 404s na captura.**"

O comerciante descreve o mesmo padrão que a Forward Email experimentou:

> "Após tentar capturar o pedido, o PayPal retorna um 404. Ao recuperar os Detalhes do Pedido: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Isso é sem qualquer vestígio de uma captura bem-sucedida do nosso lado.**"

### O Desastre da Confiabilidade dos Webhooks {#the-webhook-reliability-disaster}

Outra [discussão preservada da comunidade](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) revela que o sistema de webhooks do PayPal é fundamentalmente não confiável:

> "Teoricamente, deveria haver dois eventos (CHECKOUT.ORDER.APPROVED e PAYMENT.CAPTURE.COMPLETED) do evento Webhook. Na prática, **esses dois eventos raramente são recebidos imediatamente, PAYMENT.CAPTURE.COMPLETED na maioria das vezes não é recebido ou é recebido após algumas horas.**"

Para pagamentos de assinatura:

> "**'PAYMENT.SALE.COMPLETED' às vezes não foi recebido ou só chegou após algumas horas.**"

As perguntas do comerciante revelam a profundidade dos problemas de confiabilidade do PayPal:

1. **"Por que isso acontece?"** - O sistema de webhooks do PayPal é fundamentalmente quebrado
2. **"Se o status do pedido é 'COMPLETED', posso considerar que recebi o dinheiro?"** - Comerciantes não podem confiar nas respostas da API do PayPal
3. **"Por que 'Event Logs->Webhook Events' não encontra nenhum registro?"** - Até o próprio sistema de logs do PayPal não funciona

### O Padrão de Negligência Sistemática {#the-pattern-of-systematic-negligence}

As evidências abrangem mais de 11 anos e mostram um padrão claro:

* **2013**: "PayPal está trabalhando nisso"
* **2016**: PayPal admite mudança quebrando funcionalidades, fornece correção quebrada
* **2024**: Os mesmos erros exatos ainda ocorrem, afetando a Forward Email e inúmeros outros

Isso não é um bug - **isso é negligência sistemática.** O PayPal sabe dessas falhas críticas no processamento de pagamentos há mais de uma década e tem consistentemente:
1. **Culparam os comerciantes pelos bugs do PayPal**
2. **Fizeram mudanças disruptivas não documentadas**
3. **Forneceram correções inadequadas que não funcionam**
4. **Ignoraram o impacto financeiro nas empresas**
5. **Ocultaram evidências removendo fóruns da comunidade**

### O Requisito Não Documentado {#the-undocumented-requirement}

Em nenhum lugar da documentação oficial do PayPal eles mencionam que os comerciantes devem implementar lógica de retry para operações de captura. A documentação deles afirma que os comerciantes devem "capturar imediatamente após a aprovação", mas não menciona que a API deles retorna erros 404 aleatórios que exigem mecanismos complexos de retry.

Isso obriga todo comerciante a:

* Implementar lógica de retry com backoff exponencial
* Lidar com entrega inconsistente de webhooks
* Construir sistemas complexos de gerenciamento de estado
* Monitorar manualmente capturas falhas

**Todos os outros processadores de pagamento fornecem APIs de captura confiáveis que funcionam na primeira tentativa.**


## O Padrão Mais Amplo de Engano do PayPal {#paypals-broader-pattern-of-deception}

O desastre do bug de captura é apenas um exemplo da abordagem sistemática do PayPal para enganar clientes e esconder suas falhas.

### A Ação do Departamento de Serviços Financeiros de Nova York {#the-new-york-department-of-financial-services-action}

Em janeiro de 2025, o Departamento de Serviços Financeiros de Nova York emitiu uma [ação de fiscalização contra o PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) por práticas enganosas, demonstrando que o padrão de engano do PayPal vai muito além de suas APIs.

Essa ação regulatória mostra a disposição do PayPal em se envolver em práticas enganosas em todo o seu negócio, não apenas em suas ferramentas para desenvolvedores.

### O Processo Honey: Reescrevendo Links de Afiliados {#the-honey-lawsuit-rewriting-affiliate-links}

A aquisição da Honey pelo PayPal resultou em [processos alegando que a Honey reescreve links de afiliados](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), roubando comissões de criadores de conteúdo e influenciadores. Isso representa outra forma de engano sistemático onde o PayPal lucra redirecionando receitas que deveriam ir para outros.

O padrão é claro:

1. **Falhas na API**: Esconder funcionalidades quebradas, culpar comerciantes
2. **Silenciamento da comunidade**: Remover evidências dos problemas
3. **Violações regulatórias**: Envolver-se em práticas enganosas
4. **Roubo de afiliados**: Roubar comissões por manipulação técnica

### O Custo da Negligência do PayPal {#the-cost-of-paypals-negligence}

A perda de $1.899 da Forward Email representa apenas a ponta do iceberg. Considere o impacto mais amplo:

* **Comerciantes individuais**: Milhares perdendo centenas a milhares de dólares cada
* **Clientes empresariais**: Potencialmente milhões em receita perdida
* **Tempo de desenvolvedor**: Incontáveis horas construindo soluções alternativas para as APIs quebradas do PayPal
* **Confiança do cliente**: Empresas perdendo clientes devido a falhas nos pagamentos do PayPal

Se um pequeno serviço de email perdeu quase $2.000, e esse problema existe há mais de 11 anos afetando milhares de comerciantes, o dano financeiro coletivo provavelmente totaliza **centenas de milhões de dólares**.

### A Mentira da Documentação {#the-documentation-lie}

A documentação oficial do PayPal consistentemente não menciona as limitações críticas e bugs que os comerciantes irão encontrar. Por exemplo:

* **API de captura**: Nenhuma menção de que erros 404 são comuns e exigem lógica de retry
* **Confiabilidade do webhook**: Nenhuma menção de que webhooks frequentemente atrasam horas
* **Listagem de assinaturas**: A documentação implica que a listagem é possível quando não existe endpoint
* **Timeouts de sessão**: Nenhuma menção de timeouts agressivos de 60 segundos

Essa omissão sistemática de informações críticas força os comerciantes a descobrirem as limitações do PayPal por tentativa e erro em sistemas de produção, frequentemente resultando em perdas financeiras.


## O Que Isso Significa para os Desenvolvedores {#what-this-means-for-developers}

A falha sistemática do PayPal em atender às necessidades básicas dos desenvolvedores enquanto coleta extensos feedbacks mostra um problema organizacional fundamental. Eles tratam a coleta de feedback como um substituto para realmente corrigir os problemas.
O padrão é claro:

1. Desenvolvedores relatam problemas  
2. PayPal organiza sessões de feedback com executivos  
3. Feedback extenso é fornecido  
4. As equipes reconhecem as falhas e prometem "monitorar e resolver"  
5. Nada é implementado  
6. Executivos saem para empresas melhores  
7. Novas equipes pedem o mesmo feedback  
8. O ciclo se repete  

Enquanto isso, os desenvolvedores são forçados a criar soluções alternativas, comprometer a segurança e lidar com interfaces quebradas apenas para aceitar pagamentos.

Se você está construindo um sistema de pagamento, aprenda com nossa experiência: construa sua [abordagem trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) com múltiplos processadores, mas não espere que o PayPal forneça a funcionalidade básica que você precisa. Planeje criar soluções alternativas desde o primeiro dia.

> Esta postagem documenta nossa experiência de 11 anos com as APIs do PayPal na Forward Email. Todos os exemplos de código e links são dos nossos sistemas de produção reais. Continuamos a suportar pagamentos via PayPal apesar desses problemas porque alguns clientes não têm outra opção

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="Ilustração do desastre da API do PayPal" class="rounded-lg" />
