# Email Resistente a Quantum: Como usamos caixas de correio SQLite criptografadas para manter seu email seguro {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Ilustração de serviço de email criptografado seguro contra quantum" class="rounded-lg" />


## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [Comparação de provedores de serviço de email](#email-service-provider-comparison)
* [Como funciona](#how-does-it-work)
* [Tecnologias](#technologies)
  * [Bancos de dados](#databases)
  * [Segurança](#security)
  * [Caixas de correio](#mailboxes)
  * [Concorrência](#concurrency)
  * [Backups](#backups)
  * [Busca](#search)
  * [Projetos](#projects)
  * [Provedores](#providers)
* [Reflexões](#thoughts)
  * [Princípios](#principles)
  * [Experimentos](#experiments)
  * [Falta de alternativas](#lack-of-alternatives)
  * [Experimente o Forward Email](#try-out-forward-email)


## Prefácio {#foreword}

> \[!IMPORTANT]
> Nosso serviço de email é [100% open-source](https://github.com/forwardemail) e focado em privacidade por meio de caixas de correio SQLite seguras e criptografadas.

Até lançarmos o [suporte IMAP](/faq#do-you-support-receiving-email-with-imap), usávamos MongoDB para nossas necessidades de armazenamento persistente de dados.

Essa tecnologia é incrível e ainda a usamos hoje – mas para ter criptografia em repouso com MongoDB, você precisa usar um provedor que ofereça MongoDB Enterprise, como Digital Ocean ou Mongo Atlas – ou pagar por uma licença enterprise (e consequentemente lidar com a latência da equipe de vendas).

Nossa equipe no [Forward Email](https://forwardemail.net) precisava de uma solução de armazenamento amigável para desenvolvedores, escalável, confiável e criptografada para caixas de correio IMAP. Como desenvolvedores open-source, usar uma tecnologia que exige pagamento de licença para obter o recurso de criptografia em repouso ia contra [nossos princípios](#principles) – então experimentamos, pesquisamos e desenvolvemos uma nova solução do zero para atender a essas necessidades.

Em vez de usar um banco de dados compartilhado para armazenar suas caixas de correio, armazenamos e criptografamos individualmente suas caixas de correio com sua senha (que só você possui). **Nosso serviço de email é tão seguro que, se você esquecer sua senha, perderá sua caixa de correio** (e precisará recuperar com backups offline ou recomeçar).

Continue lendo enquanto fazemos uma análise detalhada abaixo com uma [comparação de provedores de serviço de email](#email-service-provider-comparison), [como nosso serviço funciona](#how-does-it-work), [nossa pilha tecnológica](#technologies) e mais.


## Comparação de provedores de serviço de email {#email-service-provider-comparison}

Somos o único provedor de serviço de email 100% open-source e focado em privacidade que armazena caixas de correio SQLite criptografadas individualmente, oferece domínios, aliases e usuários ilimitados, e possui suporte a SMTP de saída, IMAP e POP3:

**Ao contrário de outros provedores de email, você não precisa pagar pelo armazenamento por domínio ou alias com o Forward Email.** O armazenamento é compartilhado em toda a sua conta – então, se você tem múltiplos nomes de domínio personalizados e múltiplos aliases em cada um, somos a solução perfeita para você. Note que você ainda pode impor limites de armazenamento, se desejar, por domínio ou alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Leia a Comparação de Serviços de Email <i class="fa fa-search-plus"></i></a>


## Como funciona {#how-does-it-work}

1. Usando seu cliente de email como Apple Mail, Thunderbird, Gmail ou Outlook – você se conecta aos nossos servidores seguros [IMAP](/faq#do-you-support-receiving-email-with-imap) usando seu nome de usuário e senha:

   * Seu nome de usuário é seu alias completo com seu domínio, como `hello@example.com`.
   * Sua senha é gerada aleatoriamente e exibida para você por apenas 30 segundos quando você clica em <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases.
2. Uma vez conectado, seu cliente de email enviará [comandos do protocolo IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) para o nosso servidor IMAP para manter sua caixa de correio sincronizada. Isso inclui escrever e armazenar rascunhos de emails e outras ações que você possa realizar (por exemplo, marcar um email como Importante ou sinalizar um email como Spam/Lixo Eletrônico).

3. Servidores de troca de email (comumente conhecidos como servidores "MX") recebem novos emails de entrada e os armazenam em sua caixa de correio. Quando isso acontece, seu cliente de email será notificado e sincronizará sua caixa de correio. Nossos servidores de troca de email podem encaminhar seu email para um ou mais destinatários (incluindo [webhooks](/faq#do-you-support-webhooks)), armazenar seu email para você em nosso armazenamento IMAP criptografado, **ou ambos**!

   > \[!TIP]
   > Interessado em saber mais? Leia [como configurar o encaminhamento de email](/faq#how-do-i-get-started-and-set-up-email-forwarding), [como nosso serviço de troca de email funciona](/faq#how-does-your-email-forwarding-system-work), ou veja [nossos guias](/guides).

4. Nos bastidores, nosso design seguro de armazenamento de email funciona de duas maneiras para manter suas caixas de correio criptografadas e acessíveis somente por você:

   * Quando um novo email é recebido para você de um remetente, nossos servidores de troca de email escrevem em uma caixa de correio individual, temporária e criptografada para você.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

   * Quando você se conecta ao nosso servidor IMAP com seu cliente de email, sua senha é então criptografada na memória e usada para ler e escrever em sua caixa de correio. Sua caixa de correio só pode ser lida e escrita com essa senha. Tenha em mente que, como você é o único com essa senha, **somente você** pode ler e escrever em sua caixa de correio quando estiver acessando-a. Na próxima vez que seu cliente de email tentar buscar emails ou sincronizar, suas novas mensagens serão transferidas desta caixa de correio temporária e armazenadas no arquivo da sua caixa de correio real usando a senha fornecida. Note que essa caixa de correio temporária é limpa e deletada depois, para que somente sua caixa de correio protegida por senha contenha as mensagens.

   * **Se você estiver conectado ao IMAP (por exemplo, usando um cliente de email como Apple Mail ou Thunderbird), então não precisamos escrever no armazenamento temporário em disco. Sua senha IMAP criptografada na memória é buscada e usada. Em tempo real, quando uma mensagem está tentando ser entregue para você, enviamos uma requisição WebSocket para todos os servidores IMAP perguntando se eles têm uma sessão ativa para você (esta é a parte da busca), e então subsequentemente passamos essa senha criptografada na memória – assim não precisamos escrever em uma caixa de correio temporária, podemos escrever diretamente na sua caixa de correio criptografada real usando sua senha criptografada.**

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

5. [Backups de suas caixas de correio criptografadas](#backups) são feitos diariamente. Você também pode solicitar um novo backup a qualquer momento ou baixar o backup mais recente em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Apelidos. Se decidir mudar para outro serviço de email, você pode facilmente migrar, baixar, exportar e apagar suas caixas de correio e backups a qualquer momento.


## Tecnologias {#technologies}

### Bancos de Dados {#databases}

Exploramos outras possíveis camadas de armazenamento de banco de dados, porém nenhuma satisfez nossos requisitos tanto quanto o SQLite:
| Banco de Dados                                         |                                                                    Criptografia em repouso                                                                   |  Caixas de Correio [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\))  |                           Licença                           | [Usado em Todo Lugar](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: | :---------------------------------------------------------: | :-------------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Sim com [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                             |                                  :white_check_mark:                                        |               :white_check_mark: Domínio Público              |                      :white_check_mark:                         |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Disponível apenas no MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Banco de dados relacional                               |                   :x: AGPL e `SSPL-1.0`                       |                             :x:                                 |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Somente rede](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Banco de dados relacional                               |                   :white_check_mark: `MIT`                    |                             :x:                                 |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Não testado e ainda não suportado?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Não testado e ainda não suportado?](https://github.com/canonical/dqlite/issues/32)     |              :white_check_mark: `LGPL-3.0-only`               |                             :x:                                 |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Sim](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Banco de dados relacional                               | :white_check_mark: `PostgreSQL` (semelhante a `BSD` ou `MIT`) |                             :x:                                 |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Apenas para InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Banco de dados relacional                               |          :white_check_mark: `GPLv2` e `BUSL-1.1`              |                             :x:                                 |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Recurso apenas para Enterprise](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Banco de dados relacional                               |                  :x: `BUSL-1.1` e outros                      |                             :x:                                 |

> Aqui está um [post de blog que compara várias opções de armazenamento de banco de dados SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) na tabela acima.

### Segurança {#security}

Em todos os momentos usamos [criptografia em repouso](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [criptografia em trânsito](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS sobre HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") usando :tangerine: [Tangerine](https://tangeri.ne), e criptografia [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) nas caixas de correio.  Adicionalmente usamos autenticação de dois fatores baseada em token (em oposição a SMS que é suscetível a [ataques man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), chaves SSH rotativas com acesso root desabilitado, acesso exclusivo a servidores através de endereços IP restritos, e mais.
No caso de um [ataque evil maid](https://en.wikipedia.org/wiki/Evil_maid_attack) ou funcionário desonesto de um fornecedor terceirizado, **sua caixa de correio ainda só pode ser aberta com sua senha gerada**. Fique tranquilo, não dependemos de nenhum fornecedor terceirizado além dos nossos provedores de servidores com conformidade SOC Tipo 2: Cloudflare, DataPacket, Digital Ocean, GitHub e Vultr.

Nosso objetivo é ter o menor número possível de [pontos únicos de falha](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Caixas de correio {#mailboxes}

> **resumo;** Nossos servidores IMAP usam bancos de dados SQLite criptografados individualmente para cada uma de suas caixas de correio.

[SQLite é um banco de dados embarcado extremamente popular](https://www.sqlite.org/mostdeployed.html) – atualmente está rodando no seu telefone e computador – [e é usado por quase todas as principais tecnologias](https://www.sqlite.org/famous.html).

Por exemplo, em nossos servidores criptografados há um banco de dados SQLite para a caixa de correio `linux@example.com`, `info@example.com`, `hello@example.com` e assim por diante – um para cada um como um arquivo de banco de dados `.sqlite`. Também não nomeamos os arquivos do banco de dados com o endereço de e-mail – em vez disso, usamos BSON ObjectID e UUIDs únicos gerados que não revelam a quem a caixa de correio pertence ou qual é o endereço de e-mail (ex.: `353a03f21e534321f5d6e267.sqlite`).

Cada um desses bancos de dados é criptografado usando sua senha (que só você possui) com [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Isso significa que suas caixas de correio são criptografadas individualmente, autossuficientes, [sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) e portáteis.

Ajustamos o SQLite com o seguinte [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA`                 | Propósito                                                                                                                                                                                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [Criptografia de banco de dados SQLite ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Consulte `better-sqlite3-multiple-ciphers` em [Projects](#projects) para mais detalhes.                            |
| `key="****************"` | Esta é sua senha descriptografada apenas na memória que é passada pela conexão IMAP do seu cliente de e-mail para nosso servidor. Novas instâncias do banco de dados são criadas e fechadas para cada sessão de leitura e escrita (para garantir sandboxing e isolamento). |
| `journal_mode=WAL`       | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [que melhora o desempenho e permite acesso concorrente de leitura](https://litestream.io/tips/#wal-journal-mode).                                                                             |
| `busy_timeout=5000`      | Evita erros de bloqueio de escrita [enquanto outras escritas estão ocorrendo](https://litestream.io/tips/#busy-timeout).                                                                                                                                  |
| `synchronous=NORMAL`     | Aumenta a durabilidade das transações [sem risco de corrupção de dados](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                  |
| `foreign_keys=ON`        | Garante que referências de chave estrangeira (ex.: uma relação de uma tabela para outra) sejam aplicadas. [Por padrão isso não está ativado no SQLite](https://www.sqlite.org/foreignkeys.html), mas para validação e integridade dos dados deve ser habilitado. |
| `encoding='UTF-8'`       | [Codificação padrão](https://www.sqlite.org/pragma.html#pragma_encoding) usada para garantir a sanidade do desenvolvedor.                                                                                                                                   |
> Todos os outros padrões são do SQLite conforme especificado na [documentação oficial do PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Concorrência {#concurrency}

> **resumo;** Usamos `WebSocket` para leituras e gravações concorrentes em suas caixas de correio SQLite criptografadas.

#### Leituras {#reads}

Seu cliente de e-mail no seu telefone pode resolver `imap.forwardemail.net` para um dos nossos endereços IP da Digital Ocean – e seu cliente de desktop pode resolver um IP separado de um [provedor](#providers) diferente.

Independentemente de qual servidor IMAP seu cliente de e-mail se conecte, queremos que a conexão leia seu banco de dados em tempo real com 100% de precisão. Isso é feito através de WebSockets.

#### Gravações {#writes}

Gravar no seu banco de dados é um pouco diferente – já que o SQLite é um banco de dados embutido e sua caixa de correio vive em um único arquivo por padrão.

Exploramos opções como `litestream`, `rqlite` e `dqlite` abaixo – no entanto, nenhuma delas satisfez nossos requisitos.

Para realizar gravações com o registro antecipado de gravação ("[WAL](https://www.sqlite.org/wal.html)") ativado – precisamos garantir que apenas um servidor ("Primário") seja responsável por isso.  [WAL](https://www.sqlite.org/wal.html) acelera drasticamente a concorrência e permite um escritor e múltiplos leitores.

O Primário está rodando nos servidores de dados com os volumes montados contendo as caixas de correio criptografadas. Do ponto de vista da distribuição, você pode considerar todos os servidores IMAP individuais atrás de `imap.forwardemail.net` como servidores secundários ("Secundário").

Realizamos comunicação bidirecional com [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Servidores primários usam uma instância do servidor `WebSocketServer` do [ws](https://github.com/websockets/ws).
* Servidores secundários usam uma instância do cliente `WebSocket` do [ws](https://github.com/websockets/ws) que é envolvida com [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) e [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Esses dois wrappers garantem que o `WebSocket` reconecte e possa enviar e receber dados para gravações específicas no banco de dados.

### Backups {#backups}

> **resumo;** Backups das suas caixas de correio criptografadas são feitos diariamente. Você também pode solicitar instantaneamente um novo backup ou baixar o backup mais recente a qualquer momento em <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Aliases.

Para backups, simplesmente executamos o comando SQLite `VACUUM INTO` todos os dias durante o processamento de comandos IMAP, que utiliza sua senha criptografada de uma conexão IMAP em memória. Os backups são armazenados se nenhum backup existente for detectado ou se o hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2) tiver mudado no arquivo em comparação com o backup mais recente.

Observe que usamos o comando `VACUUM INTO` em vez do comando embutido `backup` porque se uma página for modificada durante a operação do comando `backup`, ele precisa recomeçar. O comando `VACUUM INTO` fará uma captura instantânea. Veja estes comentários no [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) e no [Hacker News](https://news.ycombinator.com/item?id=31387556) para mais detalhes.

Além disso, usamos `VACUUM INTO` em vez de `backup`, porque o comando `backup` deixaria o banco de dados não criptografado por um breve período até que o `rekey` fosse invocado (veja este comentário no GitHub [comment](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) para mais detalhes).

O Secundário instruirá o Primário pela conexão `WebSocket` para executar o backup – e o Primário então receberá o comando para fazê-lo e subsequentemente:

1. Conectar-se à sua caixa de correio criptografada.
2. Adquirir um bloqueio de gravação.
3. Executar um checkpoint WAL via `wal_checkpoint(PASSIVE)`.
4. Executar o comando SQLite `VACUUM INTO`.
5. Garantir que o arquivo copiado possa ser aberto com a senha criptografada (proteção/segurança).
6. Fazer upload para o Cloudflare R2 para armazenamento (ou seu próprio provedor, se especificado).
<!--
7. Comprima o arquivo de backup resultante com `gzip`.
8. Faça o upload para o Cloudflare R2 para armazenamento (ou seu próprio provedor, se especificado).
-->

Lembre-se de que suas caixas de correio são criptografadas – e embora tenhamos restrições de IP e outras medidas de autenticação para comunicação WebSocket – no caso de um agente malicioso, você pode ficar tranquilo que, a menos que a carga útil do WebSocket contenha sua senha IMAP, ele não poderá abrir seu banco de dados.

Apenas um backup é armazenado por caixa de correio no momento, mas no futuro podemos oferecer recuperação pontual ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Pesquisa {#search}

Nossos servidores IMAP suportam o comando `SEARCH` com consultas complexas, expressões regulares e mais.

O desempenho rápido da pesquisa é graças ao [FTS5](https://www.sqlite.org/fts5.html) e [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Armazenamos valores `Date` nas caixas de correio SQLite como strings [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (com fuso horário UTC para que comparações de igualdade funcionem corretamente).

Índices também são armazenados para todas as propriedades que estão em consultas de pesquisa.

### Projetos {#projects}

Aqui está uma tabela que descreve os projetos que usamos em nosso código-fonte e processo de desenvolvimento (ordenados alfabeticamente):

| Projeto                                                                                       | Propósito                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | Plataforma de automação DevOps para manter, escalar e gerenciar toda a nossa frota de servidores com facilidade.                                                                                                                                                                                                                                                       |
| [Bree](https://github.com/breejs/bree)                                                        | Agendador de tarefas para Node.js e JavaScript com suporte a cron, datas, ms, later e amigável para humanos.                                                                                                                                                                                                                                                          |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | Biblioteca de logging para JavaScript e Node.js amigável para desenvolvedores, com foco em segurança e privacidade.                                                                                                                                                                                                                                                   |
| [Lad](https://github.com/ladjs/lad)                                                           | Framework Node.js que alimenta toda a nossa arquitetura e design de engenharia com MVC e mais.                                                                                                                                                                                                                                                                         |
| [MongoDB](https://www.mongodb.com/)                                                           | Solução de banco de dados NoSQL que usamos para armazenar todos os outros dados fora das caixas de correio (ex.: sua conta, configurações, domínios e configurações de alias).                                                                                                                                                                                        |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | Modelagem de documentos de objeto MongoDB ("ODM") que usamos em toda nossa stack. Escrevemos helpers especiais que nos permitem simplesmente continuar usando **Mongoose com SQLite** :tada:                                                                                                                                                                        |
| [Node.js](https://nodejs.org/en)                                                              | Node.js é o ambiente de execução JavaScript open-source, multiplataforma, que executa todos os nossos processos de servidor.                                                                                                                                                                                                                                          |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | Pacote Node.js para envio de emails, criação de conexões e mais. Somos patrocinadores oficiais deste projeto.                                                                                                                                                                                                                                                         |
| [Redis](https://redis.io/)                                                                    | Banco de dados em memória para cache, canais de publicação/assinatura e requisições DNS sobre HTTPS.                                                                                                                                                                                                                                                                   |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | Extensão de criptografia para SQLite que permite que arquivos inteiros de banco de dados sejam criptografados (incluindo o write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …).                                                                                                                                                           |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | Editor visual SQLite (que você também pode usar) para testar, baixar e visualizar caixas de correio de desenvolvimento.                                                                                                                                                                                                                                             |
| [SQLite](https://www.sqlite.org/about.html)                                                   | Camada de banco de dados embutida para armazenamento IMAP escalável, autônomo, rápido e resiliente.                                                                                                                                                                                                                                                                     |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Ferramenta Node.js anti-spam, filtragem de email e prevenção de phishing (nossa alternativa ao [Spam Assassin](https://spamassassin.apache.org/) e [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                          |
| [Tangerine](https://tangeri.ne)                                                               | Requisições DNS sobre HTTPS com Node.js e cache usando Redis – que garante consistência global e muito mais.                                                                                                                                                                                                                                                           |
| [Thunderbird](https://www.thunderbird.net/)                                                   | Nossa equipe de desenvolvimento usa este (e também recomenda) como **o cliente de email preferido para usar com Forward Email**.                                                                                                                                                                                                                                    |
| [UTM](https://github.com/utmapp/UTM)                                                          | Nossa equipe de desenvolvimento usa este para criar máquinas virtuais para iOS e macOS a fim de testar diferentes clientes de email (em paralelo) com nossos servidores IMAP e SMTP.                                                                                                                                                                                  |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | Sistema operacional moderno baseado em Linux open-source que alimenta toda a nossa infraestrutura.                                                                                                                                                                                                                                                                    |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | Biblioteca de servidor IMAP – veja suas notas sobre [desduplicação de anexos](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) e [suporte ao protocolo IMAP](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                          |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Biblioteca API rápida e simples para Node.js interagir programaticamente com SQLite3.                                                                                                                                                                                                                                                                                   |
| [email-templates](https://github.com/forwardemail/email-templates)                            | Framework de email amigável para desenvolvedores para criar, pré-visualizar e enviar emails personalizados (ex.: notificações de conta e mais).                                                                                                                                                                                                                      |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | Construtor de consultas SQL usando sintaxe estilo Mongo. Isso economiza tempo da equipe de desenvolvimento, pois podemos continuar escrevendo no estilo Mongo em toda a stack com uma abordagem agnóstica de banco de dados. **Também ajuda a evitar ataques de injeção SQL usando parâmetros de consulta.**                                                        |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | Utilitário SQL para extrair informações sobre o esquema de banco de dados existente. Isso nos permite validar facilmente que todos os índices, tabelas, colunas, restrições e mais são válidos e estão `1:1` com o que deveriam ser. Também escrevemos helpers automatizados para adicionar novas colunas e índices se mudanças forem feitas nos esquemas de banco de dados (com alertas de erro extremamente detalhados). |
| [knex](https://github.com/knex/knex)                                                          | Construtor de consultas SQL que usamos apenas para migrações de banco de dados e validação de esquema através do `knex-schema-inspector`.                                                                                                                                                                                                                              |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Tradução automática de frases [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) com suporte para Markdown usando [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                     |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | Pacote Node.js para resolver e estabelecer conexões com servidores MX e lidar com erros.                                                                                                                                                                                                                                                                              |
| [pm2](https://github.com/Unitech/pm2)                                                         | Gerenciador de processos de produção Node.js com balanceador de carga embutido ([ajustado](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) para desempenho).                                                                                                                                                                                       |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | Biblioteca de servidor SMTP – usamos isso para nossos servidores de troca de email ("MX") e SMTP de saída.                                                                                                                                                                                                                                                            |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | Ferramenta útil para testar servidores IMAP contra benchmarks e compatibilidade com a especificação RFC do protocolo IMAP. Este projeto foi criado pela equipe do [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (um servidor IMAP e POP3 open-source ativo desde julho de 2002). Testamos extensivamente nosso servidor IMAP com esta ferramenta.                                    |
> Você pode encontrar outros projetos que usamos em [nosso código-fonte no GitHub](https://github.com/forwardemail).

### Provedores {#providers}

| Provedor                                        | Propósito                                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | Provedor de DNS, verificações de integridade, balanceadores de carga e armazenamento de backup usando [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Hospedagem de código-fonte, CI/CD e gerenciamento de projetos.                                                                |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hospedagem de servidor dedicado e bancos de dados gerenciados.                                                                |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Hospedagem de servidor dedicado.                                                                                              |
| [DataPacket](https://www.datapacket.com)        | Hospedagem de servidor dedicado.                                                                                              |


## Reflexões {#thoughts}

### Princípios {#principles}

Forward Email foi projetado de acordo com estes princípios:

1. Sempre ser amigável para desenvolvedores, focado em segurança e privacidade, e transparente.
2. Seguir [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Navalha de Occam](https://en.wikipedia.org/wiki/Occam%27s_razor), e [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Alvo são desenvolvedores empreendedores, com poucos recursos, e [ramen-lucrativos](http://www.paulgraham.com/ramenprofitable.html)

### Experimentos {#experiments}

> **resumo;** Em última análise, usar armazenamento de objetos compatível com S3 e/ou Tabelas Virtuais não é tecnicamente viável por razões de desempenho e propenso a erros devido a limitações de memória.

Fizemos alguns experimentos que nos levaram à nossa solução final com SQLite, conforme discutido acima.

Um deles foi tentar usar [rclone]() e SQLite juntos com uma camada de armazenamento compatível com S3.

Esse experimento nos levou a entender melhor e descobrir casos extremos envolvendo rclone, SQLite e uso de [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Se você ativar a flag `--vfs-cache-mode writes` com rclone, as leituras funcionarão bem, porém as gravações serão armazenadas em cache.
  * Se você tiver múltiplos servidores IMAP distribuídos globalmente, o cache ficará desativado entre eles, a menos que tenha um único escritor e múltiplos ouvintes (por exemplo, uma abordagem pub/sub).
  * Isso é incrivelmente complexo e adicionar qualquer complexidade adicional assim resultará em mais pontos únicos de falha.
  * Provedores de armazenamento compatíveis com S3 não suportam alterações parciais de arquivos – o que significa que qualquer alteração no arquivo `.sqlite` resultará em uma alteração completa e reenvio do banco de dados.
  * Outras soluções como `rsync` existem, mas não são focadas no suporte a write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") – então acabamos revisando o Litestream. Felizmente, nosso uso de criptografia já criptografa os arquivos [WAL](https://www.sqlite.org/wal.html) para nós, então não precisamos depender do Litestream para isso. Contudo, ainda não estávamos confiantes no Litestream para uso em produção e temos algumas observações abaixo sobre isso.
  * Usar essa opção `--vfs-cache-mode writes` (a *única* forma de usar SQLite sobre `rclone` para gravações) tentará copiar o banco de dados inteiro do zero na memória – lidar com uma caixa postal de 10 GB é aceitável, porém lidar com múltiplas caixas postais com armazenamento extremamente alto fará com que os servidores IMAP enfrentem limitações de memória e erros `ENOMEM`, falhas de segmentação e corrupção de dados.
* Se você tentar usar [Tabelas Virtuais](https://www.sqlite.org/vtab.html) do SQLite (por exemplo, usando [s3db](https://github.com/jrhy/s3db)) para ter dados armazenados em uma camada compatível com S3, enfrentará vários outros problemas:
  * Leituras e gravações serão extremamente lentas, pois os endpoints da API S3 precisarão ser acessados com métodos HTTP `GET`, `PUT`, `HEAD` e `POST`.
  * Testes de desenvolvimento mostraram que ultrapassar 500K-1M+ registros em internet de fibra ainda é limitado pela taxa de transferência de gravação e leitura para provedores compatíveis com S3. Por exemplo, nossos desenvolvedores executaram loops `for` para fazer tanto declarações SQL `INSERT` sequenciais quanto gravações em massa de grandes quantidades de dados. Em ambos os casos, o desempenho foi surpreendentemente lento.
  * Tabelas virtuais **não podem ter índices**, declarações `ALTER TABLE` e [outras](https://stackoverflow.com/a/12507650) [limitações](https://sqlite.org/lang_createvtab.html) – o que leva a atrasos de 1-2 minutos ou mais dependendo da quantidade de dados.
  * Objetos eram armazenados sem criptografia e não há suporte nativo a criptografia disponível prontamente.
* Também exploramos usar [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) que é conceitual e tecnicamente similar ao ponto anterior (portanto tem os mesmos problemas). Uma possibilidade seria usar uma compilação customizada do `sqlite3` com criptografia, como [wxSQLite3](https://github.com/utelle/wxsqlite3) (que usamos atualmente em nossa solução acima) através de [edição do arquivo de configuração](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Outra abordagem potencial seria usar a extensão [multiplex](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), porém isso tem uma limitação de 32 GB e exigiria construção complexa e dores de cabeça no desenvolvimento.
* Declarações `ALTER TABLE` são necessárias (portanto isso elimina completamente o uso de Tabelas Virtuais). Precisamos de declarações `ALTER TABLE` para que nosso hook com `knex-schema-inspector` funcione corretamente – o que garante que os dados não sejam corrompidos e as linhas recuperadas possam ser convertidas em documentos válidos de acordo com nossas definições de esquema `mongoose` (que incluem validação de restrição, tipo de variável e dados arbitrários).
* Quase todos os projetos compatíveis com S3 relacionados ao SQLite na comunidade open-source são em Python (e não JavaScript, que usamos para 100% da nossa stack).
* Bibliotecas de compressão como [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (veja [comentários](https://news.ycombinator.com/item?id=32303762)) parecem promissoras, mas [podem ainda não estar prontas para uso em produção](https://github.com/phiresky/sqlite-zstd#usage). Em vez disso, compressão do lado da aplicação em tipos de dados como `String`, `Object`, `Map`, `Array`, `Set` e `Buffer` será uma abordagem mais limpa e fácil (e também mais fácil de migrar, já que poderíamos armazenar uma flag ou coluna `Boolean` – ou até usar `PRAGMA` `user_version=1` para compressão ou `user_version=0` para sem compressão como metadados do banco de dados).
  * Felizmente, já temos desduplicação de anexos implementada no armazenamento do nosso servidor IMAP – portanto, cada mensagem com o mesmo anexo não mantém uma cópia do anexo – em vez disso, um único anexo é armazenado para múltiplas mensagens e threads em uma caixa postal (e uma referência estrangeira é usada subsequentemente).
* O projeto Litestream, que é uma solução de replicação e backup para SQLite, é muito promissor e provavelmente o usaremos no futuro.
  * Não para desacreditar o(s) autor(es) – porque adoramos o trabalho e as contribuições deles para o open-source há mais de uma década – porém pelo uso no mundo real parece que [pode haver muitas dores de cabeça](https://github.com/benbjohnson/litestream/issues) e [potencial perda de dados pelo uso](https://github.com/benbjohnson/litestream/issues/218).
* A restauração de backup precisa ser simples e trivial. Usar uma solução como MongoDB com `mongodump` e `mongoexport` não é apenas tedioso, mas demorado e tem complexidade de configuração.
  * Bancos de dados SQLite tornam isso simples (é um único arquivo).
  * Queríamos projetar uma solução onde os usuários pudessem pegar sua caixa postal e sair a qualquer momento.
    * Comandos simples em Node.js para `fs.unlink('mailbox.sqlite'))` e ele é permanentemente apagado do armazenamento em disco.
    * Podemos usar de forma similar uma API compatível com S3 com HTTP `DELETE` para remover facilmente snapshots e backups para os usuários.
  * SQLite foi a solução mais simples, rápida e econômica.
### Falta de alternativas {#lack-of-alternatives}

Até onde sabemos, nenhum outro serviço de e-mail é projetado dessa forma nem é open-source.

Nós *achamos que isso pode ser* devido aos serviços de e-mail existentes terem tecnologia legada em produção com [código espaguete](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

A maioria, se não todos, dos provedores de serviços de e-mail existentes são ou fechados ou anunciam ser open-source, **mas na realidade apenas o front-end deles é open-source.**

**A parte mais sensível do e-mail** (o armazenamento real/interação IMAP/SMTP) **é toda feita no back-end (servidor), e *não* no front-end (cliente)**.

### Experimente o Forward Email {#try-out-forward-email}

Cadastre-se hoje em <https://forwardemail.net>! :rocket:
