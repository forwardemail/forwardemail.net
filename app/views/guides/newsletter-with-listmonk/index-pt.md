# Listmonk com encaminhamento de e-mail para entrega segura de newsletters {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Índice {#table-of-contents}

* [Visão geral](#overview)
* [Por que usar Listmonk e Forward Email](#why-listmonk-and-forward-email)
* [Pré-requisitos](#prerequisites)
* [Instalação](#installation)
  * [1. Atualize seu servidor](#1-update-your-server)
  * [2. Instalar dependências](#2-install-dependencies)
  * [3. Baixe a configuração do Listmonk](#3-download-listmonk-configuration)
  * [4. Configurar Firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Configurar acesso HTTPS](#5-configure-https-access)
  * [6. Inicie o Listmonk](#6-start-listmonk)
  * [7. Configurar o encaminhamento de e-mail SMTP no Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Configurar o processamento de rejeição](#8-configure-bounce-processing)
* [Teste](#testing)
  * [Criar uma lista de discussão](#create-a-mailing-list)
  * [Adicionar assinantes](#add-subscribers)
  * [Criar e enviar uma campanha](#create-and-send-a-campaign)
* [Verificação](#verification)
* [Notas do desenvolvedor](#developer-notes)
* [Conclusão](#conclusion)

## Visão geral {#overview}

Este guia fornece aos desenvolvedores instruções passo a passo para configurar o [Listmonk](https://listmonk.app/), um poderoso gerenciador de newsletters e listas de e-mail de código aberto, para usar o [Encaminhar e-mail](https://forwardemail.net/) como seu provedor SMTP. Essa combinação permite que você gerencie suas campanhas de forma eficaz, garantindo a entrega de e-mails segura, privada e confiável.

* **Listmonk**: Gerencia assinantes, organiza listas, cria campanhas e monitora o desempenho.
* **Encaminhamento de e-mails**: Atua como um servidor SMTP seguro, gerenciando o envio de e-mails com recursos de segurança integrados, como criptografia SPF, DKIM, DMARC e TLS.

Ao integrar esses dois, você mantém controle total sobre seus dados e infraestrutura, ao mesmo tempo em que aproveita o robusto sistema de entrega do Forward Email.

## Por que usar o Listmonk e encaminhar e-mail {#why-listmonk-and-forward-email}

* **Código Aberto**: Tanto o Listmonk quanto os princípios por trás do Forward Email enfatizam a transparência e o controle. Você hospeda o Listmonk e é o proprietário dos seus dados.
* **Focado na Privacidade**: O Forward Email foi desenvolvido com a privacidade em mente, minimizando a retenção de dados e focando na transmissão segura.
* **Custo-Benefício**: O Listmonk é gratuito e o Forward Email oferece planos gratuitos generosos e planos pagos acessíveis, tornando-se uma solução acessível.
* **Escalabilidade**: O Listmonk tem alto desempenho e a infraestrutura do Forward Email foi projetada para entrega confiável em escala.
* **Amigável ao Desenvolvedor**: O Listmonk oferece uma API robusta e o Forward Email oferece integração direta com SMTP e webhooks.

## Pré-requisitos {#prerequisites}

Antes de começar, certifique-se de ter o seguinte:

* Um Servidor Virtual Privado (VPS) executando uma distribuição Linux recente (recomenda-se Ubuntu 20.04+) com pelo menos 1 CPU e 1 GB de RAM (recomenda-se 2 GB).
* Precisa de um provedor? Confira o [lista de VPS recomendados](https://github.com/forwardemail/awesome-mail-server-providers).
* Um nome de domínio que você controla (acesso DNS necessário).
* Uma conta ativa com [Encaminhar e-mail](https://forwardemail.net/).
* Acesso root ou `sudo` ao seu VPS.
* Familiaridade básica com operações de linha de comando do Linux.

## Instalação {#installation}

Estas etapas orientam você na instalação do Listmonk usando o Docker e o Docker Compose no seu VPS.

### 1. Atualize seu servidor {#1-update-your-server}

Certifique-se de que a lista de pacotes do seu sistema e os pacotes instalados estejam atualizados.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar dependências {#2-install-dependencies}

Instale o Docker, o Docker Compose e o UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Baixe a configuração do Listmonk {#3-download-listmonk-configuration}

Crie um diretório para o Listmonk e baixe o arquivo oficial `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Este arquivo define o contêiner do aplicativo Listmonk e seu contêiner de banco de dados PostgreSQL necessário.

### 4. Configurar Firewall (UFW) {#4-configure-firewall-ufw}

Permita tráfego essencial (SSH, HTTP, HTTPS) através do firewall. Se o seu SSH estiver sendo executado em uma porta não padrão, ajuste-o conforme necessário.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Confirme a ativação do firewall quando solicitado.

### 5. Configurar acesso HTTPS {#5-configure-https-access}

Executar o Listmonk via HTTPS é crucial para a segurança. Você tem duas opções principais:

#### Opção A: Usando o Proxy Cloudflare (Recomendado para Simplicidade) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Se o DNS do seu domínio for gerenciado pela Cloudflare, você pode aproveitar o recurso de proxy para HTTPS fácil.

1. **DNS de Ponto**: Crie um registro `A` no Cloudflare para o seu subdomínio Listmonk (por exemplo, `listmonk.yourdomain.com`) apontando para o endereço IP do seu VPS. Certifique-se de que o **Status do Proxy** esteja definido como **Proxied** (nuvem laranja).
2. **Modifique o Docker Compose**: Edite o arquivo `docker-compose.yml` que você baixou:
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Isso torna o Listmonk acessível internamente na porta 80, que o Cloudflare pode então usar como proxy e proteger com HTTPS.

#### Opção B: Usando um proxy reverso (Nginx, Caddy, etc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Como alternativa, você pode configurar um proxy reverso como Nginx ou Caddy no seu VPS para lidar com o encerramento de HTTPS e solicitações de proxy para o Listmonk (executando na porta 9000 por padrão).

* Mantenha o `ports: - "127.0.0.1:9000:9000"` padrão em `docker-compose.yml` para garantir que o Listmonk seja acessível apenas localmente.
* Configure o proxy reverso escolhido para escutar nas portas 80 e 443, processar a aquisição de certificados SSL (por exemplo, via Let's Encrypt) e encaminhar o tráfego para `http://127.0.0.1:9000`.
* A configuração detalhada do proxy reverso está além do escopo deste guia, mas muitos tutoriais estão disponíveis online.

### 6. Inicie o Listmonk {#6-start-listmonk}

Volte para o diretório `listmonk` (se ainda não estiver lá) e inicie os contêineres no modo desanexado.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

O Docker baixará as imagens necessárias e iniciará o aplicativo Listmonk e os contêineres do banco de dados. Pode levar um ou dois minutos na primeira vez.

✅ **Acesse o Listmonk**: Agora você deve conseguir acessar a interface web do Listmonk por meio do domínio configurado (por exemplo, `https://listmonk.yourdomain.com`).

### 7. Configurar o encaminhamento de e-mail SMTP no Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Em seguida, configure o Listmonk para enviar e-mails usando sua conta Forward Email.

1. **Habilite o SMTP no Encaminhamento de E-mails**: Certifique-se de ter gerado as credenciais SMTP no painel da sua conta do Encaminhamento de E-mails. Siga o [Guia de encaminhamento de e-mail para enviar e-mail com um domínio personalizado via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) caso ainda não o tenha feito.
2. **Configurar o Listmonk**: Faça login no seu painel de administração do Listmonk.
* Navegue até **Configurações -> SMTP**.

* O Listmonk possui suporte integrado para Encaminhamento de E-mail. Selecione **ForwardEmail** na lista de provedores ou insira manualmente os seguintes detalhes:

| Contexto | Valor |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Hospedar** | `smtp.forwardemail.net` |
| **Porta** | `465` |
| **Protocolo de autenticação** | `LOGIN` |
| **Nome de usuário** | Seu e-mail de encaminhamento **nome de usuário SMTP** |
| **Senha** | Seu e-mail de encaminhamento **senha SMTP** |
| **TLS** | `SSL/TLS` |
| **Do e-mail** | Seu endereço `From` desejado (por exemplo, `newsletter@yourdomain.com`). Certifique-se de que este domínio esteja configurado em "Encaminhar e-mail". |

* **Importante**: Sempre use a porta `465` com `SSL/TLS` para conexões seguras com o Forward Email. Não use STARTTLS (porta 587).

* Clique em **Salvar**.
3. **Enviar e-mail de teste**: Use o botão "Enviar e-mail de teste" na página de configurações de SMTP. Insira um endereço de destinatário acessível e clique em **Enviar**. Verifique se o e-mail chegou à caixa de entrada do destinatário.

### 8. Configurar o processamento de rejeição {#8-configure-bounce-processing}

O processamento de devoluções permite que o Listmonk trate automaticamente e-mails que não puderam ser entregues (por exemplo, devido a endereços inválidos). O recurso Encaminhar e-mails fornece um webhook para notificar o Listmonk sobre devoluções.

#### Configuração de encaminhamento de e-mail {#forward-email-setup}

1. Faça login no seu [Painel de encaminhamento de e-mail](https://forwardemail.net/).
2. Navegue até **Domínios**, selecione o domínio que você está usando para envio e acesse a página **Configurações**.
3. Role para baixo até a seção **URL do Webhook de Retorno**.
4. Insira a seguinte URL, substituindo `<your_listmonk_domain>` pelo domínio ou subdomínio onde sua instância do Listmonk está acessível:
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Exemplo*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Role para baixo até a seção **Chave de Verificação do Payload da Assinatura do Webhook**.
6. **Copie** a chave de verificação gerada. Você precisará dela no Listmonk.
7. Salve as alterações nas configurações do seu domínio de Encaminhamento de E-mail.

#### Configuração do Listmonk {#listmonk-setup}

1. No painel de administração do Listmonk, navegue até **Configurações -> Rejeições**.
2. Habilite **Habilitar processamento de rejeição**.
3. Habilite **Habilitar webhooks de rejeição**.
4. Role para baixo até a seção **Provedores de Webhook**.
5. Habilite **Encaminhar E-mail**.
6. Cole a **Chave de Verificação de Payload de Assinatura de Webhook** que você copiou do painel de Encaminhamento de E-mail no campo **Chave de Encaminhamento de E-mail**.
7. Clique em **Salvar** na parte inferior da página.
8. O processamento de rejeição agora está configurado! Quando o Encaminhamento de E-mail detectar uma rejeição para um e-mail enviado pelo Listmonk, ele notificará sua instância do Listmonk por meio do webhook, e o Listmonk marcará o assinante de acordo.
9. Conclua as etapas abaixo em [Teste](#testing) para garantir que tudo esteja funcionando.

## Teste {#testing}

Aqui está uma rápida visão geral das principais funções do Listmonk:

### Criar uma lista de discussão {#create-a-mailing-list}

* Acesse **Listas** na barra lateral.
* Clique em **Nova Lista**.
* Preencha os detalhes (Nome, Tipo: Pública/Privada, Descrição, Tags) e **Salvar**.

### Adicionar assinantes {#add-subscribers}

* Navegue até a seção **Assinantes**.
* Você pode adicionar assinantes:
* **Manualmente**: Clique em **Novo Assinante**.
* **Importar**: Clique em **Importar Assinantes** para enviar um arquivo CSV.
* **API**: Use a API do Listmonk para adições programáticas.
* Atribua assinantes a uma ou mais listas durante a criação ou importação.
* **Melhores Práticas**: Use um processo de opt-in duplo. Configure isso em **Configurações -> Opt-in e Assinaturas**.

### Criar e enviar uma campanha {#create-and-send-a-campaign}

* Acesse **Campanhas** -> **Nova Campanha**.
* Preencha os detalhes da campanha (Nome, Assunto, E-mail de origem, Lista(s) para envio).
* Escolha o tipo de conteúdo (Rich Text/HTML, Texto Simples, HTML Simples).
* Crie o conteúdo do seu e-mail. Você pode usar variáveis de modelo como `{{ .Subscriber.Email }}` ou `{{ .Subscriber.FirstName }}`.
* **Sempre envie um e-mail de teste primeiro!** Use a opção "Enviar Teste" para visualizar o e-mail na sua caixa de entrada.
* Quando estiver satisfeito, clique em **Iniciar Campanha** para enviar imediatamente ou agendá-lo para mais tarde.

## Verificação {#verification}

* **Entrega SMTP**: Envie e-mails de teste regularmente pela página de configurações SMTP do Listmonk e teste campanhas para garantir que os e-mails sejam entregues corretamente.
* **Gerenciamento de Rejeições**: Envie uma campanha de teste para um endereço de e-mail inválido conhecido (por exemplo, `bounce-test@yourdomain.com` se você não tiver um endereço real em mãos, embora os resultados possam variar). Verifique as estatísticas da campanha no Listmonk após um breve período para ver se a rejeição foi registrada.
* **Cabeçalhos de E-mail**: Use ferramentas como [Testador de e-mail](https://www.mail-tester.com/) ou inspecione os cabeçalhos de e-mail manualmente para verificar se SPF, DKIM e DMARC estão sendo aprovados, indicando a configuração correta por meio do Encaminhamento de E-mail.
* **Registros de Encaminhamento de E-mail**: Verifique os logs do painel do Encaminhamento de E-mail se suspeitar de problemas de entrega originados no servidor SMTP.

## Notas do desenvolvedor {#developer-notes}

* **Templating**: O Listmonk utiliza o mecanismo de templates do Go. Explore sua documentação para personalização avançada: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: O Listmonk fornece uma API REST abrangente para gerenciar listas, assinantes, campanhas, modelos e muito mais. Encontre o link da documentação da API no rodapé da sua instância do Listmonk.
* **Campos Personalizados**: Defina campos personalizados para assinantes em **Configurações -> Campos de Assinante** para armazenar dados adicionais.
* **Webhooks**: Além de rejeições, o Listmonk pode enviar webhooks para outros eventos (por exemplo, assinaturas), permitindo a integração com outros sistemas.

## Conclusão {#conclusion}

Ao integrar o poder de auto-hospedagem do Listmonk com a entrega segura e respeitosa da privacidade do Forward Email, você cria uma plataforma de marketing por e-mail robusta e ética. Você mantém a propriedade total dos dados do seu público, enquanto se beneficia de alta entregabilidade e recursos de segurança automatizados.

Essa configuração fornece uma alternativa escalável, econômica e amigável ao desenvolvedor aos serviços de e-mail proprietários, alinhando-se perfeitamente com o espírito do software de código aberto e da privacidade do usuário.

Feliz envio! 🚀