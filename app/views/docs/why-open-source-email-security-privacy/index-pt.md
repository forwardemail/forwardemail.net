# Por que o e-mail de código aberto é o futuro: a vantagem do e-mail de encaminhamento {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />

## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [A vantagem do código aberto: mais do que apenas marketing](#the-open-source-advantage-more-than-just-marketing)
  * [O que significa verdadeiro código aberto](#what-true-open-source-means)
  * [O problema do backend: onde a maioria dos serviços de e-mail de "código aberto" falham](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Encaminhamento de e-mail: 100% código aberto, front-end e back-end](#forward-email-100-open-source-frontend-and-backend)
  * [Nossa abordagem técnica exclusiva](#our-unique-technical-approach)
* [A opção de auto-hospedagem: liberdade de escolha](#the-self-hosting-option-freedom-of-choice)
  * [Por que apoiamos a auto-hospedagem](#why-we-support-self-hosting)
  * [A realidade da auto-hospedagem de e-mail](#the-reality-of-self-hosting-email)
* [Por que nosso serviço pago faz sentido (mesmo sendo de código aberto)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Comparação de custos](#cost-comparison)
  * [O melhor dos dois mundos](#the-best-of-both-worlds)
* [A farsa do código fechado: o que Proton e Tutanota não lhe contam](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Alegações de código aberto do Proton Mail](#proton-mails-open-source-claims)
  * [Abordagem semelhante de Tutanota](#tutanotas-similar-approach)
  * [O debate sobre os guias de privacidade](#the-privacy-guides-debate)
* [O futuro é de código aberto](#the-future-is-open-source)
  * [Por que o código aberto está ganhando](#why-open-source-is-winning)
* [Mudando para encaminhar e-mail](#making-the-switch-to-forward-email)
* [Conclusão: E-mail de código aberto para um futuro privado](#conclusion-open-source-email-for-a-private-future)

## Prefácio {#foreword}

Em uma era em que as preocupações com a privacidade digital estão em alta, os serviços de e-mail que escolhemos importam mais do que nunca. Embora muitos provedores afirmem priorizar sua privacidade, há uma diferença fundamental entre aqueles que apenas falam sobre privacidade e aqueles que realmente a colocam em prática. Na Forward Email, construímos nosso serviço com base em total transparência por meio do desenvolvimento de código aberto — não apenas em nossos aplicativos front-end, mas em toda a nossa infraestrutura.

Esta postagem do blog explora por que as soluções de e-mail de código aberto são superiores às alternativas de código fechado, como nossa abordagem difere de concorrentes como Proton Mail e Tutanota e por que — apesar do nosso compromisso com opções de auto-hospedagem — nosso serviço pago oferece o melhor valor para a maioria dos usuários.

## A vantagem do código aberto: mais do que apenas marketing {#the-open-source-advantage-more-than-just-marketing}

O termo "código aberto" tornou-se um termo popular de marketing nos últimos anos, com o mercado global de serviços de código aberto projetado para crescer a uma taxa composta de crescimento anual (CAGR) de mais de 16% entre 2024 e 2032. Mas o que significa ser verdadeiramente de código aberto e por que isso importa para a privacidade do seu e-mail?

### O que significa verdadeiro código aberto {#what-true-open-source-means}

O software de código aberto disponibiliza todo o seu código-fonte gratuitamente para que qualquer pessoa possa inspecionar, modificar e aprimorar. Essa transparência cria um ambiente onde:

* Vulnerabilidades de segurança podem ser identificadas e corrigidas por uma comunidade global de desenvolvedores
* Declarações de privacidade podem ser verificadas por meio de revisão de código independente
* Usuários não ficam presos a ecossistemas proprietários
* A inovação acontece mais rapidamente por meio da melhoria colaborativa

Quando se trata de e-mail, a espinha dorsal da sua identidade online, essa transparência não é apenas algo bom de se ter; é essencial para privacidade e segurança genuínas.

### O problema do backend: onde a maioria dos serviços de e-mail de "código aberto" falham {#the-backend-problem-where-most-open-source-email-services-fall-short}

É aqui que as coisas ficam interessantes. Muitos provedores de e-mail populares "focados em privacidade" se anunciam como de código aberto, mas há uma distinção crucial que eles esperam que você não perceba: **eles apenas disponibilizam seus frontends de código aberto, mantendo seus backends fechados**.

O que isso significa? O frontend é o que você vê e com o qual interage — a interface web ou o aplicativo móvel. O backend é onde o processamento de e-mails acontece — onde suas mensagens são armazenadas, criptografadas e transmitidas. Quando um provedor mantém seu backend de código fechado:

1. Você não pode verificar como seus e-mails estão sendo realmente processados
2. Você não pode confirmar se as alegações de privacidade são legítimas
3. Você está confiando em alegações de marketing em vez de códigos verificáveis
4. Vulnerabilidades de segurança podem permanecer ocultas do escrutínio público

Como destacado em discussões nos fóruns do Privacy Guides, tanto o Proton Mail quanto o Tutanota afirmam ser de código aberto, mas seus backends permanecem fechados e proprietários. Isso cria uma lacuna de confiança significativa — você é solicitado a acreditar nas promessas de privacidade deles sem a possibilidade de verificá-las.

## Encaminhar e-mail: 100% código aberto, front-end e back-end {#forward-email-100-open-source-frontend-and-backend}

Na Forward Email, adotamos uma abordagem fundamentalmente diferente. Toda a nossa base de código — tanto o front-end quanto o back-end — é de código aberto e está disponível para qualquer pessoa inspecionar em <https://github.com/forwardemail/forwardemail.net>.

Isso significa:

1. **Transparência total**: Cada linha de código que processa seus e-mails está disponível para análise pública.
2. **Privacidade verificável**: Nossas declarações de privacidade não são apenas marketing — são fatos verificáveis que qualquer pessoa pode confirmar examinando nosso código.
3. **Segurança orientada pela comunidade**: Nossa segurança é reforçada pela expertise coletiva da comunidade global de desenvolvedores.
4. **Sem funcionalidades ocultas**: O que você vê é o que você obtém — sem rastreamento oculto, sem backdoors secretos.

### Nossa abordagem técnica exclusiva {#our-unique-technical-approach}

Nosso compromisso com a privacidade vai além do código aberto. Implementamos diversas inovações técnicas que nos diferenciam:

#### Caixas de correio SQLite criptografadas individualmente {#individually-encrypted-sqlite-mailboxes}

Ao contrário dos provedores de e-mail tradicionais que usam bancos de dados relacionais compartilhados (onde uma única violação pode expor os dados de todos os usuários), usamos arquivos SQLite criptografados individualmente para cada caixa de correio. Isso significa:

* Cada caixa de correio é um arquivo criptografado separado
* O acesso aos dados de um usuário não garante o acesso aos dados de outros
* Nem mesmo nossos próprios funcionários podem acessar seus dados — é uma decisão fundamental de design

Como explicamos nas discussões dos Guias de Privacidade:

> "Bancos de dados relacionais compartilhados (por exemplo, MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, etc.) exigem um login (com usuário/senha) para estabelecer a conexão com o banco de dados. Isso significa que qualquer pessoa com essa senha pode consultar o banco de dados sobre qualquer coisa. Seja um funcionário desonesto ou um ataque de uma empregada doméstica malvada. Isso também significa que ter acesso aos dados de um usuário significa que você também tem acesso aos de todos os outros. Por outro lado, o SQLite pode ser considerado um banco de dados compartilhado, mas a forma como o usamos (cada caixa de correio = arquivo SQLite individual) o torna um sandbox."\[^3]

#### Criptografia Resistente a Quântica {#quantum-resistant-encryption}

Enquanto outros provedores ainda estão se atualizando, nós já implementamos métodos de criptografia resistentes à computação quântica para proteger a privacidade do seu e-mail contra ameaças emergentes da computação quântica.

#### Sem dependências de terceiros {#no-third-party-dependencies}

Ao contrário de concorrentes que dependem de serviços como o Amazon SES para entrega de e-mails, construímos toda a nossa infraestrutura internamente. Isso elimina possíveis vazamentos de privacidade por meio de serviços de terceiros e nos dá controle total sobre todo o pipeline de e-mails.

## A opção de auto-hospedagem: liberdade de escolha {#the-self-hosting-option-freedom-of-choice}

Um dos aspectos mais poderosos do software de código aberto é a liberdade que ele proporciona. Com o Forward Email, você nunca fica preso a nada — você pode hospedar toda a nossa plataforma, se quiser.

### Por que oferecemos suporte à auto-hospedagem {#why-we-support-self-hosting}

Acreditamos em dar aos usuários controle total sobre seus dados. É por isso que tornamos toda a nossa plataforma auto-hospedável, com documentação abrangente e guias de configuração. Esta abordagem:

* Oferece controle máximo para usuários com conhecimento técnico
* Elimina qualquer necessidade de confiar em nós como provedor de serviços
* Permite personalização para atender a requisitos específicos
* Garante que o serviço possa continuar mesmo que nossa empresa não o faça

### A realidade da auto-hospedagem de e-mail {#the-reality-of-self-hosting-email}

Embora a auto-hospedagem seja uma opção poderosa, é importante entender os custos reais envolvidos:

#### Custos financeiros {#financial-costs}

* Custos de VPS ou servidor: US$ 5 a US$ 50/mês para uma configuração básica\[^4]
* Registro e renovação de domínio: US$ 10 a US$ 20/ano
* Certificados SSL (embora a Let's Encrypt ofereça opções gratuitas)
* Custos potenciais para serviços de monitoramento e soluções de backup

#### Custos de tempo {#time-costs}

* Configuração inicial: Várias horas ou dias, dependendo da experiência técnica
* Manutenção contínua: 5 a 10 horas/mês para atualizações, patches de segurança e solução de problemas\[^5]
* Curva de aprendizado: Compreensão de protocolos de e-mail, práticas recomendadas de segurança e administração de servidores

#### Desafios técnicos {#technical-challenges}

* Problemas de entrega de e-mails (mensagens marcadas como spam)
* Acompanhamento da evolução dos padrões de segurança
* Garantia de alta disponibilidade e confiabilidade
* Gerenciamento eficaz da filtragem de spam

Como disse um experiente auto-hospedador: "O e-mail é um serviço de commodities... É mais barato hospedar meu e-mail em \[um provedor] do que gastar dinheiro *e* tempo hospedando-o sozinho."\[^6]

## Por que nosso serviço pago faz sentido (mesmo sendo de código aberto) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Considerando os desafios da auto-hospedagem, nosso serviço pago oferece o melhor dos dois mundos: a transparência e a segurança do código aberto com a conveniência e a confiabilidade de um serviço gerenciado.

### Comparação de custos {#cost-comparison}

Quando você considera os custos financeiros e de tempo, nosso serviço pago oferece um valor excepcional:

* **Custo total da auto-hospedagem**: US$ 56 a US$ 252/mês (incluindo custos de servidor e avaliação de tempo)
* **Planos pagos de encaminhamento de e-mail**: US$ 3 a US$ 9/mês

Nosso serviço pago oferece:

* Gestão e manutenção profissionais
* Reputação de propriedade intelectual consolidada para melhor entregabilidade
* Atualizações e monitoramento regulares de segurança
* Suporte em caso de problemas
* Todos os benefícios de privacidade da nossa abordagem de código aberto

### O melhor dos dois mundos {#the-best-of-both-worlds}

Ao escolher Encaminhar e-mail, você obtém:

1. **Privacidade Verificável**: Nossa base de código aberto significa que você pode confiar em nossas políticas de privacidade.
2. **Gerenciamento Profissional**: Não é necessário se tornar um especialista em servidores de e-mail.
3. **Custo-Benefício**: Custo total menor do que a auto-hospedagem.
4. **Liberdade de Aprisionamento**: A opção de auto-hospedagem está sempre disponível.

## A farsa do código fechado: o que Proton e Tutanota não contam {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Vamos analisar mais de perto como nossa abordagem difere dos provedores de e-mail populares "focados em privacidade".

### Alegações de código aberto do Proton Mail {#proton-mails-open-source-claims}

O Proton Mail se autoproclama como de código aberto, mas isso se aplica apenas aos seus aplicativos front-end. O back-end — onde seus e-mails são processados e armazenados — permanece de código fechado. Isso significa:

* Você não pode verificar como seus e-mails estão sendo tratados
* Você deve confiar nas declarações de privacidade deles sem verificação
* Vulnerabilidades de segurança no backend permanecem ocultas do escrutínio público
* Você está preso ao ecossistema deles, sem opções de auto-hospedagem

### Abordagem semelhante de Tutanota {#tutanotas-similar-approach}

Assim como o Proton Mail, o Tutanota apenas disponibiliza seu frontend como código aberto, mantendo o backend proprietário. Eles enfrentam os mesmos problemas de confiança:

* Não há como verificar as declarações de privacidade do backend
* Transparência limitada no processamento real de e-mails
* Possíveis problemas de segurança ocultos do público
* Dependência de fornecedor sem opção de auto-hospedagem

### O debate sobre guias de privacidade {#the-privacy-guides-debate}

Essas limitações não passaram despercebidas na comunidade de privacidade. Nas discussões sobre os Guias de Privacidade, destacamos esta distinção crucial:

> "Afirma que tanto o Protonmail quanto o Tuta são de código fechado. Porque o backend deles é de fato de código fechado."\[^9]

Também afirmamos:

> "Não houve nenhuma auditoria compartilhada publicamente sobre infraestruturas de backend de provedores de serviços de e-mail PG atualmente listados, nem trechos de código-fonte aberto compartilhados sobre como eles processam e-mails recebidos."\[^10]

Essa falta de transparência cria um problema fundamental de confiança. Sem backends de código aberto, os usuários são forçados a aceitar reivindicações de privacidade com base na fé, em vez de verificação.

## O futuro é de código aberto {#the-future-is-open-source}

A tendência em direção a soluções de código aberto está se acelerando em toda a indústria de software. De acordo com pesquisas recentes:

* O mercado de software de código aberto está crescendo de US$ 41,83 bilhões em 2024 para US$ 48,92 bilhões em 2025\[^11]
* 80% das empresas relatam aumento no uso de código aberto no último ano\[^12]
* A adoção do código aberto deverá continuar sua rápida expansão

Esse crescimento reflete uma mudança fundamental na forma como pensamos sobre segurança e privacidade de software. À medida que os usuários se tornam mais preocupados com a privacidade, a demanda por privacidade verificável por meio de soluções de código aberto só tende a aumentar.

### Por que o código aberto está ganhando {#why-open-source-is-winning}

As vantagens do código aberto estão se tornando cada vez mais claras:

1. **Segurança por meio da transparência**: O código-fonte aberto pode ser revisado por milhares de especialistas, não apenas por uma equipe interna
2. **Inovação mais rápida**: O desenvolvimento colaborativo acelera a melhoria
3. **Confiança por meio da verificação**: As alegações podem ser verificadas em vez de aceitas como verdade absoluta
4. **Liberdade da dependência de fornecedores**: Os usuários mantêm o controle sobre seus dados e serviços
5. **Suporte da comunidade**: Uma comunidade global ajuda a identificar e corrigir problemas

## Mudando para encaminhar e-mail {#making-the-switch-to-forward-email}

Migrar para o Forward Email é simples, não importa se você vem de um provedor tradicional como o Gmail ou de outro serviço focado em privacidade como o Proton Mail ou o Tutanota.

Nosso serviço oferece:

* Domínios e aliases ilimitados
* Suporte a protocolos padrão (SMTP, IMAP, POP3) sem pontes proprietárias
* Integração perfeita com clientes de e-mail existentes
* Processo de configuração simples com documentação completa
* Planos de preços acessíveis a partir de apenas US$ 3/mês

## Conclusão: E-mail de código aberto para um futuro privado {#conclusion-open-source-email-for-a-private-future}

Em um mundo onde a privacidade digital está cada vez mais ameaçada, a transparência das soluções de código aberto oferece uma proteção crucial. Na Forward Email, temos orgulho de liderar o caminho com nossa abordagem totalmente de código aberto para a privacidade de e-mails.

Ao contrário dos concorrentes que adotam apenas parcialmente o código aberto, disponibilizamos toda a nossa plataforma — front-end e back-end — para análise pública. Esse compromisso com a transparência, aliado à nossa abordagem técnica inovadora, proporciona um nível de privacidade verificável que as alternativas de código fechado simplesmente não conseguem igualar.

Quer você escolha usar nosso serviço gerenciado ou hospedar nossa plataforma, você se beneficiará da segurança, privacidade e tranquilidade que vêm de um e-mail verdadeiramente de código aberto.

O futuro do e-mail é aberto, transparente e focado na privacidade. O futuro é o Encaminhamento de E-mails.

\[^1]: SNS Insider. "O mercado de serviços de código aberto foi avaliado em US$ 28,6 bilhões em 2023 e atingirá US$ 114,8 bilhões até 2032, com um CAGR de 16,70% até 2032." [Relatório de Análise e Tamanho do Mercado de Serviços de Código Aberto 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Comunidade de Guias de Privacidade. "Encaminhar e-mail (provedor de e-mail) - Desenvolvimento do site/Sugestões de ferramentas." [Guias de Privacidade Discussão](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Comunidade de Guias de Privacidade. "Encaminhar e-mail (provedor de e-mail) - Desenvolvimento do site / Sugestões de ferramentas." [Guias de Privacidade Discussão](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Em geral, você pode esperar gastar de US$ 5 a US$ 50 mensais em um servidor virtual privado (VPS) básico para executar seu servidor de e-mail." [As 10 melhores plataformas de servidores de e-mail auto-hospedados para usar em 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Fórum Mail-in-a-Box. "A manutenção levou talvez 16 horas nesse período..." [Servidor de e-mail de auto-hospedagem é mal visto](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. "TL:DR: Como tudo que é auto-hospedado, ISSO EXIGIRÁ SEU TEMPO. Se você não tem tempo para investir, é sempre melhor optar por um..." [Hospedar um servidor de e-mail por conta própria? Por que sim ou não? O que é popular?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Encaminhar e-mail. "O Proton Mail afirma ser de código aberto, mas seu backend, na verdade, é de código fechado." [Comparação entre Tutanota e Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Encaminhar e-mail. "O Tutanota afirma ser de código aberto, mas seu backend é, na verdade, de código fechado." [Comparação entre Proton Mail e Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Comunidade de Guias de Privacidade. "Afirma que tanto o Protonmail quanto o Tuta são de código fechado. Porque o backend deles é de fato de código fechado." [Encaminhar e-mail (provedor de e-mail) - Desenvolvimento de site / Sugestões de ferramentas](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Comunidade de Guias de Privacidade. "Não houve nenhuma auditoria compartilhada publicamente das infraestruturas de back-end de qualquer provedor de serviços de e-mail PG atualmente listado, nem trechos de código-fonte aberto compartilhados sobre como eles processam e-mails recebidos." [Encaminhar e-mail (provedor de e-mail) - Desenvolvimento de site / Sugestões de ferramentas](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "O mercado de software de código aberto crescerá de US$ 41,83 bilhões em 2024 para US$ 48,92 bilhões em 2025 a um ritmo composto..." [O que é software de código aberto?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Com 80% das empresas relatando aumento na utilização de tecnologias de código aberto no último ano, é..." [Tendências emergentes em comunidades de código aberto em 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)