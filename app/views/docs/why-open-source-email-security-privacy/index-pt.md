# Por Que o Email Open-Source é o Futuro: A Vantagem do Forward Email {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Segurança e privacidade de email open source" class="rounded-lg" />


## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [A Vantagem do Open-Source: Mais do Que Apenas Marketing](#the-open-source-advantage-more-than-just-marketing)
  * [O Que Realmente Significa Ser Open-Source](#what-true-open-source-means)
  * [O Problema do Backend: Onde a Maioria dos Serviços de Email "Open-Source" Falham](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email: 100% Open-Source, Frontend E Backend](#forward-email-100-open-source-frontend-and-backend)
  * [Nossa Abordagem Técnica Única](#our-unique-technical-approach)
* [A Opção de Auto-Hospedagem: Liberdade de Escolha](#the-self-hosting-option-freedom-of-choice)
  * [Por Que Apoiamo a Auto-Hospedagem](#why-we-support-self-hosting)
  * [A Realidade da Auto-Hospedagem de Email](#the-reality-of-self-hosting-email)
* [Por Que Nosso Serviço Pago Faz Sentido (Mesmo Sendo Open-Source)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Comparação de Custos](#cost-comparison)
  * [O Melhor dos Dois Mundos](#the-best-of-both-worlds)
* [A Enganação do Código Fechado: O Que Proton e Tutanota Não Contam](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [As Alegações Open-Source do Proton Mail](#proton-mails-open-source-claims)
  * [A Abordagem Similar da Tutanota](#tutanotas-similar-approach)
  * [O Debate dos Guias de Privacidade](#the-privacy-guides-debate)
* [O Futuro é Open-Source](#the-future-is-open-source)
  * [Por Que o Open-Source Está Vencendo](#why-open-source-is-winning)
* [Fazendo a Mudança para o Forward Email](#making-the-switch-to-forward-email)
* [Conclusão: Email Open-Source para um Futuro Privado](#conclusion-open-source-email-for-a-private-future)


## Prefácio {#foreword}

Em uma era onde as preocupações com a privacidade digital estão em seu auge, os serviços de email que escolhemos importam mais do que nunca. Embora muitos provedores afirmem priorizar sua privacidade, há uma diferença fundamental entre aqueles que apenas falam sobre privacidade e aqueles que realmente a praticam. No Forward Email, construímos nosso serviço sobre uma base de total transparência por meio do desenvolvimento open-source—não apenas em nossas aplicações frontend, mas em toda a nossa infraestrutura.

Este post no blog explora por que as soluções de email open-source são superiores às alternativas de código fechado, como nossa abordagem difere de concorrentes como Proton Mail e Tutanota, e por que—apesar do nosso compromisso com opções de auto-hospedagem—nosso serviço pago oferece o melhor valor para a maioria dos usuários.


## A Vantagem do Open-Source: Mais do Que Apenas Marketing {#the-open-source-advantage-more-than-just-marketing}

O termo "open-source" se tornou um jargão popular de marketing nos últimos anos, com o mercado global de serviços open-source projetado para crescer a uma CAGR de mais de 16% entre 2024 e 2032\[^1]. Mas o que realmente significa ser open-source, e por que isso importa para a privacidade do seu email?

### O Que Realmente Significa Ser Open-Source {#what-true-open-source-means}

Software open-source disponibiliza todo o seu código-fonte gratuitamente para que qualquer pessoa possa inspecionar, modificar e aprimorar. Essa transparência cria um ambiente onde:

* Vulnerabilidades de segurança podem ser identificadas e corrigidas por uma comunidade global de desenvolvedores
* Alegações de privacidade podem ser verificadas por meio de revisão independente do código
* Usuários não ficam presos a ecossistemas proprietários
* A inovação acontece mais rápido por meio da melhoria colaborativa

Quando se trata de email—o alicerce da sua identidade online—essa transparência não é apenas desejável; é essencial para uma privacidade e segurança genuínas.

### O Problema do Backend: Onde a Maioria dos Serviços de Email "Open-Source" Falham {#the-backend-problem-where-most-open-source-email-services-fall-short}

Aqui é onde as coisas ficam interessantes. Muitos provedores populares de email "focados em privacidade" se anunciam como open-source, mas há uma distinção crítica que eles esperam que você não perceba: **eles só tornam open-source seus frontends enquanto mantêm seus backends fechados**.
O que isso significa? O frontend é o que você vê e com o qual interage—a interface web ou aplicativo móvel. O backend é onde o processamento real do email acontece—onde suas mensagens são armazenadas, criptografadas e transmitidas. Quando um provedor mantém seu backend fechado:

1. Você não pode verificar como seus emails estão realmente sendo processados
2. Você não pode confirmar se as alegações de privacidade são legítimas
3. Você está confiando em afirmações de marketing em vez de código verificável
4. Vulnerabilidades de segurança podem permanecer ocultas da análise pública

Como as discussões nos fóruns do Privacy Guides destacaram, tanto Proton Mail quanto Tutanota afirmam ser open-source, mas seus backends permanecem fechados e proprietários\[^2]. Isso cria uma lacuna significativa de confiança—você é solicitado a acreditar nas promessas de privacidade sem a capacidade de verificá-las.


## Forward Email: 100% Open-Source, Frontend E Backend {#forward-email-100-open-source-frontend-and-backend}

Na Forward Email, adotamos uma abordagem fundamentalmente diferente. Toda a nossa base de código—tanto frontend quanto backend—é open-source e disponível para qualquer pessoa inspecionar em <https://github.com/forwardemail/forwardemail.net>.

Isso significa:

1. **Transparência Completa**: Cada linha de código que processa seus emails está disponível para análise pública.
2. **Privacidade Verificável**: Nossas alegações de privacidade não são discurso de marketing—são fatos verificáveis que qualquer um pode confirmar examinando nosso código.
3. **Segurança Guiada pela Comunidade**: Nossa segurança é fortalecida pela expertise coletiva da comunidade global de desenvolvedores.
4. **Nenhuma Funcionalidade Oculta**: O que você vê é o que você obtém—sem rastreamento oculto, sem portas dos fundos secretas.

### Nossa Abordagem Técnica Única {#our-unique-technical-approach}

Nosso compromisso com a privacidade vai além de ser apenas open-source. Implementamos várias inovações técnicas que nos diferenciam:

#### Caixas de Correio SQLite Criptografadas Individualmente {#individually-encrypted-sqlite-mailboxes}

Ao contrário dos provedores tradicionais de email que usam bancos de dados relacionais compartilhados (onde uma única violação poderia expor os dados de todos os usuários), usamos arquivos SQLite criptografados individualmente para cada caixa de correio. Isso significa:

* Cada caixa de correio é um arquivo criptografado separado
* O acesso aos dados de um usuário não concede acesso aos de outros
* Nem mesmo nossos próprios funcionários podem acessar seus dados—é uma decisão central de design

Como explicamos nas discussões do Privacy Guides:

> "Bancos de dados relacionais compartilhados (ex.: MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, etc) todos requerem um login (com usuário/senha) para estabelecer a conexão com o banco de dados. Isso significa que qualquer pessoa com essa senha poderia consultar o banco de dados para qualquer coisa. Seja um funcionário mal-intencionado ou um ataque de camareira malvada. Isso também significa que ter acesso aos dados de um usuário significa que você também tem acesso aos dados de todos os outros. Por outro lado, o SQLite poderia ser considerado um banco de dados compartilhado, mas a forma como o usamos (cada caixa de correio = arquivo SQLite individual) o torna isolado."\[^3]

#### Criptografia Resistente a Computação Quântica {#quantum-resistant-encryption}

Enquanto outros provedores ainda estão se atualizando, nós já implementamos métodos de criptografia resistentes à computação quântica para proteger sua privacidade de email contra ameaças emergentes da computação quântica.

#### Sem Dependências de Terceiros {#no-third-party-dependencies}

Ao contrário dos concorrentes que dependem de serviços como Amazon SES para entrega de emails, construímos toda a nossa infraestrutura internamente. Isso elimina potenciais vazamentos de privacidade por meio de serviços de terceiros e nos dá controle total sobre toda a cadeia de email.


## A Opção de Auto-Hospedagem: Liberdade de Escolha {#the-self-hosting-option-freedom-of-choice}

Um dos aspectos mais poderosos do software open-source é a liberdade que ele proporciona. Com o Forward Email, você nunca fica preso—a plataforma inteira pode ser auto-hospedada se você desejar.

### Por Que Apoiamo a Auto-Hospedagem {#why-we-support-self-hosting}

Acreditamos em dar aos usuários controle completo sobre seus dados. Por isso, tornamos toda a nossa plataforma auto-hospedável com documentação abrangente e guias de configuração. Essa abordagem:

* Proporciona controle máximo para usuários com conhecimento técnico
* Elimina qualquer necessidade de confiar em nós como provedor de serviço
* Permite personalização para atender a requisitos específicos
* Garante que o serviço possa continuar mesmo se nossa empresa não continuar
### A Realidade de Hospedar Seu Próprio Email {#the-reality-of-self-hosting-email}

Embora a auto-hospedagem seja uma opção poderosa, é importante entender os custos reais envolvidos:

#### Custos Financeiros {#financial-costs}

* Custos de VPS ou servidor: $5-$50/mês para uma configuração básica\[^4]
* Registro e renovação de domínio: $10-20/ano
* Certificados SSL (embora o Let's Encrypt ofereça opções gratuitas)
* Custos potenciais para serviços de monitoramento e soluções de backup

#### Custos de Tempo {#time-costs}

* Configuração inicial: Várias horas a dias dependendo da expertise técnica
* Manutenção contínua: 5-10 horas/mês para atualizações, patches de segurança e resolução de problemas\[^5]
* Curva de aprendizado: Entender protocolos de email, melhores práticas de segurança e administração de servidores

#### Desafios Técnicos {#technical-challenges}

* Problemas de entregabilidade de email (mensagens sendo marcadas como spam)
* Acompanhar a evolução dos padrões de segurança
* Garantir alta disponibilidade e confiabilidade
* Gerenciar efetivamente o filtro de spam

Como disse um experiente auto-hospedeiro: "Email é um serviço de commodity... É mais barato hospedar meu email em \[um provedor] do que gastar dinheiro *e* tempo auto-hospedando."\[^6]


## Por Que Nosso Serviço Pago Faz Sentido (Mesmo Sendo Open-Source) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Diante dos desafios da auto-hospedagem, nosso serviço pago oferece o melhor dos dois mundos: a transparência e segurança do open-source com a conveniência e confiabilidade de um serviço gerenciado.

### Comparação de Custos {#cost-comparison}

Quando você considera tanto os custos financeiros quanto os de tempo, nosso serviço pago oferece um valor excepcional:

* **Custo total da auto-hospedagem**: $56-$252/mês (incluindo custos de servidor e valoração do tempo)
* **Planos pagos do Forward Email**: $3-$9/mês

Nosso serviço pago oferece:

* Gestão e manutenção profissional
* Reputação de IP estabelecida para melhor entregabilidade
* Atualizações regulares de segurança e monitoramento
* Suporte quando surgem problemas
* Todos os benefícios de privacidade da nossa abordagem open-source

### O Melhor dos Dois Mundos {#the-best-of-both-worlds}

Ao escolher o Forward Email, você obtém:

1. **Privacidade Verificável**: Nosso código open-source significa que você pode confiar em nossas declarações de privacidade
2. **Gestão Profissional**: Sem necessidade de se tornar um especialista em servidores de email
3. **Custo-Benefício**: Custo total menor que a auto-hospedagem
4. **Liberdade de Não Ficar Preso**: A opção de auto-hospedar sempre permanece disponível


## A Enganação do Código Fechado: O Que Proton e Tutanota Não Contam {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Vamos analisar mais de perto como nossa abordagem difere dos populares provedores de email "focados em privacidade".

### As Alegações Open-Source do Proton Mail {#proton-mails-open-source-claims}

O Proton Mail se anuncia como open-source, mas isso se aplica apenas às suas aplicações frontend. Seu backend — onde seus emails são realmente processados e armazenados — permanece fechado\[^7]. Isso significa:

* Você não pode verificar como seus emails estão sendo tratados
* Você deve confiar nas declarações de privacidade deles sem verificação
* Vulnerabilidades de segurança no backend permanecem ocultas da análise pública
* Você fica preso ao ecossistema deles sem opções de auto-hospedagem

### Abordagem Similar da Tutanota {#tutanotas-similar-approach}

Como o Proton Mail, a Tutanota só libera o código do frontend enquanto mantém o backend proprietário\[^8]. Eles enfrentam os mesmos problemas de confiança:

* Sem como verificar as declarações de privacidade do backend
* Transparência limitada no processamento real dos emails
* Possíveis problemas de segurança ocultos do público
* Bloqueio do fornecedor sem opção de auto-hospedagem

### O Debate no Privacy Guides {#the-privacy-guides-debate}

Essas limitações não passaram despercebidas na comunidade de privacidade. Em discussões no Privacy Guides, destacamos essa distinção crítica:

> "Afirma que tanto Protonmail quanto Tuta são código fechado. Porque o backend deles é de fato código fechado."\[^9]

Também afirmamos:

> "Não houve nenhuma auditoria pública compartilhada das infraestruturas backend de qualquer provedor de serviço de email listado atualmente no PG, nem trechos de código open-source compartilhados de como eles processam emails recebidos."\[^10]
Essa falta de transparência cria um problema fundamental de confiança. Sem backends open-source, os usuários são forçados a aceitar as alegações de privacidade pela fé, em vez de por verificação.


## O Futuro é Open-Source {#the-future-is-open-source}

A tendência para soluções open-source está acelerando em toda a indústria de software. De acordo com pesquisas recentes:

* O mercado de software open-source está crescendo de US$ 41,83 bilhões em 2024 para US$ 48,92 bilhões em 2025\[^11]
* 80% das empresas relatam aumento no uso de open-source no último ano\[^12]
* A adoção de open-source está projetada para continuar sua rápida expansão

Esse crescimento reflete uma mudança fundamental na forma como pensamos sobre segurança e privacidade de software. À medida que os usuários se tornam mais conscientes da privacidade, a demanda por privacidade verificável por meio de soluções open-source só aumentará.

### Por que o Open-Source está Vencendo {#why-open-source-is-winning}

As vantagens do open-source estão se tornando cada vez mais claras:

1. **Segurança Através da Transparência**: Código open-source pode ser revisado por milhares de especialistas, não apenas por uma equipe interna
2. **Inovação Mais Rápida**: Desenvolvimento colaborativo acelera melhorias
3. **Confiança Através da Verificação**: Alegações podem ser verificadas em vez de aceitas pela fé
4. **Liberdade do Aprisionamento ao Fornecedor**: Usuários mantêm controle sobre seus dados e serviços
5. **Suporte da Comunidade**: Uma comunidade global ajuda a identificar e corrigir problemas


## Fazendo a Troca para Forward Email {#making-the-switch-to-forward-email}

Migrar para o Forward Email é simples, seja vindo de um provedor popular como Gmail ou outro serviço focado em privacidade como Proton Mail ou Tutanota.

Nosso serviço oferece:

* Domínios e aliases ilimitados
* Suporte a protocolos padrão (SMTP, IMAP, POP3) sem pontes proprietárias
* Integração perfeita com clientes de email existentes
* Processo de configuração simples com documentação abrangente
* Planos de preços acessíveis a partir de apenas US$ 3/mês


## Conclusão: Email Open-Source para um Futuro Privado {#conclusion-open-source-email-for-a-private-future}

Em um mundo onde a privacidade digital está cada vez mais ameaçada, a transparência das soluções open-source oferece uma salvaguarda crucial. Na Forward Email, temos orgulho de liderar o caminho com nossa abordagem totalmente open-source para a privacidade do email.

Ao contrário dos concorrentes que apenas abraçam parcialmente o open-source, tornamos toda a nossa plataforma — frontend e backend — disponível para escrutínio público. Esse compromisso com a transparência, combinado com nossa abordagem técnica inovadora, oferece um nível de privacidade verificável que alternativas de código fechado simplesmente não conseguem igualar.

Seja escolhendo usar nosso serviço gerenciado ou hospedando nossa plataforma por conta própria, você se beneficia da segurança, privacidade e tranquilidade que vêm de um email verdadeiramente open-source.

O futuro do email é aberto, transparente e focado na privacidade. O futuro é Forward Email.

\[^1]: SNS Insider. "The Open Source Services Market was valued at USD 28.6 billion in 2023 and will reach to USD 114.8 Billion by 2032, growing at a CAGR of 16.70% by 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generally, you can expect to spend anywhere from $5 to $50 monthly for a basic virtual private server (VPS) to run your email server." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Maintenance took me maybe 16 hours in that period..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)
\[^6]: Reddit r/selfhosted. "Resumo: Como tudo que é self hosted, ISSO VAI EXIGIR SEU TEMPO. Se você não tem tempo para dedicar a isso, é sempre melhor optar por um serviço hospedado..." [Hospedar seu próprio servidor de email? Por que ou por que não? O que é popular?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "Proton Mail afirma ser open-source, mas seu back-end na verdade é código fechado." [Comparação Tutanota vs Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "Tutanota afirma ser open-source, mas seu back-end na verdade é código fechado." [Comparação Proton Mail vs Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "Afirma que tanto Protonmail quanto Tuta são código fechado. Porque seu backend é de fato código fechado." [Forward Email (provedor de email) - Desenvolvimento do Site / Sugestões de Ferramentas](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "Não houve nenhuma auditoria pública compartilhada das infraestruturas backend de qualquer provedor de serviço de email listado atualmente no PG, nem trechos de código open source compartilhados sobre como processam emails recebidos." [Forward Email (provedor de email) - Desenvolvimento do Site / Sugestões de Ferramentas](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "O mercado de software open source crescerá de USD 41,83 bilhões em 2024 para USD 48,92 bilhões em 2025 a uma taxa composta..." [O que é Software Open Source?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Com 80% das empresas relatando aumento na utilização de tecnologias open source no último ano, é..." [Tendências Emergentes nas Comunidades Open Source 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
