# Listmonk com Forward Email para Entrega Segura de Newsletter {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Índice {#table-of-contents}

* [Visão Geral](#overview)
* [Por que Listmonk e Forward Email](#why-listmonk-and-forward-email)
* [Pré-requisitos](#prerequisites)
* [Instalação](#installation)
  * [1. Atualize Seu Servidor](#1-update-your-server)
  * [2. Instale as Dependências](#2-install-dependencies)
  * [3. Baixe a Configuração do Listmonk](#3-download-listmonk-configuration)
  * [4. Configure o Firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Configure o Acesso HTTPS](#5-configure-https-access)
  * [6. Inicie o Listmonk](#6-start-listmonk)
  * [7. Configure o SMTP do Forward Email no Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Configure o Processamento de Bounce](#8-configure-bounce-processing)
* [Testes](#testing)
  * [Crie uma Lista de Emails](#create-a-mailing-list)
  * [Adicione Assinantes](#add-subscribers)
  * [Crie e Envie uma Campanha](#create-and-send-a-campaign)
* [Verificação](#verification)
* [Notas para Desenvolvedores](#developer-notes)
* [Conclusão](#conclusion)


## Visão Geral {#overview}

Este guia fornece aos desenvolvedores instruções passo a passo para configurar o [Listmonk](https://listmonk.app/), um poderoso gerenciador open-source de newsletters e listas de emails, para usar o [Forward Email](https://forwardemail.net/) como seu provedor SMTP. Esta combinação permite que você gerencie suas campanhas de forma eficaz enquanto garante uma entrega de email segura, privada e confiável.

* **Listmonk**: Gerencia assinantes, organização de listas, criação de campanhas e acompanhamento de desempenho.
* **Forward Email**: Atua como servidor SMTP seguro, realizando o envio real dos emails com recursos de segurança integrados como SPF, DKIM, DMARC e criptografia TLS.

Ao integrar esses dois, você mantém controle total sobre seus dados e infraestrutura enquanto aproveita o sistema robusto de entrega do Forward Email.


## Por que Listmonk e Forward Email {#why-listmonk-and-forward-email}

* **Open Source**: Tanto o Listmonk quanto os princípios por trás do Forward Email enfatizam transparência e controle. Você hospeda o Listmonk, sendo dono dos seus dados.
* **Foco em Privacidade**: O Forward Email foi construído com a privacidade como prioridade, minimizando retenção de dados e focando na transmissão segura.
* **Custo-Benefício**: O Listmonk é gratuito, e o Forward Email oferece planos gratuitos generosos e planos pagos acessíveis, tornando esta uma solução econômica.
* **Escalabilidade**: O Listmonk é altamente performático, e a infraestrutura do Forward Email é projetada para entrega confiável em larga escala.
* **Amigável para Desenvolvedores**: O Listmonk oferece uma API robusta, e o Forward Email fornece integração SMTP simples e webhooks.


## Pré-requisitos {#prerequisites}

Antes de começar, certifique-se de ter o seguinte:

* Um Servidor Virtual Privado (VPS) rodando uma distribuição Linux recente (Ubuntu 20.04+ recomendado) com pelo menos 1 CPU e 1GB de RAM (2GB recomendado).
  * Precisa de um provedor? Confira a [lista recomendada de VPS](https://github.com/forwardemail/awesome-mail-server-providers).
* Um nome de domínio que você controla (acesso DNS necessário).
* Uma conta ativa no [Forward Email](https://forwardemail.net/).
* Acesso root ou `sudo` ao seu VPS.
* Familiaridade básica com operações de linha de comando Linux.


## Instalação {#installation}

Estes passos guiam você na instalação do Listmonk usando Docker e Docker Compose no seu VPS.

### 1. Atualize Seu Servidor {#1-update-your-server}

Garanta que a lista de pacotes do sistema e os pacotes instalados estejam atualizados.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instale as Dependências {#2-install-dependencies}

Instale Docker, Docker Compose e UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Baixe a Configuração do Listmonk {#3-download-listmonk-configuration}

Crie um diretório para o Listmonk e baixe o arquivo oficial `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Este arquivo define o container da aplicação Listmonk e seu container de banco de dados PostgreSQL necessário.
### 4. Configurar Firewall (UFW) {#4-configure-firewall-ufw}

Permita o tráfego essencial (SSH, HTTP, HTTPS) através do firewall. Se seu SSH estiver rodando em uma porta não padrão, ajuste conforme necessário.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Confirme a ativação do firewall quando solicitado.

### 5. Configurar Acesso HTTPS {#5-configure-https-access}

Executar o Listmonk via HTTPS é crucial para a segurança. Você tem duas opções principais:

#### Opção A: Usando Proxy Cloudflare (Recomendado pela Simplicidade) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Se o DNS do seu domínio for gerenciado pela Cloudflare, você pode aproveitar o recurso de proxy deles para HTTPS fácil.

1. **Apontar DNS**: Crie um registro `A` na Cloudflare para seu subdomínio Listmonk (ex.: `listmonk.seudominio.com`) apontando para o IP do seu VPS. Certifique-se de que o **Status do Proxy** esteja definido como **Proxied** (nuvem laranja).
2. **Modificar Docker Compose**: Edite o arquivo `docker-compose.yml` que você baixou:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Isso torna o Listmonk acessível internamente na porta 80, que a Cloudflare pode então proxyar e proteger com HTTPS.

#### Opção B: Usando um Proxy Reverso (Nginx, Caddy, etc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativamente, você pode configurar um proxy reverso como Nginx ou Caddy no seu VPS para lidar com a terminação HTTPS e encaminhar as requisições para o Listmonk (rodando na porta 9000 por padrão).

* Mantenha o padrão `ports: - "127.0.0.1:9000:9000"` no `docker-compose.yml` para garantir que o Listmonk seja acessível apenas localmente.
* Configure seu proxy reverso escolhido para escutar nas portas 80 e 443, gerenciar a aquisição do certificado SSL (ex.: via Let's Encrypt) e encaminhar o tráfego para `http://127.0.0.1:9000`.
* A configuração detalhada do proxy reverso está além do escopo deste guia, mas muitos tutoriais estão disponíveis online.

### 6. Iniciar Listmonk {#6-start-listmonk}

Volte para o diretório `listmonk` (se ainda não estiver nele) e inicie os containers em modo destacado.

```bash
cd ~/listmonk # Ou o diretório onde você salvou o docker-compose.yml
docker compose up -d
```

O Docker irá baixar as imagens necessárias e iniciar os containers da aplicação Listmonk e do banco de dados. Pode levar um ou dois minutos na primeira vez.

✅ **Acessar Listmonk**: Agora você deve conseguir acessar a interface web do Listmonk pelo domínio que configurou (ex.: `https://listmonk.seudominio.com`).

### 7. Configurar SMTP do Forward Email no Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Em seguida, configure o Listmonk para enviar e-mails usando sua conta Forward Email.

1. **Habilitar SMTP no Forward Email**: Certifique-se de ter gerado credenciais SMTP no painel da sua conta Forward Email. Siga o [guia do Forward Email para enviar e-mail com domínio personalizado via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) se ainda não o fez.
2. **Configurar Listmonk**: Faça login no painel administrativo do Listmonk.
   * Navegue até **Configurações -> SMTP**.

   * O Listmonk tem suporte nativo para Forward Email. Selecione **ForwardEmail** na lista de provedores, ou insira manualmente os seguintes dados:

     | Configuração      | Valor                                                                                                               |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                             |
     | **Porta**         | `465`                                                                                                               |
     | **Protocolo Auth**| `LOGIN`                                                                                                             |
     | **Usuário**       | Seu **nome de usuário SMTP** do Forward Email                                                                      |
     | **Senha**         | Sua **senha SMTP** do Forward Email                                                                                 |
     | **TLS**           | `SSL/TLS`                                                                                                           |
     | **E-mail de origem** | O endereço `From` desejado (ex.: `newsletter@seudominio.com`). Certifique-se que este domínio está configurado no Forward Email. |
* **Importante**: Sempre use a Porta `465` com `SSL/TLS` para conexões seguras com o Forward Email (recomendado). A porta `587` com STARTTLS também é suportada, mas SSL/TLS é preferido.

   * Clique em **Salvar**.
3. **Enviar E-mail de Teste**: Use o botão "Enviar E-mail de Teste" na página de configurações SMTP. Insira um endereço de destinatário que você possa acessar e clique em **Enviar**. Verifique se o e-mail chega na caixa de entrada do destinatário.

### 8. Configurar Processamento de Rejeições {#8-configure-bounce-processing}

O processamento de rejeições permite que o Listmonk gerencie automaticamente e-mails que não puderam ser entregues (por exemplo, devido a endereços inválidos). O Forward Email fornece um webhook para notificar o Listmonk sobre rejeições.

#### Configuração do Forward Email {#forward-email-setup}

1. Faça login no seu [Painel do Forward Email](https://forwardemail.net/).
2. Navegue até **Domínios**, selecione o domínio que você está usando para envio e vá para a página de **Configurações** dele.
3. Role para baixo até a seção **URL do Webhook de Rejeição**.
4. Insira a seguinte URL, substituindo `<your_listmonk_domain>` pelo domínio ou subdomínio real onde sua instância do Listmonk está acessível:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Exemplo*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Role mais para baixo até a seção **Chave de Verificação da Assinatura do Payload do Webhook**.
6. **Copie** a chave de verificação gerada. Você precisará dela no Listmonk.
7. Salve as alterações nas configurações do domínio no Forward Email.

#### Configuração do Listmonk {#listmonk-setup}

1. No painel administrativo do Listmonk, navegue até **Configurações -> Rejeições**.
2. Ative **Ativar processamento de rejeições**.
3. Ative **Ativar webhooks de rejeição**.
4. Role até a seção **Provedores de Webhook**.
5. Ative **Forward Email**.
6. Cole a **Chave de Verificação da Assinatura do Payload do Webhook** que você copiou do painel do Forward Email no campo **Chave do Forward Email**.
7. Clique em **Salvar** no final da página.
8. O processamento de rejeições está agora configurado! Quando o Forward Email detectar uma rejeição para um e-mail enviado pelo Listmonk, ele notificará sua instância do Listmonk via webhook, e o Listmonk marcará o assinante adequadamente.
9. Complete os passos abaixo em [Testes](#testing) para garantir que tudo está funcionando.

## Testes {#testing}

Aqui está uma visão geral rápida das funções principais do Listmonk:

### Criar uma Lista de E-mails {#create-a-mailing-list}

* Vá para **Listas** na barra lateral.
* Clique em **Nova Lista**.
* Preencha os detalhes (Nome, Tipo: Público/Privado, Descrição, Tags) e **Salve**.

### Adicionar Assinantes {#add-subscribers}

* Navegue até a seção **Assinantes**.
* Você pode adicionar assinantes:
  * **Manualmente**: Clique em **Novo Assinante**.
  * **Importar**: Clique em **Importar Assinantes** para enviar um arquivo CSV.
  * **API**: Use a API do Listmonk para adições programáticas.
* Atribua assinantes a uma ou mais listas durante a criação ou importação.
* **Melhor Prática**: Use um processo de dupla confirmação (double opt-in). Configure isso em **Configurações -> Opt-in & Assinaturas**.

### Criar e Enviar uma Campanha {#create-and-send-a-campaign}

* Vá para **Campanhas** -> **Nova Campanha**.
* Preencha os detalhes da campanha (Nome, Assunto, E-mail do Remetente, Lista(s) para envio).
* Escolha seu tipo de conteúdo (Rich Text/HTML, Texto Simples, HTML Bruto).
* Componha o conteúdo do seu e-mail. Você pode usar variáveis de template como `{{ .Subscriber.Email }}` ou `{{ .Subscriber.FirstName }}`.
* **Sempre envie um e-mail de teste primeiro!** Use a opção "Enviar Teste" para visualizar o e-mail na sua caixa de entrada.
* Quando estiver satisfeito, clique em **Iniciar Campanha** para enviar imediatamente ou agende para depois.

## Verificação {#verification}

* **Entrega SMTP**: Envie regularmente e-mails de teste via a página de configurações SMTP do Listmonk e campanhas de teste para garantir que os e-mails estão sendo entregues corretamente.
* **Tratamento de Rejeições**: Envie uma campanha de teste para um endereço de e-mail inválido conhecido (por exemplo, `bounce-test@yourdomain.com` se você não tiver um real disponível, embora os resultados possam variar). Verifique as estatísticas da campanha no Listmonk após um curto período para ver se a rejeição foi registrada.
* **Cabeçalhos de E-mail**: Use ferramentas como [Mail-Tester](https://www.mail-tester.com/) ou inspecione manualmente os cabeçalhos dos e-mails para verificar se SPF, DKIM e DMARC estão passando, indicando configuração correta via Forward Email.
* **Logs do Forward Email**: Verifique os logs no painel do Forward Email se você suspeitar de problemas de entrega originados no servidor SMTP.
## Notas para Desenvolvedores {#developer-notes}

* **Templating**: Listmonk usa o mecanismo de templates do Go. Explore sua documentação para personalização avançada: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk oferece uma API REST abrangente para gerenciar listas, assinantes, campanhas, templates e mais. Encontre o link da documentação da API no rodapé da sua instância Listmonk.
* **Campos Personalizados**: Defina campos personalizados para assinantes em **Configurações -> Campos do Assinante** para armazenar dados adicionais.
* **Webhooks**: Além de rejeições, Listmonk pode enviar webhooks para outros eventos (ex.: inscrições), permitindo integração com outros sistemas.

## Conclusão {#conclusion}

Ao integrar o poder self-hosted do Listmonk com a entrega segura e respeitadora da privacidade do Forward Email, você cria uma plataforma robusta e ética de marketing por email. Você mantém total propriedade dos dados do seu público enquanto se beneficia de alta entregabilidade e recursos automatizados de segurança.

Esta configuração oferece uma alternativa escalável, econômica e amigável para desenvolvedores aos serviços proprietários de email, alinhando-se perfeitamente com o ethos do software open-source e a privacidade do usuário.

Boas envios! 🚀
