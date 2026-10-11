# Guia do Webmail do Forward Email {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>Resumo:</strong> O <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">webmail</a> é onde você lê e envia emails. O <a href="/my-account/domains">painel web</a> é onde você configura domínios, pseudônimos e senhas. Você entra no webmail com um endereço de pseudônimo e uma senha gerada no painel. O webmail é gratuito e de <a href="/faq#do-you-offer-a-webmail-client">código aberto</a>, e o mesmo app roda no navegador, no desktop, no celular e em um terminal.
</p>


## Índice {#table-of-contents}

* [Onde obter o webmail](#where-to-get-webmail)
* [Webmail e o painel web](#webmail-and-the-web-dashboard)
* [Como entrar](#signing-in)
  * [Gerar uma senha de pseudônimo](#generate-an-alias-password)
  * [Entrar no webmail](#sign-in-to-webmail)
* [Usando mais de uma conta](#using-more-than-one-account)
  * [Enviar como outra conta conectada](#send-as-another-signed-in-account)
* [Enviar de qualquer endereço do seu domínio](#send-from-any-address-on-your-domain)
  * [Passo 1: Gerar uma senha genérica no painel](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Passo 2: Salvá-la no webmail](#step-2-save-it-in-webmail)
  * [Passo 3: Escolher o endereço ao escrever](#step-3-pick-the-address-when-you-compose)
  * [O que saber sobre o envio com senha genérica](#what-to-know-about-catch-all-sending)
* [Configurações do webmail em resumo](#webmail-settings-at-a-glance)
* [Privacidade e App Lock](#privacy-and-app-lock)
* [Solução de problemas](#troubleshooting)


## Onde obter o webmail {#where-to-get-webmail}

| Plataforma                      | Onde                                                                                                                         |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Navegador                       | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (sem instalação) |
| Desktop (macOS, Windows, Linux) | Nossa <a href="/download">página de download</a>                                                                             |
| Celular (Android, iOS)          | Nossa <a href="/download">página de download</a>                                                                             |
| Terminal                        | O comando `forwardemail`. Veja [Vocês têm um app para terminal](/faq#do-you-have-a-terminal-app)                             |

Todos são construídos a partir do mesmo projeto de código aberto, então tudo neste guia se aplica a cada um deles. As configurações e senhas salvas ficam em cada dispositivo, então configure-as em todos os dispositivos que você usa.


## Webmail e o painel web {#webmail-and-the-web-dashboard}

O Forward Email tem dois lugares separados para entrar, e eles usam credenciais diferentes:

|                         | Painel web (forwardemail.net)                                                                            | Webmail (mail.forwardemail.net e os apps)                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Entrar com**          | O email e a senha da sua conta Forward Email (mais 2FA ou uma passkey)                                   | Um endereço de pseudônimo (como `you@example.com`) e sua senha gerada           |
| **Usado para**          | Adicionar domínios, DNS, pseudônimos, cobrança, membros da equipe, gerar senhas, Configurações avançadas | Ler e enviar emails, pastas, etiquetas, pesquisa, calendário, contatos, filtros |
| **Senhas criadas aqui** | Senhas de pseudônimos e senhas genéricas (catch-all)                                                     | Nenhuma. O webmail usa as senhas que você criou no painel                       |

Uma configuração comum é assim:

1. No painel, adicione seu domínio e configure o DNS.
2. Crie um pseudônimo com o armazenamento IMAP ativado (por exemplo `you@example.com`).
3. Gere uma senha para esse pseudônimo.
4. Entre no webmail com esse pseudônimo e essa senha.

Para enviar emails, seu domínio também precisa ter o SMTP de saída ativado em <a href="/my-account/domains">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Configurações avançadas <i class="fa fa-angle-right"></i> Configuração SMTP de saída, igual a qualquer outro cliente de email.


## Como entrar {#signing-in}

### Gerar uma senha de pseudônimo {#generate-an-alias-password}

1. Acesse <a href="/my-account/domains">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> <i class="fa fa-angle-right"></i> Pseudônimos.
2. Ao lado do pseudônimo, clique em **Gerar senha**.
3. Copie a senha. Ela é mostrada uma única vez.

Esta é a mesma senha que você usaria para IMAP, POP3, SMTP, CalDAV e CardDAV. Ela não serve para entrar no painel web.

### Entrar no webmail {#sign-in-to-webmail}

Abra o webmail e digite o endereço completo do pseudônimo e a senha gerada. Se quiser apenas dar uma olhada primeiro, experimente a demonstração na tela de login.


## Usando mais de uma conta {#using-more-than-one-account}

Você pode entrar em vários pseudônimos ao mesmo tempo, até em domínios diferentes. Alterne entre eles pelo menu de contas e gerencie-os em **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. As contas ficam no dispositivo onde você as adicionou e não são sincronizadas.

### Enviar como outra conta conectada {#send-as-another-signed-in-account}

Ao escrever uma mensagem, o menu **From** lista todas as contas conectadas neste dispositivo. Escolha uma para enviar como esse endereço. A mensagem é enviada com a própria senha dessa conta, e a cópia vai para a pasta Enviados dessa conta.


## Enviar de qualquer endereço do seu domínio {#send-from-any-address-on-your-domain}

Se você é dono de um domínio, pode enviar de qualquer endereço nele, como `billing@example.com` ou `no-reply@example.com`, sem criar um pseudônimo e entrar com cada um. Você faz isso com uma **senha genérica** (catch-all) para o domínio.

Você **não** entra no webmail como uma conta curinga ou catch-all, e não há nenhum recurso para ativar. Você salva a senha genérica uma vez nas configurações do webmail, e o menu From passa a permitir que você digite qualquer endereço desse domínio.

### Passo 1: Gerar uma senha genérica no painel {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Acesse <a href="/my-account/domains">Minha Conta <i class="fa fa-angle-right"></i> Domínios</a> e escolha seu domínio.
2. Abra **Configurações avançadas** e encontre **Senhas genéricas**.
3. Clique em **Gerar senha**. Deixe o campo em branco para obter uma senha aleatória forte e adicione uma descrição se quiser (por exemplo "Webmail no meu notebook").
4. Copie a senha. Ela é mostrada uma única vez.

Você precisa ser administrador do domínio para ver esta seção. Use **Gerenciar senhas** no mesmo lugar para ver ou excluir senhas genéricas depois. Excluir uma faz com que ela pare de funcionar em todos os lugares onde está salva.

### Passo 2: Salvá-la no webmail {#step-2-save-it-in-webmail}

1. No webmail, abra **Settings <i class="fa fa-angle-right"></i> General**.
2. Encontre o cartão chamado **Send from any address**, logo abaixo de **Your accounts**.
3. Clique em **Add catch-all password**.
4. Digite o domínio (por exemplo `example.com`) e cole a senha genérica.
5. Clique em **Save**. Você verá "You can now send from any address @example.com".

Você pode salvar senhas para quantos domínios quiser. Para remover uma, clique no ícone de lixeira ao lado dela.

### Passo 3: Escolher o endereço ao escrever {#step-3-pick-the-address-when-you-compose}

1. Comece uma nova mensagem.
2. Abra o menu **From**. Abaixo das suas contas conectadas há uma entrada para cada domínio salvo: **Other address @example.com…**
3. Escolha-a. A linha From vira uma caixa de texto com `@example.com` depois dela.
4. Digite a parte antes do @ (por exemplo `billing`) e envie.

Os rascunhos mantêm o endereço que você digitou, então um rascunho salvo reabre com o mesmo endereço From.

### O que saber sobre o envio com senha genérica {#what-to-know-about-catch-all-sending}

* **Ela só pode enviar.** Uma senha genérica funciona apenas para envio. Ela não abre uma caixa de correio, então você não pode ler emails de `billing@example.com` com ela. Para ler as respostas, crie um pseudônimo (ou um pseudônimo catch-all que encaminhe para você) para esse endereço.
* **As cópias enviadas vão para a conta que você está usando.** Uma mensagem enviada como `billing@example.com` é arquivada na pasta Enviados da conta a partir da qual você escreveu.
* **Ela funciona a partir de todas as contas do dispositivo.** A senha salva não está ligada a uma única conta conectada. Qualquer conta nesse dispositivo pode usá-la.
* **Ela fica neste dispositivo.** A senha é armazenada apenas no dispositivo onde você a salvou. Ela não é sincronizada, e o pareamento de dispositivos por QR não a copia. Adicione-a novamente em cada dispositivo.
* **O App Lock a protege.** Se o App Lock estiver ativado, a senha é criptografada junto com o resto dos seus dados locais, e as entradas **Other address** ficam ocultas enquanto o app está bloqueado.
* **O envio agendado não está disponível** para endereços enviados com uma senha genérica, porque essa senha não consegue ler de volta nem cancelar uma mensagem agendada. Envie imediatamente ou envie como uma conta conectada.
* **Uma senha errada não vai desconectar você.** Se a senha genérica estiver errada ou tiver sido excluída no painel, o envio falha com um erro, e você continua conectado.


## Configurações do webmail em resumo {#webmail-settings-at-a-glance}

| Seção                  | O que abrange                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| **General**            | Suas contas, enviar de qualquer endereço (senhas genéricas), notificações, armazenamento |
| **Appearance**         | Tema, layout, densidade, padrões do editor, assinatura, fonte, links externos            |
| **Privacy & Security** | App Lock, criptografia PGP, opções de privacidade, denúncia de spam                      |
| **Folders & Labels**   | Pastas especiais, suas pastas, etiquetas                                                 |
| **Filters**            | Filtros de email para o pseudônimo conectado                                             |
| **Calendar**           | Início da semana e tarefas                                                               |
| **Search**             | Indexação da pesquisa, saúde do índice, pesquisas salvas, operadores de pesquisa         |
| **Advanced**           | Armazenamento da caixa de correio, cache local e redefinição do app                      |
| **Keyboard Shortcuts** | Todos os atalhos                                                                         |
| **About & Help**       | Versão, download do app para desktop, feedback e links                                   |

Coisas que pertencem ao próprio domínio ou pseudônimo, como DNS, destinatários de encaminhamento, limites de armazenamento, respostas automáticas de férias, senhas genéricas e verificação de spam, são definidas no <a href="/my-account/domains">painel web</a>.


## Privacidade e App Lock {#privacy-and-app-lock}

O webmail mantém uma cópia local dos seus emails para ser rápido e funcionar offline. O **App Lock** (em **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) criptografa esses dados locais, suas configurações e suas senhas salvas no dispositivo, e desbloqueia com uma passkey ou um PIN. Os emails e as atualizações em tempo real vão diretamente entre o app e o Forward Email, sem nenhum serviço de publicidade ou rastreamento no meio.


## Solução de problemas {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

O webmail não tem uma senha para esse endereço neste dispositivo. Entre nesse pseudônimo ou salve a senha genérica do domínio em **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Se o app estiver bloqueado, desbloqueie-o primeiro.

**A entrada "Other address" não aparece no menu From.**

Verifique se você salvou a senha genérica neste dispositivo e se o App Lock está desbloqueado.

**O envio de um endereço catch-all falha com um erro de autenticação.**

A senha genérica pode ter sido excluída ou digitada errado. Gere uma nova no painel, depois remova a antiga no webmail e adicione a nova.

**A senha do meu painel não funciona no webmail.**

O webmail precisa de uma senha de pseudônimo, não da senha do seu painel. Veja [Gerar uma senha de pseudônimo](#generate-an-alias-password).

Ainda com problemas? Veja nossas <a href="/faq">Perguntas Frequentes</a> ou <a href="/help">fale conosco</a>.
