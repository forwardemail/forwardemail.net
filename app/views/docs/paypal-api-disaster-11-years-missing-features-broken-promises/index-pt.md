# Desastre de 11 anos da API do PayPal: como criamos soluções alternativas enquanto eles ignoravam os desenvolvedores {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Na Forward Email, lidamos com as APIs quebradas do PayPal há mais de uma década. O que começou como pequenas frustrações se transformou em um desastre completo, que nos forçou a criar nossas próprias soluções alternativas, bloquear os modelos de phishing e, por fim, interromper todos os pagamentos do PayPal durante uma migração crítica de conta.</p>
<p class="lead mt-3">Esta é a história de 11 anos em que o PayPal ignorou as necessidades básicas dos desenvolvedores enquanto tentávamos de tudo para fazer a plataforma deles funcionar.</p>

## Índice {#table-of-contents}

* [A peça que falta: nenhuma maneira de listar assinaturas](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: O Problema Surge](#2014-2017-the-problem-emerges)
* [2020: Damos a eles um feedback abrangente](#2020-we-give-them-extensive-feedback)
  * [Lista de feedback de 27 itens](#the-27-item-feedback-list)
  * [As equipes se envolveram, promessas foram feitas](#teams-got-involved-promises-were-made)
  * [O resultado? Nada.](#the-result-nothing)
* [O Êxodo Executivo: Como o PayPal Perdeu Toda a Memória Institucional](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nova liderança, mesmos problemas](#2025-new-leadership-same-problems)
  * [O novo CEO se envolve](#the-new-ceo-gets-involved)
  * [Resposta de Michelle Gill](#michelle-gills-response)
  * [Nossa resposta: Chega de reuniões](#our-response-no-more-meetings)
  * [A resposta de superengenharia de Marty Brodbeck](#marty-brodbecks-overengineering-response)
  * [A contradição do "Simple CRUD"](#the-simple-crud-contradiction)
  * [A desconexão se torna clara](#the-disconnect-becomes-clear)
* [Anos de relatórios de bugs que eles ignoraram](#years-of-bug-reports-they-ignored)
  * [2016: Primeiras reclamações sobre UI/UX](#2016-early-uiux-complaints)
  * [2021: Relatório de Bugs em E-mails Comerciais](#2021-business-email-bug-report)
  * [2021: Sugestões de melhorias na interface do usuário](#2021-ui-improvement-suggestions)
  * [2021: Falhas no ambiente Sandbox](#2021-sandbox-environment-failures)
  * [2021: Sistema de relatórios completamente quebrado](#2021-reports-system-completely-broken)
  * [2022: Recurso da API principal ausente (de novo)](#2022-core-api-feature-missing-again)
* [O pesadelo da experiência do desenvolvedor](#the-developer-experience-nightmare)
  * [Interface de usuário quebrada](#broken-user-interface)
  * [Problemas com o SDK](#sdk-problems)
  * [Violações da Política de Segurança de Conteúdo](#content-security-policy-violations)
  * [Caos na Documentação](#documentation-chaos)
  * [Vulnerabilidades de segurança](#security-vulnerabilities)
  * [Desastre de gerenciamento de sessão](#session-management-disaster)
* [Julho de 2025: A gota d'água](#july-2025-the-final-straw)
* [Por que não podemos simplesmente abandonar o PayPal](#why-we-cant-just-drop-paypal)
* [A solução alternativa da comunidade](#the-community-workaround)
* [Bloqueio de modelos do PayPal devido a phishing](#blocking-paypal-templates-due-to-phishing)
  * [O verdadeiro problema: os modelos do PayPal parecem golpes](#the-real-problem-paypals-templates-look-like-scams)
  * [Nossa Implementação](#our-implementation)
  * [Por que tivemos que bloquear o PayPal](#why-we-had-to-block-paypal)
  * [A escala do problema](#the-scale-of-the-problem)
  * [A Ironia](#the-irony)
  * [Impacto no mundo real: novos golpes do PayPal](#real-world-impact-novel-paypal-scams)
* [Processo KYC reverso do PayPal](#paypals-backwards-kyc-process)
  * [Como deveria funcionar](#how-it-should-work)
  * [Como o PayPal realmente funciona](#how-paypal-actually-works)
  * [O impacto no mundo real](#the-real-world-impact)
  * [O desastre da migração de contas de julho de 2025](#the-july-2025-account-migration-disaster)
  * [Por que isso é importante](#why-this-matters)
* [Como todos os outros processadores de pagamento fazem isso corretamente](#how-every-other-payment-processor-does-it-right)
  * [Listra](#stripe)
  * [Remo](#paddle)
  * [Comércio da Coinbase](#coinbase-commerce)
  * [Quadrado](#square)
  * [O padrão da indústria](#the-industry-standard)
  * [O que outros processadores fornecem em comparação ao PayPal](#what-other-processors-provide-vs-paypal)
* [O encobrimento sistemático do PayPal: silenciando 6 milhões de vozes](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [O Grande Apagamento](#the-great-erasure)
  * [O Resgate de Terceiros](#the-third-party-rescue)
* [O desastre do bug de captura de 11 anos: US$ 1.899 e contando](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Prejuízo de US$ 1.899 da Forward Email](#forward-emails-1899-loss)
  * [Relatório original de 2013: mais de 11 anos de negligência](#the-2013-original-report-11-years-of-negligence)
  * [Admissão de 2016: PayPal quebra seu próprio SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [A Escalada de 2024: Ainda Quebrada](#the-2024-escalation-still-broken)
  * [O desastre da confiabilidade do Webhook](#the-webhook-reliability-disaster)
  * [O Padrão de Negligência Sistemática](#the-pattern-of-systematic-negligence)
  * [A exigência de não documentado](#the-undocumented-requirement)
* [O padrão mais amplo de engano do PayPal](#paypals-broader-pattern-of-deception)
  * [Ação do Departamento de Serviços Financeiros de Nova York](#the-new-york-department-of-financial-services-action)
  * [O Processo do Mel: Reescrevendo Links de Afiliados](#the-honey-lawsuit-rewriting-affiliate-links)
  * [O custo da negligência do PayPal](#the-cost-of-paypals-negligence)
  * [A Mentira da Documentação](#the-documentation-lie)
* [O que isso significa para os desenvolvedores](#what-this-means-for-developers)

## A peça que falta: nenhuma maneira de listar assinaturas {#the-missing-piece-no-way-to-list-subscriptions}

O que nos deixa perplexos é que o PayPal oferece cobrança por assinatura desde 2014, mas nunca forneceu uma maneira para os comerciantes listarem suas próprias assinaturas.

Pense nisso por um segundo. Você pode criar assinaturas e cancelá-las se tiver o ID, mas não pode obter uma lista de todas as assinaturas ativas da sua conta. É como ter um banco de dados sem a instrução SELECT.

Precisamos disso para operações comerciais básicas:

* Suporte ao cliente (quando alguém envia um e-mail perguntando sobre sua assinatura)
* Relatórios financeiros e reconciliação
* Gerenciamento automatizado de cobranças
* Conformidade e auditoria

Mas e o PayPal? Eles simplesmente... nunca o criaram.

## 2014-2017: O Problema Surge {#2014-2017-the-problem-emerges}

O problema com a listagem de assinaturas apareceu pela primeira vez nos fóruns da comunidade do PayPal em 2017. Os desenvolvedores estavam fazendo a pergunta óbvia: "Como obtenho uma lista de todas as minhas assinaturas?"

A resposta do PayPal? Grilos.

Os membros da comunidade começaram a ficar frustrados:

> "Uma omissão muito estranha se um comerciante não consegue listar todos os Contratos ativos. Se o ID do Contrato for perdido, isso significa que somente o usuário pode cancelar ou suspender um contrato." - leafspider

> "+1. Já se passaram quase 3 anos." - laudukang (significa que o problema existe desde \~2014)

O [postagem original da comunidade](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) de 2017 mostra desenvolvedores implorando por essa funcionalidade básica. A resposta do PayPal foi arquivar o repositório onde as pessoas estavam relatando o problema.

## 2020: Damos a eles um feedback abrangente {#2020-we-give-them-extensive-feedback}

Em outubro de 2020, o PayPal entrou em contato conosco para uma sessão formal de feedback. Não foi um bate-papo casual: eles organizaram uma chamada de 45 minutos pelo Microsoft Teams com 8 executivos do PayPal, incluindo Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze e outros.

### Lista de feedback de 27 itens {#the-27-item-feedback-list}

Viemos preparados. Após 6 horas tentando integrar com as APIs, havíamos compilado 27 problemas específicos. Mark Stuart, da equipe do PayPal Checkout, disse:

> Olá, Nick, obrigado por compartilhar com todos hoje! Acho que isso será o catalisador para conseguirmos mais apoio e investimento para que nossa equipe resolva esses problemas. Tem sido difícil obter um feedback tão rico quanto o que você nos deixou até agora.

O feedback não foi teórico - veio de tentativas reais de integração:

1. **A geração do token de acesso não está funcionando**:

> A geração de tokens de acesso não está funcionando. Além disso, deveria haver mais do que apenas exemplos de cURL.

2. **Sem interface web para criação de assinaturas**:

> Como é possível criar assinaturas sem precisar usar o cURL? Parece que não existe uma interface web para isso (como a do Stripe).

Mark Stuart achou a questão do token de acesso particularmente preocupante:

> Normalmente não ouvimos falar de problemas relacionados à geração de tokens de acesso.

### Equipes se envolveram, promessas foram feitas {#teams-got-involved-promises-were-made}

À medida que descobrimos mais problemas, o PayPal continuou adicionando mais equipes à conversa. Darshan Raju, da equipe de UI de gerenciamento de assinaturas, se juntou a nós e disse:

> Reconheça a lacuna. Nós monitoraremos e corrigiremos isso. Agradecemos novamente o seu feedback!

A sessão foi descrita como buscando:

> relato sincero da sua experiência

para:

> tornar o PayPal o que ele deve ser para os desenvolvedores.

### O resultado? Nada. {#the-result-nothing}

Apesar da sessão formal de feedback, da extensa lista de 27 itens, do envolvimento de várias equipes e das promessas de:

> rastrear e endereçar

problemas, absolutamente nada foi corrigido.

## O Êxodo Executivo: Como o PayPal Perdeu Toda a Memória Institucional {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

É aqui que a coisa fica realmente interessante. Todas as pessoas que receberam nosso feedback de 2020 deixaram o PayPal:

**Mudanças na liderança:**

* [Dan Schulman (CEO por 9 anos) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (setembro de 2023)
* [Sri Shivananda (CTO que organizou o feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (janeiro de 2024)

**Líderes técnicos que fizeram promessas e depois saíram:**

* **Mark Stuart** (o feedback prometido seria "catalisador") → [Agora na Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (veterano de 18 anos no PayPal) → [CEO da MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global de Produtos de Consumo) → [Aposentado](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (um dos últimos remanescentes) → [Acabei de sair da Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (janeiro de 2025)

O PayPal se tornou uma porta giratória onde os executivos coletam feedback dos desenvolvedores, fazem promessas e depois partem para empresas melhores, como JPMorgan, Ripple e outras empresas de tecnologia financeira.

Isso explica por que a resposta ao problema do GitHub de 2025 parecia completamente desconectada do nosso feedback de 2020 - literalmente todos que receberam esse feedback deixaram o PayPal.

## 2025: Nova liderança, mesmos problemas {#2025-new-leadership-same-problems}

Avançando para 2025, o mesmo padrão se repete. Após anos sem progresso, a nova liderança do PayPal se mobiliza novamente.

### O novo CEO se envolve {#the-new-ceo-gets-involved}

Em 30 de junho de 2025, encaminhamos o caso diretamente para o novo CEO do PayPal, Alex Chriss. Sua resposta foi breve:

> Olá, Nick – Obrigado pelo contato e pelo feedback. Michelle (com cópia) está pronta para interagir e trabalhar com você nessa questão. Obrigado -A

### Resposta de Michelle Gill {#michelle-gills-response}

Michelle Gill, vice-presidente executiva e gerente geral de pequenas empresas e serviços financeiros, respondeu:

> Muito obrigado, Nick, por transferir o Alex para o modo CCO. Estamos investigando isso desde a sua postagem anterior. Ligaremos para você antes do final da semana. Você poderia me enviar seus dados de contato para que um dos meus colegas possa entrar em contato? Michelle

### Nossa resposta: Chega de reuniões {#our-response-no-more-meetings}

Recusamos outra reunião, explicando nossa frustração:

> Obrigado. No entanto, não sinto que atender uma ligação vá adiantar nada. Eis o porquê... Já atendi uma ligação no passado e não deu em nada. Perdi mais de 2 horas do meu tempo conversando com toda a equipe e a liderança e nada foi resolvido... Toneladas de e-mails trocados. Absolutamente nada feito. O feedback não deu em nada. Tentei por anos ser ouvido, e depois não deu em nada.

### Resposta de superengenharia de Marty Brodbeck {#marty-brodbecks-overengineering-response}

Então Marty Brodbeck, que lidera a engenharia de consumo no PayPal, entrou em contato:

> Olá, Nick, aqui é o Marty Brodbeck. Sou o responsável por toda a engenharia de consumo aqui no PayPal e tenho liderado o desenvolvimento da API da empresa. Você e eu podemos conversar sobre o problema que você está enfrentando e como podemos ajudar?

Quando explicamos a simples necessidade de um ponto de extremidade de listagem de assinaturas, sua resposta revelou o problema exato:

> Obrigado, Nick, estamos no processo de criação de uma única API de assinatura com SDK completo (suporta tratamento completo de erros, rastreamento de assinatura baseado em eventos e tempo de atividade robusto), onde o faturamento também é dividido como uma API separada para os comerciantes acessarem, em vez de ter que orquestrar vários endpoints para obter uma única resposta.

Esta é exatamente a abordagem errada. Não precisamos de meses de arquitetura complexa. Precisamos de um endpoint REST simples que liste assinaturas — algo que deveria existir desde 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### A contradição do "CRUD simples" {#the-simple-crud-contradiction}

Quando apontamos que essa era uma funcionalidade CRUD básica que deveria existir desde 2014, a resposta de Marty foi reveladora:

> Operações simples do Crud fazem parte da API principal, meu amigo, então não levará meses de desenvolvimento

O PayPal TypeScript SDK, que atualmente oferece suporte a apenas três endpoints após meses de desenvolvimento, juntamente com seu cronograma histórico, demonstra claramente que tais projetos exigem mais do que alguns meses para serem concluídos.

Esta resposta mostra que ele não entende sua própria API. Se "operações CRUD simples fazem parte da API principal", então onde está o endpoint de listagem de assinaturas? Respondemos:

> Se "operações CRUD simples fazem parte da API principal", então onde está o endpoint de listagem de assinaturas? Os desenvolvedores pedem essa "operação CRUD simples" desde 2014. Já se passaram 11 anos. Todos os outros processadores de pagamento têm essa funcionalidade básica desde o primeiro dia.

### A desconexão se torna clara {#the-disconnect-becomes-clear}

As trocas de 2025 com Alex Chriss, Michelle Gill e Marty Brodbeck mostram a mesma disfunção organizacional:

1. **A nova liderança não tem conhecimento das sessões de feedback anteriores**
2. **Eles propõem as mesmas soluções superdimensionadas**
3. **Eles não entendem as próprias limitações da API**
4. **Eles querem mais reuniões em vez de apenas resolver o problema**

Esse padrão explica por que as equipes do PayPal em 2025 parecem completamente desconectadas do amplo feedback fornecido em 2020: as pessoas que receberam esse feedback se foram, e a nova liderança está repetindo os mesmos erros.

## Anos de relatórios de bugs que eles ignoraram {#years-of-bug-reports-they-ignored}

Não reclamamos apenas da falta de recursos. Relatamos bugs ativamente e tentamos ajudar a melhorar. Aqui está um cronograma completo dos problemas que documentamos:

### 2016: Primeiras reclamações sobre UI/UX {#2016-early-uiux-complaints}

Já em 2016, entramos em contato publicamente com a liderança do PayPal, incluindo Dan Schulman, sobre problemas de interface e usabilidade. Isso aconteceu há 9 anos, e os mesmos problemas de UI/UX persistem até hoje.

### 2021: Relatório de bug de e-mail comercial {#2021-business-email-bug-report}

Em março de 2021, relatamos que o sistema de e-mail comercial do PayPal estava enviando notificações de cancelamento incorretas. O modelo de e-mail continha variáveis renderizadas incorretamente, exibindo mensagens confusas para os clientes.

Mark Stuart reconheceu o problema:

> Obrigado, Nick! Mudando para CCO. @Prasy, sua equipe é responsável por este e-mail ou sabe quem é? O "Niftylettuce, LLC, não cobraremos mais de você" me leva a crer que há uma confusão entre o destinatário e o conteúdo do e-mail.

**Resultado**: Eles realmente consertaram isso! Mark Stuart confirmou:

> Acabei de saber da equipe de notificações que o modelo de e-mail foi corrigido e implementado. Agradecemos por entrar em contato para relatar o problema. Obrigado!

Isso mostra que ELES PODEM consertar as coisas quando querem - eles apenas escolhem não fazer isso na maioria dos casos.

### 2021: Sugestões de melhoria da interface do usuário {#2021-ui-improvement-suggestions}

Em fevereiro de 2021, fornecemos feedback detalhado sobre a interface do usuário do painel, especificamente a seção "Atividade recente do PayPal":

> Acho que o painel do PayPal.com, especificamente "Atividade Recente do PayPal", precisa ser melhorado. Não acho que você deva mostrar as linhas de status "Criado" do pagamento recorrente de US$ 0 — isso só adiciona um monte de linhas extras e não dá para ver facilmente de relance quanto de receita está sendo gerada no dia/nos últimos dias.

Mark Stuart encaminhou para a equipe de produtos de consumo:

> Obrigado! Não sei qual equipe é responsável pela Atividade, mas encaminhei para o chefe de produtos de consumo para encontrar a equipe correta. Um pagamento recorrente de US$ 0,00 parece um bug. Provavelmente deveria ser filtrado.

**Resultado**: Nunca corrigido. A interface ainda mostra essas entradas inúteis de $0.

### 2021: Falhas no ambiente Sandbox {#2021-sandbox-environment-failures}

Em novembro de 2021, relatamos problemas críticos com o ambiente sandbox do PayPal:

* Chaves secretas da API do sandbox foram alteradas aleatoriamente e desabilitadas
* Todas as contas de teste do sandbox foram excluídas sem aviso prévio
* Mensagens de erro ao tentar visualizar os detalhes da conta do sandbox
* Falhas intermitentes no carregamento

> Por algum motivo, minha chave secreta da API do sandbox foi alterada e foi desativada. Além disso, todas as minhas contas de teste antigas do Sandbox foram excluídas.

> Às vezes eles carregam e às vezes não. Isso é extremamente frustrante.

**Resultado**: Sem resposta, sem solução. Os desenvolvedores ainda enfrentam problemas de confiabilidade no sandbox.

### 2021: Sistema de relatórios completamente quebrado {#2021-reports-system-completely-broken}

Em maio de 2021, relatamos que o sistema de download de relatórios de transações do PayPal estava completamente quebrado:

> Parece que os relatórios de downloads não estão funcionando agora e não funcionaram o dia todo. Provavelmente também receberei uma notificação por e-mail se falhar.

Também destacamos o desastre do gerenciamento de sessão:

> Além disso, se você ficar inativo enquanto estiver conectado ao PayPal por uns 5 minutos, será desconectado. Então, quando você atualiza o botão ao lado do relatório cujo status deseja verificar (depois de esperar uma eternidade), é uma pena ter que fazer login novamente.

Mark Stuart reconheceu o problema do tempo limite da sessão:

> Lembro que você relatou que no passado sua sessão expirava com frequência e interrompia seu fluxo de desenvolvimento enquanto você alternava entre seu IDE e developer.paypal.com ou seu painel de comerciante, então você voltava e era desconectado novamente.

**Resultado**: O tempo limite da sessão ainda é de 60 segundos. O sistema de relatórios ainda falha regularmente.

### 2022: Recurso da API principal ausente (novamente) {#2022-core-api-feature-missing-again}

Em janeiro de 2022, escalamos o problema da listagem de assinaturas novamente, desta vez com ainda mais detalhes sobre como a documentação estava errada:

> Não há GET que liste todas as assinaturas (anteriormente chamados de acordos de cobrança)

Descobrimos que a documentação oficial deles era completamente imprecisa:

> A documentação da API também é totalmente imprecisa. Pensamos que poderíamos contornar isso baixando uma lista codificada de IDs de assinatura. Mas isso nem funciona!

> Dos documentos oficiais aqui... Diz que você pode fazer isso... O problema é que não há nenhum campo "ID de assinatura" em lugar nenhum para ser marcado.

Christina Monti do PayPal respondeu:

> Pedimos desculpas pelas frustrações causadas por esses passos estarem errados. Vamos consertar isso esta semana.

Sri Shivananda (CTO) nos agradeceu:

> Obrigado pela sua ajuda contínua para nos tornarmos melhores. Muito apreciado.

**Resultado**: A documentação nunca foi corrigida. O ponto de extremidade da listagem de assinaturas nunca foi criado.

## O pesadelo da experiência do desenvolvedor {#the-developer-experience-nightmare}

Trabalhar com as APIs do PayPal é como voltar 10 anos no tempo. Aqui estão os problemas técnicos que documentamos:

### Interface de usuário quebrada {#broken-user-interface}

O painel de desenvolvedor do PayPal é um desastre. Veja o que enfrentamos diariamente:

<figure>
<figcaption><div class="alert alert-danger small text-center">
A interface do PayPal está tão quebrada que você nem consegue ignorar notificações.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Seu navegador não suporta a tag de vídeo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
O painel do desenvolvedor literalmente faz você arrastar um controle deslizante e, em seguida, desconecta você após 60 segundos.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Seu navegador não suporta a tag de vídeo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Mais desastres de interface na interface de desenvolvedor do PayPal, mostrando fluxos de trabalho quebrados.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Seu navegador não suporta a tag de vídeo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
A interface de gerenciamento de assinaturas - a interface é tão ruim que tivemos que recorrer a código para gerar produtos e planos de assinatura.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Uma visão da interface de assinatura quebrada e com funcionalidade ausente (você não consegue criar produtos/planos/assinaturas facilmente — e não parece haver nenhuma maneira de excluir produtos ou planos criados na interface)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Mensagens de erro típicas do PayPal - enigmáticas e inúteis
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problemas com o SDK {#sdk-problems}

* Não é possível processar pagamentos únicos e assinaturas sem soluções alternativas complexas que envolvam a troca e a renderização de botões ao recarregar o SDK com tags de script.
* O SDK JavaScript viola convenções básicas (nomes de classe em minúsculas, sem verificação de instância).
* As mensagens de erro não indicam quais campos estão faltando.
* Tipos de dados inconsistentes (exigindo valores em string em vez de números).

### Violações da Política de Segurança de Conteúdo {#content-security-policy-violations}

O SDK deles exige unsafe-inline e unsafe-eval no seu CSP, **forçando você a comprometer a segurança do seu site**.

### Documentação Caos {#documentation-chaos}

O próprio Mark Stuart admitiu:

> Concordo que há uma quantidade absurda de APIs antigas e novas. É muito difícil encontrar o que procurar (mesmo para nós que trabalhamos aqui).

### Vulnerabilidades de segurança {#security-vulnerabilities}

**A implementação de 2FA do PayPal é inversa**. Mesmo com aplicativos TOTP habilitados, eles forçam a verificação por SMS, tornando as contas vulneráveis a ataques de troca de SIM. Se você tiver o TOTP habilitado, ele deve usá-lo exclusivamente. A alternativa deve ser e-mail, não SMS.

### Desastre de gerenciamento de sessão {#session-management-disaster}

**O painel de desenvolvedor deles desconecta você após 60 segundos de inatividade**. Tente fazer algo produtivo e você estará constantemente passando por: login → captcha → 2FA → logout → repetir. Usando uma VPN? Boa sorte.

## Julho de 2025: A gota d'água {#july-2025-the-final-straw}

Após 11 anos com os mesmos problemas, o ponto crítico ocorreu durante uma migração de rotina de conta. Precisávamos migrar para uma nova conta do PayPal que correspondesse ao nome da nossa empresa, "Forward Email LLC", para uma contabilidade mais organizada.

O que deveria ter sido simples se transformou em um desastre completo:

* Os testes iniciais mostraram que tudo funcionou corretamente
* Horas depois, o PayPal bloqueou repentinamente todos os pagamentos de assinatura sem aviso prévio
* Os clientes não conseguiam pagar, criando confusão e sobrecarga de suporte
* O suporte do PayPal deu respostas contraditórias, alegando que as contas foram verificadas
* Fomos forçados a interromper completamente os pagamentos pelo PayPal

<figure>
<figcaption><div class="alert alert-danger small text-center">
O erro que os clientes viam ao tentar pagar - sem explicação, sem registros, nada
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
O suporte do PayPal alegou que estava tudo bem, enquanto os pagamentos estavam completamente interrompidos. A mensagem final mostra que eles disseram que "restauraram alguns recursos", mas ainda solicitam mais informações não especificadas - o clássico cenário de suporte do PayPal.
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
O processo de verificação de identidade que supostamente não "consertou" nada
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
Mensagem vaga e ainda sem resolução. Nenhuma informação, aviso ou qualquer informação adicional necessária. O suporte ao cliente fica em silêncio.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Por que não podemos simplesmente abandonar o PayPal {#why-we-cant-just-drop-paypal}

Apesar de todos esses problemas, não podemos abandonar completamente o PayPal, pois alguns clientes só o têm como opção de pagamento. Como disse um cliente em nosso [página de status](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> O PayPal é minha única opção de pagamento

**Estamos presos dando suporte a uma plataforma quebrada porque o PayPal criou um monopólio de pagamento para certos usuários.**

## Solução alternativa da comunidade {#the-community-workaround}

Como o PayPal não oferece a funcionalidade básica de listagem de assinaturas, a comunidade de desenvolvedores criou soluções alternativas. Criamos um script que ajuda a gerenciar assinaturas do PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Este script faz referência a um [essência da comunidade](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), onde desenvolvedores compartilham soluções. Os usuários são, na verdade, [agradecendo-nos](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) por fornecerem o que o PayPal deveria ter criado anos atrás.

## Bloqueio de modelos do PayPal devido a phishing {#blocking-paypal-templates-due-to-phishing}

Os problemas vão além das APIs. Os modelos de e-mail do PayPal são tão mal projetados que tivemos que implementar uma filtragem específica em nosso serviço de e-mail, pois são indistinguíveis de tentativas de phishing.

### O verdadeiro problema: os modelos do PayPal parecem golpes {#the-real-problem-paypals-templates-look-like-scams}

Recebemos regularmente relatos de e-mails do PayPal que se parecem exatamente com tentativas de phishing. Veja um exemplo real de nossos relatos de abuso:

**Assunto:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Este e-mail foi encaminhado para `abuse@microsoft.com` porque parecia ser uma tentativa de phishing. O problema? Na verdade, era do ambiente sandbox do PayPal, mas o design do modelo é tão ruim que aciona os sistemas de detecção de phishing.

### Nossa implementação {#our-implementation}

Você pode ver nossa filtragem específica do PayPal implementada em nosso [código de filtragem de e-mail](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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

### Por que tivemos que bloquear o PayPal {#why-we-had-to-block-paypal}

Implementamos isso porque o PayPal se recusou a corrigir grandes problemas de spam/phishing/fraude, apesar de nossos repetidos relatos às equipes de abuso. Os tipos específicos de e-mail que bloqueamos incluem:

* **RT000238** - Notificações de faturas suspeitas
* **PPC001017** - Confirmações de pagamento problemáticas
* **RT000542** - Tentativas de hacking de mensagens de presente

### A Escala do Problema {#the-scale-of-the-problem}

Nossos registros de filtragem de spam mostram o enorme volume de spam de faturas do PayPal que processamos diariamente. Exemplos de assuntos bloqueados incluem:

* "Fatura da Equipe de Cobrança do PayPal: Esta cobrança será debitada automaticamente da sua conta. Entre em contato conosco imediatamente pelo telefone \[TELEFONE]"
* "Fatura da \[NOME DA EMPRESA] (\[ID DO PEDIDO])"
* Diversas variações com números de telefone diferentes e IDs de pedidos falsos

Esses e-mails geralmente vêm de hosts `outlook.com`, mas parecem se originar dos sistemas legítimos do PayPal, o que os torna particularmente perigosos. Os e-mails passam pela autenticação SPF, DKIM e DMARC porque são enviados pela infraestrutura real do PayPal.

Nossos registros técnicos mostram que esses e-mails de spam contêm cabeçalhos legítimos do PayPal:

* `X-Email-Type-Id: RT000238` (o mesmo ID que bloqueamos)
* `From: "service@paypal.com" <service@paypal.com>`
* Assinaturas DKIM válidas de `paypal.com`
* Registros SPF adequados mostrando os servidores de e-mail do PayPal

Isso cria uma situação impossível: e-mails legítimos do PayPal e spam têm características técnicas idênticas.

### A Ironia {#the-irony}

O PayPal, uma empresa que deveria liderar o combate à fraude financeira, possui modelos de e-mail tão mal elaborados que acionam sistemas antiphishing. Somos forçados a bloquear e-mails legítimos do PayPal porque eles são indistinguíveis de golpes.

Isso está documentado na pesquisa de segurança: [Cuidado com a fraude de novos endereços do PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - mostrando como os próprios sistemas do PayPal são explorados para fraudes.

### Impacto no mundo real: novos golpes do PayPal {#real-world-impact-novel-paypal-scams}

O problema vai além do design ruim do modelo. O sistema de faturas do PayPal é tão facilmente explorado que golpistas o utilizam regularmente para enviar faturas fraudulentas com aparência legítima. O pesquisador de segurança Gavin Anderegg documentou o [Um novo golpe do PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), onde golpistas enviam faturas reais do PayPal que passam por todas as verificações de autenticação:

> "Ao verificar a fonte, o e-mail parecia ter vindo do PayPal (SPF, DKIM e DMARC foram aprovados). O botão também levava a um URL aparentemente legítimo do PayPal... Levei um segundo para perceber que era um e-mail legítimo. Eu tinha acabado de receber uma 'fatura' aleatória de um golpista."

<figure>
<figcaption><div class="alert alert-danger small text-center">
Captura de tela mostrando várias faturas fraudulentas do PayPal inundando uma caixa de entrada, todas parecendo legítimas porque, na verdade, vêm dos sistemas do PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

O pesquisador observou:

> "Também parece um recurso prático que o PayPal deveria considerar bloquear. Imediatamente presumi que se tratasse de algum tipo de golpe e só me interessei pelos detalhes técnicos. Parece fácil demais de aplicar, e me preocupo que outros possam cair nessa."

Isso ilustra perfeitamente o problema: os próprios sistemas legítimos do PayPal são tão mal projetados que permitem fraudes e, ao mesmo tempo, fazem com que comunicações legítimas pareçam suspeitas.

Para piorar a situação, isso afetou nossa entregabilidade com o Yahoo, resultando em reclamações de clientes e horas de testes meticulosos e verificação de padrões.

## Processo KYC reverso do PayPal {#paypals-backwards-kyc-process}

Um dos aspectos mais frustrantes da plataforma do PayPal é sua abordagem retrógrada em relação aos procedimentos de conformidade e Conheça Seu Cliente (KYC). Ao contrário de qualquer outro processador de pagamento, o PayPal permite que os desenvolvedores integrem suas APIs e comecem a receber pagamentos em produção antes mesmo de concluir a verificação adequada.

### Como deveria funcionar {#how-it-should-work}

Todo processador de pagamento legítimo segue esta sequência lógica:

1. **Conclua a verificação KYC primeiro**
2. **Aprove a conta do comerciante**
3. **Forneça acesso à API de produção**
4. **Permita a cobrança do pagamento**

Isso protege tanto o processador de pagamento quanto o comerciante, garantindo a conformidade antes que qualquer dinheiro mude de mãos.

### Como o PayPal realmente funciona {#how-paypal-actually-works}

O processo do PayPal é completamente inverso:

1. **Forneça acesso imediato à API de produção**
2. **Permita a cobrança por horas ou dias**
3. **Bloqueie pagamentos repentinamente sem aviso prévio**
4. **Exija a documentação KYC após os clientes já terem sido afetados**
5. **Não notifique o comerciante**
6. **Deixe os clientes descobrirem o problema e o reportarem**

### O impacto no mundo real {#the-real-world-impact}

Esse processo retrógrado cria desastres para as empresas:

* **Clientes não conseguem concluir compras** durante períodos de pico de vendas
* **Sem aviso prévio** de que a verificação é necessária
* **Sem notificações por e-mail** quando os pagamentos são bloqueados
* **Comerciantes aprendem sobre problemas com clientes confusos**
* **Perda de receita** durante períodos críticos de negócios
* **Confiança do cliente prejudicada** quando os pagamentos falham misteriosamente

### O desastre da migração de contas de julho de 2025 {#the-july-2025-account-migration-disaster}

Esse mesmo cenário ocorreu durante nossa migração de rotina de contas em julho de 2025. O PayPal permitiu que os pagamentos funcionassem inicialmente, mas, de repente, os bloqueou sem qualquer notificação. Só descobrimos o problema quando os clientes começaram a relatar que não conseguiam pagar.

Quando entramos em contato com o suporte, recebemos respostas contraditórias sobre qual documentação era necessária, sem um prazo claro para resolução. Isso nos forçou a interromper completamente os pagamentos via PayPal, confundindo os clientes que não tinham outras opções de pagamento.

### Por que isso é importante {#why-this-matters}

A abordagem do PayPal em relação à conformidade demonstra um mal-entendido fundamental sobre como as empresas operam. Um KYC adequado deve ocorrer **antes** da integração da produção, não depois que os clientes já estiverem tentando pagar. A falta de comunicação proativa quando surgem problemas demonstra a desconexão do PayPal com as necessidades dos comerciantes.

Esse processo retrógrado é sintomático dos problemas organizacionais mais amplos do PayPal: eles priorizam seus processos internos em detrimento da experiência do comerciante e do cliente, levando ao tipo de desastre operacional que afasta as empresas de sua plataforma.

## Como todos os outros processadores de pagamento fazem isso corretamente {#how-every-other-payment-processor-does-it-right}

A funcionalidade de listagem de assinaturas que o PayPal se recusa a implementar é padrão no setor há mais de uma década. Veja como outros processadores de pagamento lidam com esse requisito básico:

### Faixa {#stripe}

O Stripe oferece listagem de assinaturas desde o lançamento de sua API. A documentação mostra claramente como recuperar todas as assinaturas de uma conta de cliente ou comerciante. Isso é considerado uma funcionalidade CRUD básica.

### Remo {#paddle}

A Paddle oferece APIs abrangentes de gerenciamento de assinaturas, incluindo listagem, filtragem e paginação. Eles entendem que os comerciantes precisam visualizar seus fluxos de receita recorrentes.

### Coinbase Comércio {#coinbase-commerce}

Até mesmo processadores de pagamento com criptomoedas, como o Coinbase Commerce, oferecem melhor gerenciamento de assinaturas do que o PayPal.

### Quadrado {#square}

A API da Square inclui a listagem de assinaturas como um recurso fundamental, não algo secundário.

### O padrão da indústria {#the-industry-standard}

Todo processador de pagamento moderno fornece:

* Listar todas as assinaturas
* Filtrar por status, data e cliente
* Paginação para grandes conjuntos de dados
* Notificações via webhook para alterações de assinatura
* Documentação completa com exemplos práticos

### O que outros processadores fornecem em comparação ao PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Listar todas as assinaturas:**

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

**Stripe - Filtrar por cliente:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrar por status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - O que você realmente recebe:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**Pontos de extremidade disponíveis do PayPal:**

* `POST /v1/billing/subscriptions` - Criar uma assinatura
* `GET /v1/billing/subscriptions/{id}` - Obter UMA assinatura (se você souber o ID)
* `PATCH /v1/billing/subscriptions/{id}` - Atualizar uma assinatura
* `POST /v1/billing/subscriptions/{id}/cancel` - Cancelar assinatura
* `POST /v1/billing/subscriptions/{id}/suspend` - Suspender assinatura

**O que está faltando no PayPal:**

* ❌ Sem `GET /v1/billing/subscriptions` (listar todos)
* ❌ Sem funcionalidade de busca
* ❌ Sem filtragem por status, cliente, data
* ❌ Sem suporte para paginação

O PayPal é o único grande processador de pagamentos que obriga os desenvolvedores a rastrear manualmente os IDs de assinatura em seus próprios bancos de dados.

## O encobrimento sistemático do PayPal: silenciando 6 milhões de vozes {#paypals-systematic-cover-up-silencing-6-million-voices}

Em uma atitude que resume perfeitamente a abordagem do PayPal para lidar com críticas, eles recentemente tiraram todo o fórum da comunidade do ar, silenciando efetivamente mais de 6 milhões de membros e apagando centenas de milhares de postagens que documentavam suas falhas.

### O Grande Apagamento {#the-great-erasure}

A Comunidade original do PayPal em `paypal-community.com` contava com **6.003.558 membros** e continha centenas de milhares de postagens, relatórios de bugs, reclamações e discussões sobre falhas na API do PayPal. Isso representou mais de uma década de evidências documentadas dos problemas sistemáticos do PayPal.

Em 30 de junho de 2025, o PayPal silenciosamente tirou todo o fórum do ar. Todos os links `paypal-community.com` agora retornam erros 404. Não se tratava de uma migração ou atualização.

### O Resgate de Terceiros {#the-third-party-rescue}

Felizmente, um serviço terceirizado em [ppl.lithium.com](https://ppl.lithium.com/) preservou parte do conteúdo, permitindo-nos acessar as discussões que o PayPal tentou ocultar. No entanto, essa preservação terceirizada está incompleta e pode desaparecer a qualquer momento.

Esse padrão de ocultação de evidências não é novidade para o PayPal. Eles têm um histórico documentado de:

* Remover relatórios de bugs críticos da visualização pública
* Descontinuar ferramentas para desenvolvedores sem aviso prévio
* Alterar APIs sem a documentação adequada
* Silenciar as discussões da comunidade sobre suas falhas

A remoção do fórum representa a tentativa mais descarada até agora de esconder suas falhas sistemáticas do escrutínio público.

## O desastre do bug de captura de 11 anos: US$ 1.899 e contando {#the-11-year-capture-bug-disaster-1899-and-counting}

Enquanto o PayPal se ocupava organizando sessões de feedback e fazendo promessas, seu sistema central de processamento de pagamentos está fundamentalmente quebrado há mais de 11 anos. As evidências são devastadoras.

### Perda de US$ 1.899 do e-mail encaminhado {#forward-emails-1899-loss}

Em nossos sistemas de produção, descobrimos 108 pagamentos do PayPal, totalizando **US$ 1.899**, perdidos devido a falhas de captura do PayPal. Esses pagamentos apresentam um padrão consistente:

* `CHECKOUT.ORDER.APPROVED` webhooks foram recebidos
* A API de captura do PayPal retornou erros 404
* Os pedidos ficaram inacessíveis pela API do PayPal

É impossível determinar se os clientes foram cobrados, pois o PayPal oculta completamente os logs de depuração após 14 dias e apaga todos os dados do painel para IDs de pedidos que não foram capturados.

Isso representa apenas um negócio. **As perdas coletivas de milhares de comerciantes ao longo de mais de 11 anos provavelmente somam milhões de dólares.**

**Vamos repetir: as perdas coletivas de milhares de comerciantes ao longo de mais de 11 anos provavelmente totalizam milhões de dólares.**

A única razão pela qual descobrimos isso é porque somos incrivelmente meticulosos e orientados por dados.

### Relatório original de 2013: mais de 11 anos de negligência {#the-2013-original-report-11-years-of-negligence}

O primeiro relatório documentado sobre esse problema exato aparece em [Stack Overflow em novembro de 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arquivado](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Continuar recebendo erro 404 com REST API ao fazer uma captura"

O erro relatado em 2013 é **idêntico** ao que o Forward Email experimentou em 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

A resposta da comunidade em 2013 foi reveladora:

> "Há um problema relatado no momento com a API REST. O PayPal está trabalhando nisso."

**Mais de 11 anos depois, eles ainda estão "trabalhando nisso".**

### Admissão de 2016: PayPal quebra seu próprio SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

Em 2016, o próprio repositório GitHub do PayPal documentou o [falhas massivas de captura](https://github.com/paypal/PayPal-PHP-SDK/issues/660) afetando seu SDK PHP oficial. A escala foi impressionante:

> "Desde 20/09/2016, todas as tentativas de captura do PayPal têm falhado com o erro 'INVALID_RESOURCE_ID - ID do recurso solicitado não encontrado'. Nada foi alterado entre 19 e 20/09 na integração da API. **100% das tentativas de captura desde 20/09 retornaram este erro.**"

Um comerciante relatou:

> "Tive **mais de 1.400 tentativas de captura com falha nas últimas 24 horas**, todas com a resposta de erro INVALID_RESOURCE_ID."

A resposta inicial do PayPal foi culpar o comerciante e encaminhá-lo ao suporte técnico. Somente após muita pressão, eles admitiram a culpa:

> "Recebi uma atualização dos nossos Desenvolvedores de Produto. Eles notaram nos cabeçalhos enviados que o ID da Solicitação do PayPal está sendo enviado com 42 caracteres, mas **parece que houve uma alteração recente que limita esse ID a apenas 38 caracteres.**"

Esta admissão revela a negligência sistemática do PayPal:

1. **Eles fizeram alterações drásticas não documentadas**
2. **Eles quebraram seu próprio SDK oficial**
3. **Eles culparam os comerciantes primeiro**
4. **Eles só admitiram a culpa sob pressão**

Mesmo depois de "consertar" o problema, os comerciantes relataram:

> "Atualizei o SDK para a v1.7.4 e **o problema ainda persiste.**"

### A Escalada de 2024: Ainda Quebrada {#the-2024-escalation-still-broken}

Relatórios recentes da comunidade preservada do PayPal mostram que o problema, na verdade, piorou. Um [Discussão de setembro de 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arquivado](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) documenta exatamente os mesmos problemas:

> "O problema só começou a aparecer há cerca de 2 semanas e não afeta todos os pedidos. **O mais comum parece ser o erro 404 na captura.**"

O comerciante descreve o mesmo padrão que o encaminhamento de e-mail experimentou:

> "Após tentar capturar o pedido, o PayPal retorna um erro 404. Ao recuperar os Detalhes do Pedido: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Isso não deixa nenhum vestígio de uma captura bem-sucedida da nossa parte.**"

### O desastre de confiabilidade do Webhook {#the-webhook-reliability-disaster}

Outro [discussão comunitária preservada](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) revela que o sistema webhook do PayPal é fundamentalmente não confiável:

> "Teoricamente, deveria haver dois eventos (CHECKOUT.ORDER.APPROVED e PAYMENT.CAPTURE.COMPLETED) do evento Webhook. Na verdade, **esses dois eventos raramente são recebidos imediatamente. PAYMENT.CAPTURE.COMPLETED não pode ser recebido na maioria das vezes ou seria recebido em algumas horas.**"

Para pagamentos de assinatura:

> "**'PAGAMENTO.VENDA.CONCLUÍDO' não foi recebido algumas vezes ou até em poucas horas.**"

As perguntas do comerciante revelam a profundidade dos problemas de confiabilidade do PayPal:

1. **"Por que isso acontece?"** - O sistema de webhook do PayPal está fundamentalmente quebrado
2. **"Se o status do pedido for 'CONCLUÍDO', posso considerar que recebi o dinheiro?"** - Os comerciantes não podem confiar nas respostas da API do PayPal
3. **"Por que 'Logs de Eventos->Eventos de Webhook' não consegue encontrar nenhum log?"** - Nem mesmo o próprio sistema de log do PayPal funciona

### O Padrão de Negligência Sistemática {#the-pattern-of-systematic-negligence}

As evidências abrangem mais de 11 anos e mostram um padrão claro:

* **2013**: "O PayPal está trabalhando nisso"
* **2016**: O PayPal admite uma mudança drástica e fornece uma correção para o problema
* **2024**: Os mesmos erros continuam ocorrendo, afetando o Forward Email e inúmeros outros

Isso não é um bug - **isso é negligência sistemática.** O PayPal sabe dessas falhas críticas de processamento de pagamentos há mais de uma década e consistentemente:

1. **Culpou os comerciantes pelos bugs do PayPal**
2. **Fez alterações drásticas não documentadas**
3. **Forneceu correções inadequadas que não funcionaram**
4. **Ignorou o impacto financeiro nas empresas**
5. **Ocultou evidências ao remover fóruns da comunidade**

### O Requisito Não Documentado {#the-undocumented-requirement}

Em nenhum lugar da documentação oficial do PayPal eles mencionam que os comerciantes devem implementar lógica de repetição para operações de captura. A documentação afirma que os comerciantes devem "capturar imediatamente após a aprovação", mas não menciona que sua API retorna aleatoriamente erros 404, exigindo mecanismos complexos de repetição.

Isso obriga cada comerciante a:

* Implementar lógica de repetição de backoff exponencial
* Lidar com entrega inconsistente de webhook
* Construir sistemas complexos de gerenciamento de estado
* Monitorar capturas com falha manualmente

**Todos os outros processadores de pagamento fornecem APIs de captura confiáveis que funcionam na primeira vez.**

## Padrão mais amplo de engano do PayPal {#paypals-broader-pattern-of-deception}

O desastre do bug de captura é apenas um exemplo da abordagem sistemática do PayPal para enganar clientes e esconder suas falhas.

### Ação do Departamento de Serviços Financeiros de Nova York {#the-new-york-department-of-financial-services-action}

Em janeiro de 2025, o Departamento de Serviços Financeiros de Nova York emitiu um [ação de execução contra o PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) por práticas enganosas, demonstrando que o padrão de engano do PayPal se estende muito além de suas APIs.

Essa ação regulatória mostra a disposição do PayPal de se envolver em práticas enganosas em todo o seu negócio, não apenas em suas ferramentas de desenvolvedor.

### O processo do mel: reescrevendo links de afiliados {#the-honey-lawsuit-rewriting-affiliate-links}

A aquisição da Honey pelo PayPal resultou em [ações judiciais alegando que Honey reescreve links de afiliados](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), roubando comissões de criadores de conteúdo e influenciadores. Isso representa outra forma de fraude sistemática, na qual o PayPal lucra redirecionando receitas que deveriam ser destinadas a terceiros.

O padrão é claro:

1. **Falhas de API**: Ocultar funcionalidades quebradas e culpar os comerciantes
2. **Silenciamento da comunidade**: Remover evidências de problemas
3. **Violações regulatórias**: Envolver-se em práticas enganosas
4. **Roubo de afiliados**: Roubar comissões por meio de manipulação técnica

### O custo da negligência do PayPal {#the-cost-of-paypals-negligence}

O prejuízo de US$ 1.899 da Forward Email representa apenas a ponta do iceberg. Considere o impacto mais amplo:

* **Comerciantes individuais**: Milhares perdendo centenas a milhares de dólares cada
* **Clientes corporativos**: Potencialmente milhões em receita perdida
* **Tempo do desenvolvedor**: Inúmeras horas criando soluções alternativas para as APIs quebradas do PayPal
* **Confiança do cliente**: Empresas perdendo clientes devido a falhas de pagamento do PayPal

Se um pequeno serviço de e-mail perdeu quase US$ 2.000, e esse problema existe há mais de 11 anos, afetando milhares de comerciantes, o prejuízo financeiro coletivo provavelmente totaliza **centenas de milhões de dólares**.

### A documentação está disponível {#the-documentation-lie}

A documentação oficial do PayPal frequentemente não menciona as limitações e bugs críticos que os comerciantes encontrarão. Por exemplo:

* **API de Captura**: Não há menção de que erros 404 são comuns e exigem lógica de repetição
* **Confiabilidade do Webhook**: Não há menção de que os webhooks costumam atrasar horas
* **Listagem de assinaturas**: A documentação sugere que a listagem é possível mesmo quando não há endpoint
* **Tempos limite de sessão**: Não há menção de tempos limite agressivos de 60 segundos

Essa omissão sistemática de informações críticas força os comerciantes a descobrir as limitações do PayPal por meio de tentativa e erro nos sistemas de produção, o que geralmente resulta em perdas financeiras.

## O que isso significa para os desenvolvedores {#what-this-means-for-developers}

A falha sistemática do PayPal em atender às necessidades básicas dos desenvolvedores, ao mesmo tempo em que coleta feedback extensivo, demonstra um problema organizacional fundamental. Eles tratam a coleta de feedback como um substituto para a solução efetiva dos problemas.

O padrão é claro:

1. Desenvolvedores relatam problemas
2. PayPal organiza sessões de feedback com executivos
3. Feedback abrangente é fornecido
4. Equipes reconhecem lacunas e prometem "monitorar e corrigir"
5. Nada é implementado
6. Executivos saem para empresas melhores
7. Novas equipes pedem o mesmo feedback
8. O ciclo se repete

Enquanto isso, os desenvolvedores são forçados a criar soluções alternativas, comprometer a segurança e lidar com interfaces de usuário quebradas apenas para aceitar pagamentos.

Se você está construindo um sistema de pagamento, aprenda com a nossa experiência: construa seu [abordagem trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) com múltiplos processadores, mas não espere que o PayPal forneça a funcionalidade básica que você precisa. Planeje construir soluções alternativas desde o primeiro dia.

> Esta publicação documenta nossa experiência de 11 anos com as APIs do PayPal na Forward Email. Todos os exemplos de código e links são de nossos sistemas de produção. Continuamos a oferecer suporte aos pagamentos do PayPal, apesar desses problemas, porque alguns clientes não têm outra opção.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />