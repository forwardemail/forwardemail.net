# Lançamentos auto-hospedados {#self-hosted-releases}

Esta seção documenta o fluxo de trabalho de CI/CD para a solução auto-hospedada da ForwardEmail, explicando como as imagens do Docker são criadas, publicadas e implantadas.

## Índice {#table-of-contents}

* [Visão geral](#overview)
* [Fluxo de trabalho de CI/CD](#cicd-workflow)
  * [Fluxo de trabalho de ações do GitHub](#github-actions-workflow)
  * [Estrutura da imagem do Docker](#docker-image-structure)
* [Processo de Implantação](#deployment-process)
  * [Instalação](#installation)
  * [Configuração do Docker Compose](#docker-compose-configuration)
* [Recursos de manutenção](#maintenance-features)
  * [Atualizações Automáticas](#automatic-updates)
  * [Backup e restauração](#backup-and-restore)
  * [Renovação de Certificado](#certificate-renewal)
* [Controle de versão](#versioning)
* [Acessando Imagens](#accessing-images)
* [Contribuindo](#contributing)

## Visão geral {#overview}

A solução auto-hospedada da ForwardEmail utiliza o GitHub Actions para criar e publicar imagens do Docker automaticamente sempre que uma nova versão é criada. Essas imagens ficam então disponíveis para os usuários implantarem em seus próprios servidores usando o script de configuração fornecido.

> \[!NOTE]
> Há também o [blog auto-hospedado](https://forwardemail.net/blog/docs/self-hosted-solution) e o [guia do desenvolvedor auto-hospedado](https://forwardemail.net/self-hosted)
>
> E para versões mais detalhadas e passo a passo, consulte os guias baseados no [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) ou [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Fluxo de trabalho de CI/CD {#cicd-workflow}

### Fluxo de trabalho de ações do GitHub {#github-actions-workflow}

O processo de criação e publicação da imagem do Docker auto-hospedada é definido em `.github/workflows/docker-image-build-publish.yml`. Este fluxo de trabalho:

1. **Gatilhos**: Executa automaticamente quando uma nova versão do GitHub é publicada
2. **Ambiente**: Executa no Ubuntu com Node.js 18.20.4
3. **Processo de compilação**:
* Verifica o código do repositório
* Configura o Docker Buildx para compilações multiplataforma
* Efetua login no GitHub Container Registry (GHCR)
* Atualiza o esquema para implantação auto-hospedada
* Cria a imagem do Docker usando `self-hosting/Dockerfile-selfhosted`
* Marca a imagem com a versão de lançamento e `latest`
* Envia as imagens para o GitHub Container Registry

```yaml
# Key workflow steps
name: Build and Publish Self-Hosted Docker Image

on:
  release:
    types: [published]  # Trigger on new releases

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      # Setup steps...

      # Build and publish Docker image
      - name: Build / Publish Docker image to GitHub Container Registry
        run: |
          IMAGE_NAME=ghcr.io/${{ github.repository }}-selfhosted:${{ github.ref_name }}
          docker build -f self-hosting/Dockerfile-selfhosted -t $IMAGE_NAME .
          docker tag $IMAGE_NAME ghcr.io/${{ github.repository }}-selfhosted:latest
          docker push $IMAGE_NAME
          docker push ghcr.io/${{ github.repository }}-selfhosted:latest
```

### Estrutura de imagem do Docker {#docker-image-structure}

A imagem do Docker é criada usando uma abordagem de vários estágios definida em `self-hosting/Dockerfile-selfhosted`:

1. **Estágio do Construtor**:
* Utiliza o Node.js 20 como imagem base
* Define a variável de ambiente `SELF_HOSTED=true`
* Instala dependências com pnpm
* Compila o aplicativo em modo de produção

2. **Estágio Final**:
* Utiliza uma imagem Node.js 20 mais compacta
* Instala apenas as dependências de sistema necessárias
* Cria os diretórios necessários para armazenamento de dados
* Copia o aplicativo compilado do estágio de construção

Essa abordagem garante que a imagem final seja otimizada em termos de tamanho e segurança.

## Processo de Implantação {#deployment-process}

### Instalação {#installation}

Os usuários podem implantar a solução auto-hospedada usando o script de configuração fornecido:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Este roteiro:

1. Clona o repositório
2. Configura o ambiente
3. Configura DNS e firewall
4. Gera certificados SSL
5. Extrai as imagens mais recentes do Docker
6. Inicia os serviços usando o Docker Compose

### Configuração do Docker Compose {#docker-compose-configuration}

O arquivo `docker-compose-self-hosted.yml` define todos os serviços necessários para a solução auto-hospedada:

* **Web**: Interface web principal
* **API**: Servidor de API para acesso programático
* **SMTP**: Serviço de envio de e-mails
* **IMAP/POP3**: Serviços de recuperação de e-mails
* **MX**: Serviço de troca de e-mails
* **CalDAV**: Serviço de calendário
* **CardDAV**: Serviço de contatos
* **MongoDB**: Banco de dados para armazenar dados do usuário
* **Redis**: Armazenamento de dados na memória
* **SQLite**: Banco de dados para armazenar e-mails

Cada serviço usa a mesma imagem do Docker, mas com pontos de entrada diferentes, permitindo uma arquitetura modular e simplificando a manutenção.

## Recursos de manutenção {#maintenance-features}

A solução auto-hospedada inclui vários recursos de manutenção:

### Atualizações Automáticas {#automatic-updates}

Os usuários podem habilitar atualizações automáticas que irão:

* Extraia a imagem mais recente do Docker todas as noites
* Reinicie os serviços com a imagem atualizada
* Registre o processo de atualização

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Backup e restauração {#backup-and-restore}

A configuração fornece opções para:

* Configuração de backups regulares para armazenamento compatível com S3
* Backup de dados do MongoDB, Redis e SQLite
* Restauração de backups em caso de falha

### Renovação do Certificado {#certificate-renewal}

Os certificados SSL são gerenciados automaticamente com opções para:

* Gerar novos certificados durante a configuração
* Renovar certificados quando necessário
* Configurar DKIM para autenticação de e-mail

## Controle de versão {#versioning}

Cada versão do GitHub cria uma nova imagem do Docker marcada com:

1. A versão de lançamento específica (por exemplo, `v1.0.0`)
2. A tag `latest` para a versão mais recente

Os usuários podem escolher usar uma versão específica para estabilidade ou a tag `latest` para sempre obter os recursos mais recentes.

## Acessando Imagens {#accessing-images}

As imagens do Docker estão disponíveis publicamente em:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (exemplo de tag de versão)

Nenhuma autenticação é necessária para extrair essas imagens.

## Contribuindo com {#contributing}

Para contribuir com a solução auto-hospedada:

1. Faça alterações nos arquivos relevantes no diretório `self-hosting`
2. Teste localmente ou em um VPS baseado no Ubuntu usando o script `setup.sh` fornecido
3. Envie uma solicitação de pull
4. Após a mesclagem e a criação de uma nova versão, o fluxo de trabalho de CI criará e publicará automaticamente a imagem do Docker atualizada.