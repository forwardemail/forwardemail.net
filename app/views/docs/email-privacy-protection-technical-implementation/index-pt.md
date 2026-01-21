# Como funciona o encaminhamento de e-mail com o Forward Email: o guia definitivo {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lazy" src="/img/articles/email-privacy.webp" alt="Email privacy protection technical implementation" class="rounded-lg" />

## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [O que é encaminhamento de e-mail](#what-is-email-forwarding)
* [Como funciona o encaminhamento de e-mail: a explicação técnica](#how-email-forwarding-works-the-technical-explanation)
  * [O processo de encaminhamento de e-mail](#the-email-forwarding-process)
  * [O papel do SRS (Sender Rewriting Scheme)](#the-role-of-srs-sender-rewriting-scheme)
* [Como funciona o encaminhamento de e-mail: uma explicação simples](#how-email-forwarding-works-the-simple-explanation)
* [Configurando o encaminhamento de e-mail com o Forward Email](#setting-up-email-forwarding-with-forward-email)
  * [1. Crie uma conta](#1-sign-up-for-an-account)
  * [2. Adicione seu domínio](#2-add-your-domain)
  * [3. Configurar registros DNS](#3-configure-dns-records)
  * [4. Crie encaminhamentos de e-mail](#4-create-email-forwards)
  * [5. Comece a usar seus novos endereços de e-mail](#5-start-using-your-new-email-addresses)
* [Recursos avançados do encaminhamento de e-mail](#advanced-features-of-forward-email)
  * [Endereços descartáveis](#disposable-addresses)
  * [Vários destinatários e curingas](#multiple-recipients-and-wildcards)
  * [Integração "Enviar e-mail como"](#send-mail-as-integration)
  * [Segurança Resistente a Quânticos](#quantum-resistant-security)
  * [Caixas de correio SQLite criptografadas individualmente](#individually-encrypted-sqlite-mailboxes)
* [Por que escolher o Forward Email em vez dos concorrentes](#why-choose-forward-email-over-competitors)
  * [1. 100% código aberto](#1-100-open-source)
  * [2. Focado na privacidade](#2-privacy-focused)
  * [3. Sem dependência de terceiros](#3-no-third-party-reliance)
  * [4. Preços econômicos](#4-cost-effective-pricing)
  * [5. Recursos ilimitados](#5-unlimited-resources)
  * [6. Confiável por grandes organizações](#6-trusted-by-major-organizations)
* [Casos de uso comuns para encaminhamento de e-mail](#common-use-cases-for-email-forwarding)
  * [Para empresas](#for-businesses)
  * [Para desenvolvedores](#for-developers)
  * [Para indivíduos preocupados com a privacidade](#for-privacy-conscious-individuals)
* [Melhores práticas para encaminhamento de e-mail](#best-practices-for-email-forwarding)
  * [1. Use endereços descritivos](#1-use-descriptive-addresses)
  * [2. Implemente a autenticação adequada](#2-implement-proper-authentication)
  * [3. Revise regularmente seus encaminhamentos](#3-regularly-review-your-forwards)
  * [4. Configure "Enviar e-mail como" para respostas perfeitas](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Use endereços genéricos com cautela](#5-use-catch-all-addresses-cautiously)
* [Conclusão](#conclusion)

## Prefácio {#foreword}

O encaminhamento de e-mails é uma ferramenta poderosa que pode transformar a forma como você gerencia suas comunicações online. Seja você um empresário que busca criar endereços de e-mail profissionais com seu domínio personalizado, um indivíduo preocupado com a privacidade que busca proteger seu e-mail principal ou um desenvolvedor que precisa de um gerenciamento de e-mails flexível, entender o encaminhamento de e-mails é essencial no cenário digital atual.

Na Forward Email, criamos o serviço de encaminhamento de e-mails mais seguro, privado e flexível do mundo. Neste guia completo, explicaremos como funciona o encaminhamento de e-mails (tanto do ponto de vista técnico quanto prático), guiaremos você pelo nosso processo simples de configuração e destacaremos por que nosso serviço se destaca da concorrência.

## O que é encaminhamento de e-mail {#what-is-email-forwarding}

O encaminhamento de e-mail é um processo que redireciona automaticamente os e-mails enviados de um endereço de e-mail para outro endereço de destino. Por exemplo, quando alguém envia um e-mail para <contato@seudominio.com>, essa mensagem pode ser encaminhada automaticamente para sua conta pessoal do Gmail, Outlook ou qualquer outra conta de e-mail.

Esse recurso aparentemente simples oferece benefícios poderosos:

* **Marca Profissional**: Use endereços de e-mail com seu domínio personalizado (<voce@seudominio.com>) enquanto gerencia tudo da sua caixa de entrada pessoal existente
* **Proteção de Privacidade**: Crie endereços descartáveis ou específicos para proteger seu e-mail principal
* **Gerenciamento Simplificado**: Consolide vários endereços de e-mail em uma única caixa de entrada
* **Flexibilidade**: Crie endereços ilimitados para diferentes finalidades sem precisar gerenciar várias contas

## Como funciona o encaminhamento de e-mail: a explicação técnica {#how-email-forwarding-works-the-technical-explanation}

Para os interessados nos detalhes técnicos, vamos explorar o que acontece nos bastidores quando um e-mail é encaminhado.

### O processo de encaminhamento de e-mail {#the-email-forwarding-process}

1. **Configuração de DNS**: O processo começa com os registros de DNS do seu domínio. Ao configurar o encaminhamento de e-mail, você configura os registros MX (Mail Exchange) que informam à internet para onde os e-mails do seu domínio devem ser entregues. Esses registros apontam para os nossos servidores de e-mail.

2. **Recebimento de e-mail**: quando alguém envia um e-mail para o seu endereço de domínio personalizado (por exemplo, <você@seudominio.com>), o servidor de e-mail dele consulta os registros MX do seu domínio e entrega a mensagem aos nossos servidores.

3. **Processamento e Autenticação**: Nossos servidores recebem o e-mail e realizam diversas funções críticas:
* Verificam a autenticidade do remetente usando protocolos como SPF, DKIM e DMARC
* Verificam a existência de conteúdo malicioso
* Verificam o destinatário em relação às suas regras de encaminhamento

4. **Reescrita de Remetente**: É aqui que a mágica acontece. Implementamos o Esquema de Reescrita de Remetente (SRS) para modificar o caminho de retorno do e-mail. Isso é crucial porque muitos provedores de e-mail rejeitam e-mails encaminhados sem a implementação adequada do SRS, pois podem parecer falsificados.

5. **Encaminhamento**: O e-mail é então enviado para o seu endereço de destino com o conteúdo original intacto.

6. **Entrega**: O e-mail chega à sua caixa de entrada, parecendo ter sido enviado para seu endereço de encaminhamento, mantendo a aparência profissional do seu domínio personalizado.

### O papel do SRS (Sender Rewriting Scheme) {#the-role-of-srs-sender-rewriting-scheme}

O SRS merece atenção especial porque é essencial para o encaminhamento confiável de e-mails. Quando um e-mail é encaminhado, o endereço do remetente precisa ser reescrito para garantir que o e-mail passe nas verificações de SPF no destino final.

Sem o SRS, os e-mails encaminhados frequentemente falham na verificação SPF e são marcados como spam ou rejeitados completamente. Nossa implementação do SRS garante que seus e-mails encaminhados sejam entregues de forma confiável, mantendo as informações do remetente original de forma transparente para você.

## Como funciona o encaminhamento de e-mail: uma explicação simples {#how-email-forwarding-works-the-simple-explanation}

Se os detalhes técnicos parecem complicados, aqui está uma maneira mais simples de entender o encaminhamento de e-mail:

Pense no encaminhamento de e-mails como o encaminhamento de correspondências físicas. Ao se mudar para uma nova casa, você pode solicitar aos Correios que encaminhem todas as correspondências do seu endereço antigo para o novo. O encaminhamento de e-mails funciona de forma semelhante, mas para mensagens digitais.

Com encaminhamento de e-mail:

1. Você nos informa quais endereços de e-mail em seu domínio deseja configurar (como <vendas@seudominio.com> ou <contato@seudominio.com>).
2. Você nos informa onde deseja que esses e-mails sejam entregues (como sua conta do Gmail ou Outlook).
3. Nós cuidamos de todos os detalhes técnicos para garantir que os e-mails enviados para seus endereços personalizados cheguem com segurança à sua caixa de entrada.

Simples assim! Você pode usar endereços de e-mail profissionais sem alterar seu fluxo de trabalho de e-mail atual.

## Configurando o encaminhamento de e-mail com o Forward Email {#setting-up-email-forwarding-with-forward-email}

Uma das maiores vantagens do Forward Email é a facilidade de configuração. Aqui está um guia passo a passo:

### 1. Crie uma conta {#1-sign-up-for-an-account}

Acesse [forwardemail.net](https://forwardemail.net) e crie uma conta gratuita. Nosso processo de cadastro leva menos de um minuto.

### 2. Adicione seu domínio {#2-add-your-domain}

Após efetuar login, adicione o domínio que deseja usar para encaminhamento de e-mails. Se você ainda não possui um domínio, precisará adquirir um de um registrador de domínios primeiro.

### 3. Configurar registros DNS {#3-configure-dns-records}

Forneceremos os registros DNS exatos que você precisa adicionar ao seu domínio. Normalmente, isso envolve:

* Adicionar registros MX que apontam para nossos servidores de e-mail
* Adicionar registros TXT para verificação e segurança

A maioria dos registradores de domínio possui uma interface simples para adicionar esses registros. Fornecemos guias detalhados para todos os principais registradores de domínio para tornar esse processo o mais tranquilo possível.

### 4. Criar encaminhamentos de e-mail {#4-create-email-forwards}

Após a verificação dos seus registros DNS (o que geralmente leva apenas alguns minutos), você poderá criar encaminhamentos de e-mail. Basta especificar:

* O endereço de e-mail do seu domínio (por exemplo, <contato@seudominio.com>)
* O destino para onde você deseja que os e-mails sejam enviados (por exemplo, seu endereço pessoal do Gmail)

### 5. Comece a usar seus novos endereços de e-mail {#5-start-using-your-new-email-addresses}

Pronto! Os e-mails enviados para os endereços do seu domínio personalizado agora serão encaminhados para o destino especificado. Você pode criar quantos encaminhamentos precisar, incluindo endereços catch-all que encaminham todos os e-mails enviados para qualquer endereço do seu domínio.

## Recursos avançados de encaminhamento de e-mail {#advanced-features-of-forward-email}

Embora o encaminhamento básico de e-mail seja poderoso por si só, o Forward Email oferece vários recursos avançados que nos diferenciam:

### Endereços descartáveis {#disposable-addresses}

Crie endereços de e-mail específicos ou anônimos que encaminham para sua conta principal. Você pode atribuir marcadores a esses endereços e ativá-los ou desativá-los a qualquer momento para manter sua caixa de entrada organizada. Seu endereço de e-mail real nunca é exposto.

### Vários destinatários e curingas {#multiple-recipients-and-wildcards}

Encaminhe um único endereço para vários destinatários, facilitando o compartilhamento de informações com uma equipe. Você também pode usar endereços curinga (encaminhamento genérico) para receber e-mails enviados para qualquer endereço do seu domínio.

Integração ### "Enviar e-mail como" {#send-mail-as-integration}

Você nunca mais precisará sair da sua caixa de entrada para enviar e-mails do seu domínio personalizado. Envie e responda mensagens como se fossem de <voce@seudominio.com> diretamente da sua conta do Gmail ou Outlook.

### Segurança Resistente a Quânticos {#quantum-resistant-security}

Somos o primeiro e único serviço de e-mail do mundo a usar criptografia resistente a quantum, protegendo suas comunicações até mesmo contra as ameaças futuras mais avançadas.

### Caixas de correio SQLite criptografadas individualmente {#individually-encrypted-sqlite-mailboxes}

Ao contrário de outros provedores que armazenam todos os e-mails dos usuários em bancos de dados compartilhados, usamos caixas de correio SQLite criptografadas individualmente para privacidade e segurança incomparáveis.

## Por que escolher o Forward Email em vez dos concorrentes {#why-choose-forward-email-over-competitors}

O mercado de encaminhamento de e-mail tem vários participantes, mas o Forward Email se destaca de várias maneiras importantes:

### 1. 100% de código aberto {#1-100-open-source}

Somos o único serviço de encaminhamento de e-mails totalmente de código aberto, incluindo nosso código de back-end. Essa transparência gera confiança e permite auditorias de segurança independentes. Outros serviços podem alegar ser de código aberto, mas não divulgam seu código de back-end.

### 2. Focado na privacidade {#2-privacy-focused}

Criamos este serviço porque você tem direito à privacidade. Utilizamos criptografia robusta com TLS, não armazenamos logs SMTP (exceto erros e SMTP de saída) e não gravamos seus e-mails em disco.

### 3. Sem dependência de terceiros {#3-no-third-party-reliance}

Ao contrário dos concorrentes que dependem do Amazon SES ou de outros serviços de terceiros, mantemos controle total sobre nossa infraestrutura, aumentando a confiabilidade e a privacidade.

### 4. Preços com boa relação custo-benefício {#4-cost-effective-pricing}

Nosso modelo de preços permite que você escale com eficiência de custos. Não cobramos por usuário e você pode pagar pelo armazenamento conforme o uso. Por US$ 3/mês, oferecemos mais recursos a um preço menor do que concorrentes como o Gandi (US$ 3,99/mês).

### 5. Recursos ilimitados {#5-unlimited-resources}

Não impomos limites artificiais em domínios, aliases ou endereços de e-mail como muitos concorrentes fazem.

### 6. Confiável pelas principais organizações {#6-trusted-by-major-organizations}

Nosso serviço é usado por mais de 500.000 domínios, incluindo organizações notáveis como [Academia Naval dos EUA](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [A Fundação Linux](/blog/docs/linux-foundation-email-enterprise-case-study), [Canônico/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales e muitas outras.

## Casos de uso comuns para encaminhamento de e-mail {#common-use-cases-for-email-forwarding}

O encaminhamento de e-mail resolve vários desafios para diferentes tipos de usuários:

### Para empresas {#for-businesses}

* Crie endereços de e-mail profissionais para diferentes departamentos (vendas@, suporte@, informações@)
* Gerencie facilmente as comunicações por e-mail da equipe
* Mantenha a consistência da marca em todas as comunicações
* Simplifique o gerenciamento de e-mails durante as mudanças de equipe

### Para desenvolvedores {#for-developers}

* Configure sistemas de notificação automatizados
* Crie endereços específicos para diferentes projetos
* Integre com webhooks para automação avançada
* Aproveite nossa API para implementações personalizadas

### Para indivíduos preocupados com a privacidade {#for-privacy-conscious-individuals}

* Crie endereços de e-mail separados para diferentes serviços para rastrear quem compartilha suas informações
* Use endereços descartáveis para cadastros únicos
* Mantenha a privacidade protegendo seu endereço de e-mail principal
* Desative facilmente endereços que começam a receber spam

## Melhores práticas para encaminhamento de e-mail {#best-practices-for-email-forwarding}

Para aproveitar ao máximo o encaminhamento de e-mail, considere estas práticas recomendadas:

### 1. Use endereços descritivos {#1-use-descriptive-addresses}

Crie endereços de e-mail que indiquem claramente sua finalidade (por exemplo, <newsletter@seudominio.com>, <compras@seudominio.com>) para ajudar a organizar seus e-mails recebidos.

### 2. Implementar autenticação adequada {#2-implement-proper-authentication}

Garanta que seu domínio tenha registros SPF, DKIM e DMARC adequados para maximizar a entregabilidade. O Forward Email facilita isso com nossa configuração guiada.

### 3. Revise regularmente seus encaminhamentos {#3-regularly-review-your-forwards}

Audite periodicamente seus encaminhamentos de e-mail para desabilitar aqueles que não são mais necessários ou que estão recebendo spam em excesso.

### 4. Configure "Enviar e-mail como" para respostas contínuas {#4-set-up-send-mail-as-for-seamless-replies}

Configure seu cliente de e-mail principal para enviar e-mails como seus endereços de domínio personalizados para uma experiência consistente ao responder a e-mails encaminhados.

### 5. Use endereços genéricos com cautela {#5-use-catch-all-addresses-cautiously}

Embora endereços genéricos sejam convenientes, eles podem receber mais spam. Considere criar encaminhamentos específicos para comunicações importantes.

## Conclusão {#conclusion}

O encaminhamento de e-mails é uma ferramenta poderosa que traz profissionalismo, privacidade e simplicidade às suas comunicações por e-mail. Com o Forward Email, você obtém o serviço de encaminhamento de e-mails mais seguro, privado e flexível disponível.

Como o único provedor 100% de código aberto com criptografia resistente a quantum e foco em privacidade, criamos um serviço que respeita seus direitos ao mesmo tempo em que oferece funcionalidades excepcionais.

Quer você queira criar endereços de e-mail profissionais para sua empresa, proteger sua privacidade com endereços descartáveis ou simplificar o gerenciamento de várias contas de e-mail, o Forward Email oferece a solução perfeita.

Pronto para transformar sua experiência de e-mail? Cadastre-se hoje mesmo e junte-se a mais de 500.000 domínios que já se beneficiam do nosso serviço.

---

*Este post foi escrito pela equipe do Forward Email, criadores do serviço de encaminhamento de e-mails mais seguro, privado e flexível do mundo. Visite [forwardemail.net](https://forwardemail.net) para saber mais sobre nosso serviço e começar a encaminhar e-mails com confiança.*