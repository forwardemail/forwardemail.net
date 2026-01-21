# E-mail resistente a quantum: como usamos caixas de correio SQLite criptografadas para manter seu e-mail seguro {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />

## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [Comparação de provedores de serviços de e-mail](#email-service-provider-comparison)
* [Como funciona](#how-does-it-work)
* [Tecnologias](#technologies)
  * [Bancos de dados](#databases)
  * [Segurança](#security)
  * [Caixas de correio](#mailboxes)
  * [Concorrência](#concurrency)
  * [Backups](#backups)
  * [Procurar](#search)
  * [Projetos](#projects)
  * [Provedores](#providers)
* [Pensamentos](#thoughts)
  * [Princípios](#principles)
  * [Experimentos](#experiments)
  * [Falta de alternativas](#lack-of-alternatives)
  * [Experimente o Encaminhamento de e-mail](#try-out-forward-email)

## Prefácio {#foreword}

> \[!IMPORTANT]
> Nosso serviço de e-mail é [100% de código aberto](https://github.com/forwardemail) e prioriza a privacidade por meio de caixas de correio SQLite seguras e criptografadas.

Até lançarmos o [Suporte IMAP](/faq#do-you-support-receiving-email-with-imap), usávamos o MongoDB para nossas necessidades de armazenamento de dados persistentes.

Essa tecnologia é incrível e ainda a usamos hoje, mas para ter criptografia em repouso com o MongoDB, você precisa usar um provedor que ofereça o MongoDB Enterprise, como o Digital Ocean ou o Mongo Atlas, ou pagar por uma licença corporativa (e, posteriormente, ter que trabalhar com a latência da equipe de vendas).

Nossa equipe na [Encaminhar e-mail](https://forwardemail.net) precisava de uma solução de armazenamento criptografada, escalável, confiável e amigável ao desenvolvedor para caixas de correio IMAP. Como desenvolvedores de código aberto, usar uma tecnologia que exige o pagamento de uma taxa de licença para obter o recurso de criptografia em repouso era contra a [nossos princípios](#principles) – então, experimentamos, pesquisamos e desenvolvemos uma nova solução do zero para atender a essas necessidades.

Em vez de usar um banco de dados compartilhado para armazenar suas caixas de correio, nós as armazenamos e criptografamos individualmente com sua senha (que só você tem). **Nosso serviço de e-mail é tão seguro que, se você esquecer sua senha, perderá sua caixa de correio** (e precisará recuperá-la com backups offline ou começar tudo de novo).

Continue lendo enquanto damos uma olhada mais a fundo em [comparação de provedores de serviços de e-mail](#email-service-provider-comparison), [como funciona nosso serviço](#how-does-it-work), [nossa pilha de tecnologia](#technologies) e muito mais.

## Comparação de provedores de serviços de e-mail {#email-service-provider-comparison}

Somos o único provedor de serviços de e-mail 100% de código aberto e focado em privacidade que armazena caixas de correio SQLite criptografadas individualmente, oferece domínios, aliases e usuários ilimitados e tem suporte para SMTP, IMAP e POP3 de saída:

**Ao contrário de outros provedores de e-mail, com o Forward Email você não precisa pagar por armazenamento por domínio ou alias.** O armazenamento é compartilhado por toda a sua conta – portanto, se você tiver vários nomes de domínio personalizados e vários aliases em cada um, somos a solução perfeita para você. Observe que você ainda pode impor limites de armazenamento, se desejar, por domínio ou alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Leia a comparação de serviços de e-mail <i class="fa fa-search-plus"></i></a>

## Como funciona {#how-does-it-work}

1. Usando seu cliente de e-mail, como Apple Mail, Thunderbird, Gmail ou Outlook – você se conecta aos nossos servidores seguros [IMAP](/faq#do-you-support-receiving-email-with-imap) usando seu nome de usuário e senha:

* Seu nome de usuário é seu alias completo com seu domínio, como `hello@example.com`.
* Sua senha é gerada aleatoriamente e exibida por apenas 30 segundos quando você clica em <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases.

2. Após a conexão, seu cliente de e-mail enviará [Comandos do protocolo IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) para o nosso servidor IMAP para manter sua caixa de entrada sincronizada. Isso inclui escrever e armazenar rascunhos de e-mail e outras ações que você pode realizar (por exemplo, marcar um e-mail como Importante ou sinalizar um e-mail como Spam/Lixo Eletrônico).

3. Os servidores de troca de e-mails (comumente conhecidos como servidores "MX") recebem novos e-mails recebidos e os armazenam na sua caixa de entrada. Quando isso acontece, seu cliente de e-mail será notificado e sincronizará sua caixa de entrada. Nossos servidores de troca de e-mails podem encaminhar seus e-mails para um ou mais destinatários (incluindo [webhooks](/faq#do-you-support-webhooks)), armazenar seus e-mails para você em seu armazenamento IMAP criptografado conosco, **ou ambos**!

> \[!DICA]
> Interessado em saber mais? Leia [como configurar o encaminhamento de e-mail](/faq#how-do-i-get-started-and-set-up-email-forwarding), [como funciona nosso serviço de troca de correspondência](/faq#how-does-your-email-forwarding-system-work) ou veja [nossos guias](/guides).

4. Nos bastidores, nosso design de armazenamento seguro de e-mail funciona de duas maneiras para manter suas caixas de correio criptografadas e acessíveis somente a você:

* Quando você recebe um novo e-mail de um remetente, nossos servidores de troca de e-mail gravam em uma caixa de correio individual, temporária e criptografada para você.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Ao se conectar ao nosso servidor IMAP com seu cliente de e-mail, sua senha será criptografada na memória e usada para ler e gravar em sua caixa de correio. Sua caixa de correio só poderá ser lida e gravada com essa senha. Lembre-se de que, como você é o único com essa senha, **somente você** poderá ler e gravar em sua caixa de correio ao acessá-la. Na próxima vez que seu cliente de e-mail tentar pesquisar e-mails ou sincronizar, suas novas mensagens serão transferidas dessa caixa de correio temporária e armazenadas em seu arquivo de caixa de correio atual, usando a senha fornecida. Observe que essa caixa de correio temporária será limpa e excluída posteriormente, para que apenas sua caixa de correio protegida por senha tenha as mensagens.

* **Se você estiver conectado via IMAP (por exemplo, usando um cliente de e-mail como Apple Mail ou Thunderbird), não precisamos gravar no armazenamento temporário em disco. Sua senha IMAP criptografada na memória é obtida e utilizada. Em tempo real, quando uma mensagem está tentando ser entregue a você, enviamos uma solicitação WebSocket a todos os servidores IMAP perguntando se eles têm uma sessão ativa para você (esta é a parte da busca) e, em seguida, repassamos essa senha criptografada na memória – portanto, não precisamos gravar em uma caixa de correio temporária; podemos gravar na sua caixa de correio criptografada real usando sua senha criptografada.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. [Backups de suas caixas de correio criptografadas](#backups) são criados diariamente. Você também pode solicitar um novo backup a qualquer momento ou baixar o backup mais recente em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases. Se decidir mudar para outro serviço de e-mail, você poderá facilmente migrar, baixar, exportar e limpar suas caixas de correio e backups a qualquer momento.

## Tecnologias {#technologies}

### Bancos de dados {#databases}

Exploramos outras possíveis camadas de armazenamento de banco de dados, porém nenhuma atendeu aos nossos requisitos tanto quanto o SQLite:

| Banco de dados | Criptografia em repouso | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Caixas de correio | Licença | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :estrela: | :white_check_mark: Sim com [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :marca_de_verificação_branca: | :white_check_mark: Domínio Público | :marca_de_verificação_branca: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Banco de dados relacional | :x: AGPL e `SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Banco de dados relacional | :white_check_mark: __CÓDIGO_DA_CÉLULA_0__ | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :white_check_mark: __CÓDIGO_DA_CÉLULA_0__ | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :white_check_mark: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Banco de dados relacional | :white_check_mark: `PostgreSQL` (semelhante a `BSD` ou `MIT`) | :x: |
| [MariaDB](https://mariadb.com/) | :white_check_mark: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Banco de dados relacional | :white_check_mark: __CÓDIGO_DA_CÉLULA_0__ e __CÓDIGO_DA_CÉLULA_1__ | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Banco de dados relacional | :x: `BUSL-1.1` e outros | :x: |

> Aqui está um [postagem de blog que compara várias opções de armazenamento de banco de dados SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) na tabela acima.

### Segurança {#security}

Em todos os momentos, usamos [criptografia em repouso](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [criptografia em trânsito](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS sobre HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") usando criptografia :tangerine: [tangerina](https://tangeri.ne) e [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poli1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) em caixas de correio. Além disso, usamos autenticação de dois fatores baseada em token (em oposição ao SMS, que é suspeito de [ataques do tipo man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), chaves SSH rotacionadas com acesso root desabilitado, acesso exclusivo a servidores por meio de endereços IP restritos e muito mais.

No caso de um [ataque de empregada malvada](https://en.wikipedia.org/wiki/Evil_maid_attack) ou funcionário desonesto de um fornecedor terceirizado, **sua caixa de correio ainda poderá ser aberta apenas com a senha gerada**. Fique tranquilo, não dependemos de nenhum fornecedor terceirizado além dos nossos provedores de servidores compatíveis com SOC Tipo 2: Cloudflare, DataPacket, Digital Ocean e Vultr.

Nosso objetivo é ter o mínimo possível de [ponto único de falhas](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Caixas de correio {#mailboxes}

> **tldr;** Nossos servidores IMAP usam bancos de dados SQLite criptografados individualmente para cada uma de suas caixas de correio.

Banco de dados incorporado [SQLite é extremamente popular](https://www.sqlite.org/mostdeployed.html) – atualmente em execução no seu telefone e computador – [e usado por quase todas as principais tecnologias](https://www.sqlite.org/famous.html).

Por exemplo, em nossos servidores criptografados, há uma caixa de correio de banco de dados SQLite para `linux@example.com`, `info@example.com`, `hello@example.com` e assim por diante – uma para cada um, como um arquivo de banco de dados `.sqlite`. Também não nomeamos os arquivos de banco de dados com o endereço de e-mail – em vez disso, usamos o BSON ObjectID e UUIDs exclusivos gerados, que não compartilham a quem a caixa de correio pertence ou sob qual endereço de e-mail ela está (por exemplo, `353a03f21e534321f5d6e267.sqlite`).

Cada um desses bancos de dados é criptografado usando sua senha (que só você tem) usando [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poli1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Isso significa que suas caixas de correio são criptografadas individualmente, autocontidas ([em sandbox](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) e portáteis.

Ajustamos o SQLite com o seguinte [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA` | Propósito |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Consulte `better-sqlite3-multiple-ciphers` em [Projects](#projects) para mais informações. |
| `key="****************"` | Esta é a sua senha descriptografada, somente na memória, que é passada pela conexão IMAP do seu cliente de e-mail para o nosso servidor. Novas instâncias de banco de dados são criadas e fechadas para cada sessão de leitura e gravação (para garantir sandbox e isolamento). |
| `journal_model=WAL` | Registro de gravação antecipada ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Evita erros de bloqueio de gravação [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Aumenta a durabilidade das transações [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Força que referências de chave estrangeira (por exemplo, uma relação de uma tabela para outra) sejam impostas. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), mas para validação e integridade de dados, ele deve ser habilitado. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) a ser usado para garantir a sanidade do desenvolvedor. |

> Todos os outros padrões são do SQLite, conforme especificado no [documentação oficial do PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Simultaneidade {#concurrency}

> **tldr;** Usamos `WebSocket` para leituras e gravações simultâneas em suas caixas de correio criptografadas do SQLite.

#### Lê {#reads}

Seu cliente de e-mail no seu telefone pode resolver `imap.forwardemail.net` para um dos nossos endereços IP da Digital Ocean, e seu cliente de desktop pode resolver um IP separado de um [provedor](#providers) completamente diferente.

Independentemente do servidor IMAP ao qual seu cliente de e-mail se conecta, queremos que a conexão leia seu banco de dados em tempo real com 100% de precisão. Isso é feito por meio de WebSockets.

#### Grava {#writes}

Escrever no seu banco de dados é um pouco diferente, já que o SQLite é um banco de dados incorporado e sua caixa de correio fica em um único arquivo por padrão.

Exploramos opções como `litestream`, `rqlite` e `dqlite` abaixo – no entanto, nenhuma delas atendeu aos nossos requisitos.

Para realizar gravações com o registro de gravação antecipada ("[WAL](https://www.sqlite.org/wal.html)") habilitado, precisamos garantir que apenas um servidor ("Principal") seja responsável por isso. [WAL](https://www.sqlite.org/wal.html) acelera drasticamente a simultaneidade e permite um gravador e vários leitores.

O servidor primário está sendo executado nos servidores de dados com os volumes montados contendo as caixas de correio criptografadas. Do ponto de vista da distribuição, você pode considerar todos os servidores IMAP individuais por trás de `imap.forwardemail.net` como servidores secundários ("Secundário").

Realizamos comunicação bidirecional com [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Os servidores primários usam uma instância do servidor `WebSocketServer` do [ws](https://github.com/websockets/ws).
* Os servidores secundários usam uma instância do cliente `WebSocket` do [ws](https://github.com/websockets/ws), que é encapsulado com [websocket-como-prometido](https://github.com/vitalets/websocket-as-promised) e [reconectando-websocket](https://github.com/opensumi/reconnecting-websocket). Esses dois encapsuladores garantem que o `WebSocket` se reconecte e possa enviar e receber dados para gravações específicas no banco de dados.

### Backups {#backups}

> **tldr;** Backups das suas caixas de correio criptografadas são feitos diariamente. Você também pode solicitar um novo backup instantaneamente ou baixar o backup mais recente a qualquer momento em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases.

Para backups, simplesmente executamos o comando `VACUUM INTO` do SQLite todos os dias durante o processamento do comando IMAP, que utiliza sua senha criptografada de uma conexão IMAP na memória. Os backups são armazenados se nenhum backup existente for detectado ou se o hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2) tiver sido alterado no arquivo em comparação com o backup mais recente.

Observe que usamos o comando `VACUUM INTO` em vez do comando integrado `backup` porque, se uma página for modificada durante uma operação do comando `backup`, ela precisará ser reiniciada. O comando `VACUUM INTO` fará um snapshot. Veja estes comentários sobre [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) e [Notícias de hackers](https://news.ycombinator.com/item?id=31387556) para mais informações.

Além disso, usamos `VACUUM INTO` em vez de `backup`, porque o comando `backup` deixaria o banco de dados descriptografado por um breve período até que `rekey` fosse invocado (veja este GitHub [comentário](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) para obter mais informações).

O Secundário instruirá o Primário por meio da conexão `WebSocket` para executar o backup – e o Primário receberá o comando para fazê-lo e, posteriormente:

1. Conecte-se à sua caixa de correio criptografada.
2. Obtenha um bloqueio de gravação.
3. Execute um ponto de verificação WAL via `wal_checkpoint(PASSIVE)`.
4. Execute o comando `VACUUM INTO` do SQLite.
5. Certifique-se de que o arquivo copiado possa ser aberto com a senha criptografada (salvaguarda/proteção contra falsificações).
6. Carregue-o no Cloudflare R2 para armazenamento (ou no seu próprio provedor, se especificado).

<!--
7. Compacte o arquivo de backup resultante com `gzip`.
8. Carregue-o no Cloudflare R2 para armazenamento (ou no seu próprio provedor, se especificado).
-->

Lembre-se de que suas caixas de correio são criptografadas e, embora tenhamos restrições de IP e outras medidas de autenticação para comunicação via WebSocket, no caso de um invasor, você pode ter certeza de que, a menos que o payload do WebSocket tenha sua senha IMAP, ele não poderá abrir seu banco de dados.

No momento, apenas um backup é armazenado por caixa de correio, mas no futuro poderemos oferecer recuperação em um determinado momento ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Pesquisar {#search}

Nossos servidores IMAP suportam o comando `SEARCH` com consultas complexas, expressões regulares e muito mais.

O desempenho rápido da pesquisa é graças a [FTS5](https://www.sqlite.org/fts5.html) e [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Armazenamos valores `Date` nas caixas de correio do SQLite como strings [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (com fuso horário UTC para que as comparações de igualdade funcionem corretamente).

Os índices também são armazenados para todas as propriedades que estão nas consultas de pesquisa.

### Projetos {#projects}

Aqui está uma tabela descrevendo os projetos que usamos em nosso código-fonte e processo de desenvolvimento (classificados em ordem alfabética):

| Projeto | Propósito |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | Plataforma de automação DevOps para manter, dimensionar e gerenciar toda a nossa frota de servidores com facilidade. |
| [Bree](https://github.com/breejs/bree) | Agendador de tarefas para Node.js e JavaScript com cron, dates, ms, later e suporte amigável. |
| [Cabin](https://github.com/cabinjs/cabin) | Biblioteca de registro JavaScript e Node.js amigável ao desenvolvedor, com segurança e privacidade em mente. |
| [Lad](https://github.com/ladjs/lad) | Framework Node.js que impulsiona toda a nossa arquitetura e design de engenharia com MVC e muito mais. |
| [MongoDB](https://www.mongodb.com/) | Solução de banco de dados NoSQL que usamos para armazenar todos os outros dados fora das caixas de correio (por exemplo, sua conta, configurações, domínios e configurações de alias). |
| [Mongoose](https://github.com/Automattic/mongoose) | Modelagem de documentos de objetos ("ODM") do MongoDB, que usamos em toda a nossa pilha. Escrevemos auxiliares especiais que nos permitem simplesmente continuar usando **Mongoose com SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js é o ambiente de execução JavaScript de código aberto e multiplataforma que executa todos os nossos processos de servidor. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Pacote Node.js para envio de e-mails, criação de conexões e muito mais. Somos patrocinadores oficiais deste projeto. |
| [Redis](https://redis.io/) | Banco de dados na memória para armazenamento em cache, canais de publicação/assinatura e solicitações de DNS sobre HTTPS. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Extensão de criptografia para SQLite para permitir que arquivos inteiros de banco de dados sejam criptografados (incluindo o log de gravação antecipada ("[WAL](https://www.sqlite.org/wal.html)"), diário, reversão, …). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Editor Visual SQLite (que você também pode usar) para testar, baixar e visualizar caixas de correio de desenvolvimento. |
| [SQLite](https://www.sqlite.org/about.html) | Camada de banco de dados incorporada para armazenamento IMAP escalável, independente, rápido e resiliente. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Ferramenta antispam, filtragem de e-mail e prevenção de phishing Node.js (nossa alternativa para [Spam Assassin](https://spamassassin.apache.org/) e [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | Solicitações de DNS sobre HTTPS com Node.js e cache usando Redis – o que garante consistência global e muito mais. |
| [Thunderbird](https://www.thunderbird.net/) | Nossa equipe de desenvolvimento usa isso (e recomenda também) como **o cliente de e-mail preferido para usar com o Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | Nossa equipe de desenvolvimento usa essas máquinas virtuais para iOS e macOS para testar diferentes clientes de e-mail (em paralelo) com nossos servidores IMAP e SMTP. |
| [Ubuntu](https://ubuntu.com/download/server) | Sistema operacional de servidor moderno, de código aberto, baseado em Linux, que alimenta toda a nossa infraestrutura. |
| [WildDuck](https://github.com/nodemailer/wildduck) | Biblioteca do servidor IMAP – veja suas notas em [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) e [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Biblioteca de API rápida e simples para Node.js interagir com SQLite3 programaticamente. |
| [email-templates](https://github.com/forwardemail/email-templates) | Estrutura de e-mail amigável ao desenvolvedor para criar, visualizar e enviar e-mails personalizados (por exemplo, notificações de conta e muito mais). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Construtor de consultas SQL usando sintaxe no estilo Mongo. Isso economiza tempo para nossa equipe de desenvolvimento, pois podemos continuar escrevendo no estilo Mongo em toda a pilha com uma abordagem independente de banco de dados. **Também ajuda a evitar ataques de injeção de SQL usando parâmetros de consulta.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | Utilitário SQL para extrair informações sobre esquemas de banco de dados existentes. Isso nos permite validar facilmente se todos os índices, tabelas, colunas, restrições e outros são válidos e estão em conformidade com o `1:1` como deveriam ser. Escrevemos até mesmo auxiliares automatizados para adicionar novas colunas e índices caso sejam feitas alterações nos esquemas de banco de dados (com alertas de erro extremamente detalhados). |
| [knex](https://github.com/knex/knex) | Construtor de consultas SQL que usamos apenas para migrações de banco de dados e validação de esquema por meio de `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Tradução automática de frases [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) com suporte para Markdown usando [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Pacote Node.js para resolver e estabelecer conexões com servidores MX e lidar com erros. |
| [pm2](https://github.com/Unitech/pm2) | Gerenciador de processo de produção Node.js com balanceador de carga integrado ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) para desempenho). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | Biblioteca do servidor SMTP – usamos isso para nossos servidores de troca de e-mail ("MX") e SMTP de saída. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Ferramenta útil para testar servidores IMAP em comparação com benchmarks e especificações RFC de compatibilidade do protocolo IMAP. Este projeto foi criado pela equipe [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\) (um servidor IMAP e POP3 de código aberto ativo desde julho de 2002). Testamos exaustivamente nosso servidor IMAP com esta ferramenta. |

> Você pode encontrar outros projetos que usamos em [nosso código-fonte no GitHub](https://github.com/forwardemail).

### Provedores {#providers}

| Provedor | Propósito |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | Provedor de DNS, verificações de integridade, balanceadores de carga e armazenamento de backup usando [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hospedagem de servidores dedicados e bancos de dados gerenciados. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Hospedagem de servidor dedicado. |
| [DataPacket](https://www.datapacket.com) | Hospedagem de servidor dedicado. |

## Pensamentos {#thoughts}

### Princípios {#principles}

O Forward Email foi projetado de acordo com estes princípios:

1. Seja sempre amigável ao desenvolvedor, focado em segurança e privacidade, e transparente.
2. Siga os padrões [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Fator Doze](https://12factor.net/), [Navalha de Occam](https://en.wikipedia.org/wiki/Occam%27s_razor) e [comida de cachorro](https://en.wikipedia.org/wiki/Eating_your_own_dog_food).
3. Foque nos desenvolvedores que usam scrappy, bootstrap e [ramen lucrativo](http://www.paulgraham.com/ramenprofitable.html).

### Experimentos {#experiments}

> **tldr;** Em última análise, usar armazenamento de objetos compatível com S3 e/ou tabelas virtuais não é tecnicamente viável por motivos de desempenho e está sujeito a erros devido a limitações de memória.

Fizemos alguns experimentos até chegar à nossa solução final do SQLite, conforme discutido acima.

Uma delas foi tentar usar [rclone]() e SQLite junto com uma camada de armazenamento compatível com S3.

Esse experimento nos levou a entender melhor e descobrir casos extremos envolvendo o uso de rclone, SQLite e [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Se você habilitar o sinalizador `--vfs-cache-mode writes` com rclone, as leituras serão permitidas, porém as gravações serão armazenadas em cache.
* Se você tiver vários servidores IMAP distribuídos globalmente, o cache ficará desativado entre eles, a menos que você tenha um único gravador e vários ouvintes (por exemplo, uma abordagem pub/sub).
* Isso é incrivelmente complexo e adicionar qualquer complexidade adicional como essa resultará em mais pontos únicos de falha.
* Provedores de armazenamento compatíveis com S3 não suportam alterações parciais de arquivos – o que significa que qualquer alteração no arquivo `.sqlite` resultará em uma alteração completa e no reenvio do banco de dados.
* Existem outras soluções, como `rsync`, mas elas não são focadas no suporte a logs de gravação antecipada ("[WAL](https://www.sqlite.org/wal.html)") – então acabamos analisando o Litestream. Felizmente, nosso uso de criptografia já criptografa os arquivos [WAL](https://www.sqlite.org/wal.html) para nós, então não precisamos depender do Litestream para isso. No entanto, ainda não estávamos confiantes no Litestream para uso em produção e temos algumas observações sobre isso abaixo.
* Usar esta opção de `--vfs-cache-mode writes` (a *única* maneira de usar o SQLite em vez de `rclone` para gravações) tentará copiar todo o banco de dados do zero para a memória – manipular uma caixa de correio de 10 GB é aceitável; no entanto, manipular várias caixas de correio com armazenamento excessivamente alto fará com que os servidores IMAP apresentem limitações de memória e erros de `ENOMEM`, falhas de segmentação e corrupção de dados.
* Se você tentar usar o comando [Mesas Virtuais](https://www.sqlite.org/vtab.html) do SQLite (por exemplo, usando o comando [s3db](https://github.com/jrhy/s3db)) para manter os dados ativos em uma camada de armazenamento compatível com S3, você encontrará vários outros problemas:
* As leituras e gravações serão extremamente lentas, pois os endpoints da API S3 precisarão ser acessados com os métodos HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2 e `.sqlite`3.
* Os testes de desenvolvimento mostraram que exceder 500 mil a mais de 1 milhão de registros na internet de fibra óptica ainda é limitado pela taxa de transferência de gravação e leitura para provedores compatíveis com S3. Por exemplo, nossos desenvolvedores executaram loops `.sqlite`4 para executar instruções SQL sequenciais `.sqlite`5 e aquelas que gravavam grandes quantidades de dados em massa. Em ambos os casos, o desempenho foi incrivelmente lento.
* Tabelas virtuais **não podem ter índices**, instruções `.sqlite`6 e `.sqlite`7 `.sqlite`8 – o que leva a atrasos de 1 a 2 minutos ou mais, dependendo da quantidade de dados.
* Objetos foram armazenados sem criptografia e não há suporte nativo para criptografia disponível.
* Também exploramos o uso de `.sqlite`9, que é conceitual e tecnicamente semelhante ao tópico anterior (portanto, apresenta os mesmos problemas). Uma possibilidade seria usar uma compilação `rsync`0 personalizada, encapsulada com criptografia, como `rsync`1 (que usamos atualmente em nossa solução acima) por meio de `rsync`2.
* Outra abordagem potencial seria usar `rsync`3, porém, isso tem uma limitação de 32 GB e exigiria complexas dores de cabeça de construção e desenvolvimento.
* Instruções `rsync`4 são necessárias (portanto, isso descarta completamente o uso de Tabelas Virtuais). Precisamos de instruções `rsync`5 para que nosso hook com `rsync`6 funcione corretamente – o que garante que os dados não sejam corrompidos e que as linhas recuperadas possam ser convertidas em documentos válidos de acordo com nossas definições de esquema `rsync`7 (que incluem restrição, tipo de variável e validação arbitrária de dados).
* Quase todos os projetos compatíveis com S3 relacionados ao SQLite na comunidade de código aberto são em Python (e não em JavaScript, que usamos em 100% do nosso stack).
* Bibliotecas de compressão como `rsync`8 (veja `rsync`9) parecem promissoras, mas __PROTECTED_LINK_189__0. Em vez disso, a compactação do lado do aplicativo em tipos de dados como __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 e __PROTECTED_LINK_189__6 será uma abordagem mais limpa e fácil (e também mais fácil de migrar, já que poderíamos armazenar um sinalizador ou coluna __PROTECTED_LINK_189__7 – ou até mesmo usar __PROTECTED_LINK_189__8 ou __PROTECTED_LINK_189__9 para compactação ou __PROTECTED_LINK_190__0 para nenhuma compactação como metadados do banco de dados).
* Felizmente, já implementamos a desduplicação de anexos em nosso armazenamento de servidor IMAP – portanto, cada mensagem com o mesmo anexo não manterá uma cópia do anexo – em vez disso, um único anexo é armazenado para várias mensagens e threads em uma caixa de correio (e uma referência estrangeira é posteriormente usada).
* O projeto Litestream, que é uma solução de replicação e backup SQLite, é muito promissor e provavelmente o utilizaremos no futuro.
* Sem desmerecer o(s) autor(es) – pois adoramos seu trabalho e suas contribuições ao código aberto há mais de uma década – no entanto, a partir do uso no mundo real, parece que existem __PROTECTED_LINK_190__1 e __PROTECTED_LINK_190__2.
* A restauração de backup precisa ser simples e trivial. Usar uma solução como o MongoDB com __PROTECTED_LINK_190__3 e __PROTECTED_LINK_190__4 não é apenas tedioso, mas também demorado e apresenta complexidade de configuração.
* Bancos de dados SQLite simplificam (é um único arquivo).
* Queríamos projetar uma solução em que os usuários pudessem pegar suas caixas de correio e sair a qualquer momento.
* Comandos simples do Node.js para __PROTECTED_LINK_190__5 e elas são permanentemente apagadas do armazenamento em disco. * Da mesma forma, podemos usar uma API compatível com S3 com HTTP __PROTECTED_LINK_190__6 para remover facilmente snapshots e backups para os usuários.
* O SQLite foi a solução mais simples, rápida e econômica.

### Falta de alternativas {#lack-of-alternatives}

Até onde sabemos, nenhum outro serviço de e-mail foi projetado dessa forma e nem é de código aberto.

*Achamos que isso pode ser devido* aos serviços de e-mail existentes terem tecnologia legada em produção com [código espaguete](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

A maioria, se não todos, dos provedores de serviços de e-mail existentes são de código fechado ou se anunciam como de código aberto, **mas, na realidade, apenas seu front-end é de código aberto.**

**A parte mais sensível do e-mail** (a interação real de armazenamento/IMAP/SMTP) **é toda feita no back-end (servidor) e *não* no front-end (cliente)**.

### Experimente o encaminhamento de e-mail {#try-out-forward-email}

Inscreva-se hoje em <https://forwardemail.net>! :rocket: