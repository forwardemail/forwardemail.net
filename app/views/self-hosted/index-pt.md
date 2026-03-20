# Auto-hospedado {#self-hosted}


## Índice {#table-of-contents}

* [Começando](#getting-started)
* [Requisitos](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Instalação](#install)
  * [Depurar script de instalação](#debug-install-script)
  * [Perguntas](#prompts)
  * [Configuração Inicial (Opção 1)](#initial-setup-option-1)
* [Serviços](#services)
  * [Caminhos importantes de arquivos](#important-file-paths)
* [Configuração](#configuration)
  * [Configuração inicial de DNS](#initial-dns-setup)
* [Integração](#onboarding)
* [Testes](#testing)
  * [Criando seu primeiro alias](#creating-your-first-alias)
  * [Enviando / Recebendo seu primeiro email](#sending--receiving-your-first-email)
* [Solução de problemas](#troubleshooting)
  * [Qual é o nome de usuário e senha do auth básico](#what-is-the-basic-auth-username-and-password)
  * [Como saber o que está rodando](#how-do-i-know-what-is-running)
  * [Como saber se algo que deveria estar rodando não está](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Como encontrar logs](#how-do-i-find-logs)
  * [Por que meus emails de saída estão expirando](#why-are-my-outgoing-emails-timing-out)


## Começando {#getting-started}

Nossa solução de email auto-hospedada, como todos os nossos produtos, é 100% open-source — tanto frontend quanto backend. Isso significa:

1. **Transparência Completa**: Cada linha de código que processa seus emails está disponível para escrutínio público
2. **Contribuições da Comunidade**: Qualquer pessoa pode contribuir com melhorias ou corrigir problemas
3. **Segurança pela Abertura**: Vulnerabilidades podem ser identificadas e corrigidas por uma comunidade global
4. **Sem Dependência de Fornecedor**: Você nunca depende da existência da nossa empresa

Todo o código está disponível no GitHub em <https://github.com/forwardemail/forwardemail.net>, licenciado sob a Licença MIT.

A arquitetura inclui containers para:

* Servidor SMTP para email de saída
* Servidores IMAP/POP3 para recuperação de email
* Interface web para administração
* Banco de dados para armazenamento de configuração
* Redis para cache e desempenho
* SQLite para armazenamento seguro e criptografado das caixas de correio

> \[!NOTE]
> Não deixe de conferir nosso [blog auto-hospedado](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> E para quem estiver interessado em uma versão mais detalhada passo a passo, veja nossos guias baseados em [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) ou [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Requisitos {#requirements}

Antes de executar o script de instalação, certifique-se de ter o seguinte:

* **Sistema Operacional**: Um servidor baseado em Linux (atualmente suportando Ubuntu 22.04+).
* **Recursos**: 1 vCPU e 2GB de RAM
* **Acesso Root**: Privilégios administrativos para executar comandos.
* **Nome de Domínio**: Um domínio personalizado pronto para configuração de DNS.
* **IP Limpo**: Certifique-se de que seu servidor possui um endereço IP limpo, sem reputação de spam anterior, verificando listas negras. Mais informações [aqui](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Endereço IP público com suporte à porta 25
* Capacidade de configurar [PTR reverso](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Suporte a IPv4 e IPv6

> \[!TIP]
> Veja nossa lista de [provedores incríveis de servidores de email](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

A maioria dos provedores de nuvem suporta uma configuração cloud-init para quando o servidor virtual privado (VPS) é provisionado. Esta é uma ótima forma de definir alguns arquivos e variáveis de ambiente antecipadamente para uso pela lógica de configuração inicial dos scripts, o que evitará a necessidade de prompts durante a execução do script para informações adicionais.

**Opções**

* `EMAIL` - email usado para lembretes de expiração do certbot
* `DOMAIN` - domínio personalizado (ex.: `example.com`) usado para configuração de auto-hospedagem
* `AUTH_BASIC_USERNAME` - nome de usuário usado na configuração inicial para proteger o site
* `AUTH_BASIC_PASSWORD` - senha usada na configuração inicial para proteger o site
* `/root/.cloudflare.ini` - (**apenas para usuários Cloudflare**) arquivo de configuração do Cloudflare usado pelo certbot para configuração DNS. Requer que você defina seu token de API via `dns_cloudflare_api_token`. Leia mais [aqui](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
Exemplo:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```


## Instalar {#install}

Execute o seguinte comando no seu servidor para baixar e executar o script de instalação:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Depurar script de instalação {#debug-install-script}

Adicione `DEBUG=true` antes do script de instalação para saída detalhada:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Prompt {#prompts}

```sh
1. Configuração inicial
2. Configurar backups
3. Configurar atualizações automáticas
4. Renovar certificados
5. Restaurar do backup
6. Ajuda
7. Sair
```

* **Configuração inicial**: Baixa o código mais recente do forward email, configura o ambiente, solicita seu domínio personalizado e configura todos os certificados, chaves e segredos necessários.
* **Configurar backup**: Configurará um cron para fazer backup do mongoDB e redis usando um armazenamento compatível com S3 para armazenamento remoto seguro. Separadamente, o sqlite será feito backup no login se houver alterações para backups seguros e criptografados.
* **Configurar atualização**: Configura um cron para procurar atualizações noturnas que irão reconstruir e reiniciar com segurança os componentes da infraestrutura.
* **Renovar certificados**: Certbot / lets encrypt é usado para certificados SSL e as chaves expiram a cada 3 meses. Isso renovará os certificados para seu domínio e os colocará na pasta necessária para que os componentes relacionados possam consumir. Veja [caminhos importantes de arquivos](#important-file-paths)
* **Restaurar do backup**: Irá acionar mongodb e redis para restaurar a partir dos dados de backup.

### Configuração inicial (Opção 1) {#initial-setup-option-1}

Escolha a opção `1. Configuração inicial` para começar.

Quando concluído, você deverá ver uma mensagem de sucesso. Você pode até executar `docker ps` para ver **os** componentes iniciados. Mais informações sobre os componentes abaixo.


## Serviços {#services}

| Nome do Serviço |         Porta Padrão        | Descrição                                            |
| -------------- | :-------------------------: | ---------------------------------------------------- |
| Web            |            `443`            | Interface web para todas as interações administrativas |
| API            |            `4000`           | Camada API para abstrair bancos de dados             |
| Bree           |             Nenhum          | Executor de tarefas e jobs em segundo plano          |
| SMTP           | `465` (recomendado) / `587` | Servidor SMTP para email de saída                     |
| SMTP Bree      |             Nenhum          | Job SMTP em segundo plano                             |
| MX             |            `2525`           | Troca de email para email de entrada e encaminhamento |
| IMAP           |          `993/2993`         | Servidor IMAP para email de entrada e gerenciamento de caixa postal |
| POP3           |          `995/2995`         | Servidor POP3 para email de entrada e gerenciamento de caixa postal |
| SQLite         |            `3456`           | Servidor SQLite para interações com banco(s) de dados sqlite |
| SQLite Bree    |             Nenhum          | Job SQLite em segundo plano                           |
| CalDAV         |            `5000`           | Servidor CalDAV para gerenciamento de calendário     |
| CardDAV        |            `6000`           | Servidor CardDAV para gerenciamento de calendário    |
| MongoDB        |           `27017`           | Banco de dados MongoDB para a maior parte do gerenciamento de dados |
| Redis          |            `6379`           | Redis para cache e gerenciamento de estado           |
| SQLite         |             Nenhum          | Banco(s) de dados SQLite para caixas postais criptografadas |

### Caminhos importantes de arquivos {#important-file-paths}

Nota: *Caminho do host* abaixo é relativo a `/root/forwardemail.net/self-hosting/`.

| Componente             |       Caminho do host       | Caminho no container          |
| --------------------- | :-------------------------: | ---------------------------- |
| MongoDB               |   `./mongo-backups`         | `/backups`                   |
| Redis                 |     `./redis-data`          | `/data`                      |
| Sqlite                |    `./sqlite-data`          | `/mnt/{SQLITE_STORAGE_PATH}` |
| Arquivo Env           |        `./.env`             | `/app/.env`                  |
| Certificados/chaves SSL |        `./ssl`             | `/app/ssl/`                  |
| Chave privada         |  `./ssl/privkey.pem`        | `/app/ssl/privkey.pem`       |
| Certificado cadeia completa | `./ssl/fullchain.pem`   | `/app/ssl/fullchain.pem`     |
| Certificado CA        |    `./ssl/cert.pem`          | `/app/ssl/cert.pem`          |
| Chave privada DKIM    |    `./ssl/dkim.key`          | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Salve o arquivo `.env` com segurança. Ele é crítico para recuperação em caso de falha.
> Você pode encontrá-lo em `/root/forwardemail.net/self-hosting/.env`.


## Configuração {#configuration}

### Configuração inicial de DNS {#initial-dns-setup}

No seu provedor de DNS de preferência, configure os registros DNS apropriados. Note que qualquer coisa entre colchetes (`<>`) é dinâmica e precisa ser atualizada com seu valor.

| Tipo  | Nome               | Conteúdo                     | TTL  |
| ----- | ------------------ | ---------------------------- | ---- |
| A     | "@", ".", ou vazio | <ip_address>                 | auto |
| CNAME | api                | <domain_name>                | auto |
| CNAME | caldav             | <domain_name>                | auto |
| CNAME | carddav            | <domain_name>                | auto |
| CNAME | fe-bounces         | <domain_name>                | auto |
| CNAME | imap               | <domain_name>                | auto |
| CNAME | mx                 | <domain_name>                | auto |
| CNAME | pop3               | <domain_name>                | auto |
| CNAME | smtp               | <domain_name>                | auto |
| MX    | "@", ".", ou vazio | mx.<domain_name> (prioridade 0) | auto |
| TXT   | "@", ".", ou vazio | "v=spf1 a -all"              | auto |

#### DNS reverso / registro PTR {#reverse-dns--ptr-record}

DNS reverso (rDNS) ou registros de ponteiro reverso (registros PTR) são essenciais para servidores de email porque ajudam a verificar a legitimidade do servidor que está enviando o email. Cada provedor de nuvem faz isso de forma diferente, então você precisará pesquisar como adicionar "DNS Reverso" para mapear o host e IP para seu hostname correspondente. Muito provavelmente na seção de rede do provedor.

#### Porta 25 bloqueada {#port-25-blocked}

Alguns ISPs e provedores de nuvem bloqueiam a porta 25 para evitar agentes maliciosos. Você pode precisar abrir um chamado de suporte para liberar a porta 25 para SMTP / email de saída.


## Integração {#onboarding}

1. Abra a Página Inicial
   Navegue para https\://\<domain_name>, substituindo \<domain_name> pelo domínio configurado nas suas configurações DNS. Você deverá ver a página inicial do Forward Email.

2. Faça Login e Integre Seu Domínio

* Faça login com um email e senha válidos.
* Insira o nome do domínio que deseja configurar (deve corresponder à configuração DNS).
* Siga as instruções para adicionar os registros **MX** e **TXT** necessários para verificação.

3. Complete a Configuração

* Uma vez verificado, acesse a página de Aliases para criar seu primeiro alias.
* Opcionalmente, configure **SMTP para email de saída** nas **Configurações do Domínio**. Isso requer registros DNS adicionais.

> \[!NOTE]
> Nenhuma informação é enviada para fora do seu servidor. A opção self hosted e a conta inicial são apenas para login de administrador e visualização web para gerenciar domínios, aliases e configurações de email relacionadas.


## Testes {#testing}

### Criando seu primeiro alias {#creating-your-first-alias}

1. Navegue até a Página de Aliases
   Abra a página de gerenciamento de aliases:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Adicione um Novo Alias

* Clique em **Adicionar Alias** (canto superior direito).
* Insira o nome do alias e ajuste as configurações de email conforme necessário.
* (Opcional) Habilite suporte **IMAP/POP3/CalDAV/CardDAV** selecionando a caixa de seleção.
* Clique em **Criar Alias.**

3. Defina uma Senha

* Clique em **Gerar Senha** para criar uma senha segura.
* Essa senha será necessária para fazer login no seu cliente de email.

4. Configure Seu Cliente de Email

* Use um cliente de email como Thunderbird.
* Insira o nome do alias e a senha gerada.
* Configure as definições de **IMAP** e **SMTP** conforme necessário.

#### Configurações do servidor de email {#email-server-settings}

Nome de usuário: `<alias name>`

| Tipo | Hostname           | Porta | Segurança da Conexão | Autenticação   |
| ---- | ------------------ | ----- | -------------------- | -------------- |
| SMTP | smtp.<domain_name> | 465   | SSL / TLS            | Senha Normal   |
| IMAP | imap.<domain_name> | 993   | SSL / TLS            | Senha Normal   |

### Enviando / Recebendo seu primeiro email {#sending--receiving-your-first-email}

Uma vez configurado, você deverá conseguir enviar e receber emails para seu endereço de email recém-criado e self hosted!
## Solução de Problemas {#troubleshooting}

#### Por que isso não funciona fora do Ubuntu e Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Atualmente estamos buscando suporte para MacOS e consideraremos outros sistemas. Por favor, abra uma [discussão](https://github.com/orgs/forwardemail/discussions) ou contribua se desejar ver outros sistemas suportados.

#### Por que o desafio acme do certbot está falhando {#why-is-the-certbot-acme-challenge-failing}

O erro mais comum é que o certbot / letsencrypt às vezes solicita **2** desafios. Você precisa ter certeza de adicionar **AMBOS** os registros txt.

Exemplo:
Você pode ver dois desafios assim:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Também é possível que a propagação do DNS não tenha sido concluída. Você pode usar ferramentas como: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Isso lhe dará uma ideia se as alterações do seu registro TXT já deveriam estar refletidas. Também é possível que o cache DNS local no seu host ainda esteja usando um valor antigo, desatualizado, ou não tenha captado as alterações recentes.

Outra opção é usar as alterações DNS automatizadas do certbot configurando o arquivo `/root/.cloudflare.ini` com o token da API no seu cloud-init / user-data na configuração inicial do VPS ou criar este arquivo e executar o script novamente. Isso gerenciará as alterações DNS e atualizações do desafio automaticamente.

### Qual é o nome de usuário e senha do basic auth {#what-is-the-basic-auth-username-and-password}

Para auto-hospedagem, adicionamos um pop-up nativo de autenticação do navegador na primeira vez com um nome de usuário simples (`admin`) e senha (gerada aleatoriamente na configuração inicial). Fazemos isso como proteção caso automações / scrapers consigam se registrar primeiro na experiência web. Você pode encontrar essa senha após a configuração inicial no seu arquivo `.env` sob `AUTH_BASIC_USERNAME` e `AUTH_BASIC_PASSWORD`.

### Como saber o que está rodando {#how-do-i-know-what-is-running}

Você pode executar `docker ps` para ver todos os containers em execução que estão sendo iniciados a partir do arquivo `docker-compose-self-hosting.yml`. Também pode executar `docker ps -a` para ver tudo (incluindo containers que não estão em execução).

### Como saber se algo que deveria estar rodando não está {#how-do-i-know-if-something-isnt-running-that-should-be}

Você pode executar `docker ps -a` para ver tudo (incluindo containers que não estão em execução). Pode haver um log de saída ou uma anotação.

### Como encontrar logs {#how-do-i-find-logs}

Você pode obter mais logs via `docker logs -f <container_name>`. Se algo saiu, provavelmente está relacionado ao arquivo `.env` configurado incorretamente.

Dentro da interface web, você pode visualizar `/admin/emails` e `/admin/logs` para logs de emails enviados e logs de erros, respectivamente.

### Por que meus emails de saída estão expirando {#why-are-my-outgoing-emails-timing-out}

Se você vir uma mensagem como Connection timed out when connecting to MX server... então pode ser necessário verificar se a porta 25 está bloqueada. É comum que ISPs ou provedores de nuvem bloqueiem essa porta por padrão, e você pode precisar entrar em contato com o suporte / abrir um chamado para que ela seja liberada.

#### Quais ferramentas devo usar para testar as melhores práticas de configuração de email e reputação de IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Dê uma olhada em nosso [FAQ aqui](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
