# Auto-hospedado {#self-hosted}

## Índice {#table-of-contents}

* [Começando](#getting-started)
* [Requisitos](#requirements)
  * [Cloud-init / Dados do usuário](#cloud-init--user-data)
* [Instalar](#install)
  * [Script de instalação de depuração](#debug-install-script)
  * [Avisos](#prompts)
  * [Configuração inicial (opção 1)](#initial-setup-option-1)
* [Serviços](#services)
  * [Caminhos de arquivo importantes](#important-file-paths)
* [Configuração](#configuration)
  * [Configuração inicial de DNS](#initial-dns-setup)
* [Integração](#onboarding)
* [Teste](#testing)
  * [Criando seu primeiro alias](#creating-your-first-alias)
  * [Enviando / Recebendo seu primeiro e-mail](#sending--receiving-your-first-email)
* [Solução de problemas](#troubleshooting)
  * [Qual é o nome de usuário e a senha de autenticação básicos?](#what-is-the-basic-auth-username-and-password)
  * [Como sei o que está em execução](#how-do-i-know-what-is-running)
  * [Como posso saber se algo que deveria estar funcionando não está funcionando?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Como encontro os logs](#how-do-i-find-logs)
  * [Por que meus e-mails enviados estão com tempo limite esgotado?](#why-are-my-outgoing-emails-timing-out)

## Introdução {#getting-started}

Nossa solução de e-mail auto-hospedada, assim como todos os nossos produtos, é 100% de código aberto, tanto no front-end quanto no back-end. Isso significa:

1. **Transparência total**: Cada linha de código que processa seus e-mails está disponível para análise pública.
2. **Contribuições da comunidade**: Qualquer pessoa pode contribuir com melhorias ou corrigir problemas.
3. **Segurança por meio da transparência**: Vulnerabilidades podem ser identificadas e corrigidas por uma comunidade global.
4. **Sem dependência de fornecedores**: Você nunca depende da existência da nossa empresa.

Toda a base de código está disponível no GitHub em <https://github.com/forwardemail/forwardemail.net>, licenciado sob a Licença MIT.

A arquitetura inclui contêineres para:

* Servidor SMTP para e-mails de saída
* Servidores IMAP/POP3 para recuperação de e-mails
* Interface web para administração
* Banco de dados para armazenamento de configuração
* Redis para cache e desempenho
* SQLite para armazenamento seguro e criptografado de caixas de correio

> \[!NOTE]
> Não deixe de conferir nosso [blog auto-hospedado](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> E para aqueles interessados em uma versão mais detalhada e passo a passo, consultem nossos guias baseados em [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) ou [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Requisitos {#requirements}

Antes de executar o script de instalação, certifique-se de ter o seguinte:

* **Sistema Operacional**: Um servidor baseado em Linux (atualmente com suporte para Ubuntu 22.04+).
* **Recursos**: 1 vCPU e 2 GB de RAM
* **Acesso Root**: Privilégios administrativos para executar comandos.
* **Nome de Domínio**: Um domínio personalizado pronto para configuração de DNS.
* **IP Limpo**: Certifique-se de que seu servidor tenha um endereço IP limpo, sem reputação anterior de spam, verificando listas negras. Mais informações: [aqui](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Endereço IP público com suporte à porta 25
* Capacidade de definir [PTR reverso](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Suporte a IPv4 e IPv6

> \[!TIP]
> Veja nossa lista de [provedores de servidores de e-mail incríveis](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / Dados do usuário {#cloud-init--user-data}

A maioria dos provedores de nuvem oferece suporte à configuração cloud-init para o provisionamento do servidor virtual privado (VPS). Essa é uma ótima maneira de definir alguns arquivos e variáveis de ambiente com antecedência para uso pela lógica de configuração inicial dos scripts, o que evitará a necessidade de solicitar informações adicionais durante a execução do script.

**Opções**

* `EMAIL` - e-mail usado para lembretes de expiração do certbot
* `DOMAIN` - domínio personalizado (ex.: `example.com`) usado para configuração de auto-hospedagem
* `AUTH_BASIC_USERNAME` - nome de usuário usado na primeira configuração para proteger o site
* `AUTH_BASIC_PASSWORD` - senha usada na primeira configuração para proteger o site
* `/root/.cloudflare.ini` - (**Somente para usuários do Cloudflare**) arquivo de configuração do Cloudflare usado pelo certbot para configuração de DNS. Requer que você defina seu token de API via `dns_cloudflare_api_token`. Saiba mais sobre [aqui](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

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

### Script de instalação de depuração {#debug-install-script}

Adicione `DEBUG=true` antes do script de instalação para obter uma saída detalhada:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Solicita {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Configuração inicial**: Baixe o código de encaminhamento de e-mail mais recente, configure o ambiente, solicite seu domínio personalizado e configure todos os certificados, chaves e segredos necessários.
* **Configuração de backup**: Configurará um cron para fazer backup do MongoDB e do Redis usando um repositório compatível com S3 para armazenamento remoto seguro. Separadamente, o SQLite será copiado no login caso haja alterações nos backups seguros e criptografados.
* **Configuração de atualização**: Configurará um cron para procurar atualizações noturnas que reconstruirão e reiniciarão os componentes da infraestrutura com segurança.
* **Renovação de certificados**: O Certbot/letsencrypt é usado para certificados SSL e as chaves expiram a cada 3 meses. Isso renovará os certificados do seu domínio e os colocará na pasta necessária para o consumo dos componentes relacionados. Consulte [caminhos de arquivo importantes](#important-file-paths)
* **Restauração do backup**: Acionará o MongoDB e o Redis para restaurar os dados do backup.

### Configuração inicial (opção 1) {#initial-setup-option-1}

Escolha a opção `1. Initial setup` para começar.

Após a conclusão, você verá uma mensagem de sucesso. Você pode até executar `docker ps` para ver **os** componentes sendo executados. Mais informações sobre componentes abaixo.

## Serviços {#services}

| Nome do serviço | Porta padrão | Descrição |
| ------------ | :----------: | ------------------------------------------------------ |
| Rede | `443` | Interface web para todas as interações administrativas |
| API | `4000` | Camada de API para abstrair bancos de dados |
| Bri | Nenhum | Trabalho em segundo plano e executor de tarefas |
| SMTP | `465/587` | Servidor SMTP para e-mail de saída |
| SMTP Bree | Nenhum | Trabalho em segundo plano SMTP |
| MX | `2525` | Troca de e-mail para e-mail de entrada e encaminhamento de e-mail |
| IMAP | `993/2993` | Servidor IMAP para e-mail de entrada e gerenciamento de caixa de correio |
| POP3 | `995/2995` | Servidor POP3 para e-mail de entrada e gerenciamento de caixa de correio |
| SQLite | `3456` | Servidor SQLite para interações com bancos de dados sqlite |
| SQLite Bree | Nenhum | Trabalho em segundo plano do SQLite |
| CalDAV | `5000` | Servidor CalDAV para gerenciamento de calendário |
| CardDAV | `6000` | Servidor CardDAV para gerenciamento de calendário |
| MongoDB | `27017` | Banco de dados MongoDB para a maioria dos gerenciamentos de dados |
| Redis | `6379` | Redis para cache e gerenciamento de estado |
| SQLite | Nenhum | Banco(s) de dados SQLite para caixas de correio criptografadas |

### Caminhos de arquivo importantes {#important-file-paths}

Observação: o *caminho do host* abaixo é relativo a `/root/forwardemail.net/self-hosting/`.

| Componente | Caminho do host | Caminho do contêiner |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Arquivo env | `./.env` | `/app/.env` |
| Certificados/chaves SSL | `./ssl` | `/app/ssl/` |
| Chave privada | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Certificado de cadeia completa | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| CAs certificados | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| Chave privada DKIM | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Salve o arquivo `.env` com segurança. Ele é essencial para a recuperação em caso de falha.
> Você pode encontrá-lo em `/root/forwardemail.net/self-hosting/.env`.

## Configuração {#configuration}

### Configuração inicial de DNS {#initial-dns-setup}

No provedor de DNS de sua escolha, configure os registros DNS apropriados. Observe que tudo entre colchetes (`<>`) é dinâmico e precisa ser atualizado com seu valor.

| Tipo | Nome | Contente | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", "." ou em branco | <endereço_ip> | auto |
| CNAME | API | <nome_de_domínio> | auto |
| CNAME | caldav | <nome_de_domínio> | auto |
| CNAME | cartão de crédito | <nome_de_domínio> | auto |
| CNAME | fe-bounces | <nome_de_domínio> | auto |
| CNAME | imap | <nome_de_domínio> | auto |
| CNAME | méxico | <nome_de_domínio> | auto |
| CNAME | pop3 | <nome_de_domínio> | auto |
| CNAME | SMTP | <nome_de_domínio> | auto |
| MX | "@", "." ou em branco | mx.<nome_de_domínio> (prioridade 0) | auto |
| TXT | "@", "." ou em branco | "v=spf1 a -all" | auto |

#### Registro DNS/PTR reverso {#reverse-dns--ptr-record}

DNS reverso (rDNS) ou registros de ponteiro reverso (registros PTR) são essenciais para servidores de e-mail, pois ajudam a verificar a legitimidade do servidor que envia o e-mail. Cada provedor de nuvem faz isso de forma diferente, então você precisará pesquisar como adicionar "DNS reverso" para mapear o host e o IP ao nome de host correspondente. Provavelmente, na seção de rede do provedor.

#### Porta 25 bloqueada {#port-25-blocked}

Alguns ISPs e provedores de nuvem bloqueiam a porta 25 para evitar invasores. Talvez seja necessário abrir um chamado de suporte para liberar a porta 25 para SMTP/e-mails de saída.

## Integração {#onboarding}

1. Abra a Landing Page
Navegue até https://<nome_do_domínio>, substituindo \<nome_do_domínio> pelo domínio configurado nas suas configurações de DNS. Você deverá ver a landing page "Encaminhar E-mail".

2. Faça login e integre seu domínio

* Entre com um e-mail e senha válidos.
* Insira o nome de domínio que deseja configurar (ele deve corresponder à configuração de DNS).
* Siga as instruções para adicionar os registros **MX** e **TXT** necessários para verificação.

3. Configuração completa

* Após a verificação, acesse a página Aliases para criar seu primeiro alias.
* Opcionalmente, configure **SMTP para e-mails de saída** nas **Configurações de Domínio**. Isso requer registros DNS adicionais.

> \[!NOTE]
> Nenhuma informação é enviada para fora do seu servidor. A opção de auto-hospedagem e a conta inicial servem apenas para login de administrador e visualização web para gerenciar domínios, aliases e configurações de e-mail relacionadas.

## Teste {#testing}

### Criando seu primeiro alias {#creating-your-first-alias}

1. Navegue até a página de aliases
Abra a página de gerenciamento de aliases:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Adicione um novo alias

* Clique em **Adicionar Alias** (canto superior direito).
* Insira o nome do alias e ajuste as configurações de e-mail conforme necessário.
* (Opcional) Ative o suporte a **IMAP/POP3/CalDAV/CardDAV** marcando a caixa de seleção.
* Clique em **Criar Alias.**

3. Defina uma senha

* Clique em **Gerar Senha** para criar uma senha segura.
* Esta senha será necessária para acessar seu cliente de e-mail.

4. Configure seu cliente de e-mail

* Use um cliente de e-mail como o Betterbird.
* Insira o nome do alias e a senha gerada.
* Configure as configurações de **IMAP** e **SMTP** adequadamente.

#### Configurações do servidor de e-mail {#email-server-settings}

Nome de usuário: `<alias name>`

| Tipo | Nome do host | Porta | Segurança de conexão | Autenticação |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<nome_de_domínio> | 465 | SSL / TLS | Senha normal |
| IMAP | imap.<nome_de_domínio> | 993 | SSL / TLS | Senha normal |

### Enviando / Recebendo seu primeiro e-mail {#sending--receiving-your-first-email}

Depois de configurado, você poderá enviar e receber e-mails no seu endereço de e-mail recém-criado e auto-hospedado!

## Solução de problemas {#troubleshooting}

#### Por que isso não funciona fora do Ubuntu e do Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

No momento, estamos buscando suporte para MacOS e buscaremos outros. Abra um [discussão](https://github.com/orgs/forwardemail/discussions) ou contribua se desejar ver outros recursos suportados.

#### Por que o desafio certbot acme está falhando {#why-is-the-certbot-acme-challenge-failing}

O erro mais comum é que o certbot/letsencrypt às vezes solicita **2** desafios. Você precisa adicionar **AMBOS** os registros txt.

Exemplo:
Você pode ver dois desafios como este:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Também é possível que a propagação do DNS não tenha sido concluída. Você pode usar ferramentas como `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Isso lhe dará uma ideia se as alterações no seu registro TXT devem ser refletidas. Também é possível que o cache DNS local no seu host ainda esteja usando um valor antigo e obsoleto ou não tenha detectado as alterações recentes.

Outra opção é usar as alterações automáticas de DNS do Cerbot, definindo o arquivo `/root/.cloudflare.ini` com o token da API em seu cloud-init / user-data na configuração inicial do VPS ou criar este arquivo e executar o script novamente. Isso gerenciará as alterações de DNS e as atualizações de desafio automaticamente.

### Qual é o nome de usuário e a senha de autenticação básicos {#what-is-the-basic-auth-username-and-password}

Para auto-hospedagem, adicionamos um pop-up de autenticação nativa do navegador para a primeira vez, com um nome de usuário simples (`admin`) e uma senha (gerada aleatoriamente na configuração inicial). Adicionamos isso apenas como proteção caso a automação/raspadores de alguma forma o impeçam de se cadastrar pela primeira vez na experiência web. Você pode encontrar essa senha após a configuração inicial no seu arquivo `.env`, em `AUTH_BASIC_USERNAME` e `AUTH_BASIC_PASSWORD`.

### Como sei o que está em execução {#how-do-i-know-what-is-running}

Você pode executar `docker ps` para ver todos os contêineres em execução que estão sendo gerados a partir do arquivo `docker-compose-self-hosting.yml`. Você também pode executar `docker ps -a` para ver tudo (incluindo os contêineres que não estão em execução).

### Como posso saber se algo não está em execução e deveria estar {#how-do-i-know-if-something-isnt-running-that-should-be}

Você pode executar `docker ps -a` para ver tudo (incluindo contêineres que não estão em execução). Você pode ver um log de saída ou uma nota.

### Como encontro os logs {#how-do-i-find-logs}

Você pode obter mais logs via `docker logs -f <container_name>`. Se algo saiu, provavelmente está relacionado à configuração incorreta do arquivo `.env`.

Na interface da web, você pode visualizar `/admin/emails` e `/admin/logs` para logs de e-mail de saída e logs de erro, respectivamente.

### Por que meus e-mails enviados estão com tempo limite esgotado {#why-are-my-outgoing-emails-timing-out}

Se você vir uma mensagem como "Tempo limite de conexão esgotado" ao conectar ao servidor MX..., talvez seja necessário verificar se a porta 25 está bloqueada. É comum que ISPs ou provedores de nuvem bloqueiem essa porta por padrão, e você pode precisar entrar em contato com o suporte/abrir um ticket para resolver o problema.

#### Quais ferramentas devo usar para testar as práticas recomendadas de configuração de e-mail e reputação de IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Dê uma olhada em nosso [Perguntas frequentes aqui](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).