# Guia Completo para Configuração de Email NAS com Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Configurar notificações por email no seu NAS não precisa ser complicado. Seja você usuário de Synology, QNAP ou até mesmo de um Raspberry Pi, este guia fará seu dispositivo se comunicar com o Forward Email para que você realmente saiba quando algo der errado.

A maioria dos dispositivos NAS pode enviar alertas por email para falhas de disco, avisos de temperatura, conclusão de backup e eventos de segurança. O problema? Muitos provedores de email ficaram exigentes quanto à segurança, e dispositivos mais antigos frequentemente não conseguem acompanhar. É aí que o Forward Email entra - nós suportamos dispositivos modernos e legados.

Este guia cobre a configuração de email para mais de 75 provedores de NAS com instruções passo a passo, informações de compatibilidade e dicas de solução de problemas. Não importa qual dispositivo você esteja usando, vamos fazer suas notificações funcionarem.


## Índice {#table-of-contents}

* [Por Que Você Precisa de Notificações por Email no NAS](#why-you-need-nas-email-notifications)
* [O Problema do TLS (E Como Nós Resolvemos)](#the-tls-problem-and-how-we-fix-it)
* [Configurações SMTP do Forward Email](#forward-email-smtp-settings)
* [Matriz Abrangente de Compatibilidade de Provedores NAS](#comprehensive-nas-provider-compatibility-matrix)
* [Configuração de Email no Synology NAS](#synology-nas-email-configuration)
  * [Passos de Configuração](#configuration-steps)
* [Configuração de Email no QNAP NAS](#qnap-nas-email-configuration)
  * [Passos de Configuração](#configuration-steps-1)
  * [Problemas Comuns de Solução de Problemas no QNAP](#common-qnap-troubleshooting-issues)
* [Configuração Legada do ReadyNAS](#readynas-legacy-configuration)
  * [Passos de Configuração Legada](#legacy-configuration-steps)
  * [Solução de Problemas no ReadyNAS](#readynas-troubleshooting)
* [Configuração do TerraMaster NAS](#terramaster-nas-configuration)
* [Configuração do ASUSTOR NAS](#asustor-nas-configuration)
* [Configuração do Buffalo TeraStation](#buffalo-terastation-configuration)
* [Configuração do Western Digital My Cloud](#western-digital-my-cloud-configuration)
* [Configuração de Email no TrueNAS](#truenas-email-configuration)
* [Configuração do OpenMediaVault](#openmediavault-configuration)
* [Configuração do Raspberry Pi NAS](#raspberry-pi-nas-configuration)
  * [Configuração Inicial do Raspberry Pi](#initial-raspberry-pi-setup)
  * [Configuração de Compartilhamento de Arquivos Samba](#samba-file-sharing-configuration)
  * [Configuração do Servidor FTP](#ftp-server-setup)
  * [Configuração de Notificações por Email](#email-notification-configuration)
  * [Recursos Avançados do Raspberry Pi NAS](#advanced-raspberry-pi-nas-features)
  * [Solução de Problemas de Email no Raspberry Pi](#raspberry-pi-email-troubleshooting)
  * [Otimização de Desempenho](#performance-optimization)
  * [Considerações de Segurança](#security-considerations)


## Por Que Você Precisa de Notificações por Email no NAS {#why-you-need-nas-email-notifications}

Seu NAS monitora um monte de coisas - saúde dos discos, temperatura, problemas de rede, eventos de segurança. Sem alertas por email, problemas podem passar despercebidos por semanas, potencialmente causando perda de dados ou brechas de segurança.

Notificações por email dão alertas imediatos quando os discos começam a falhar, avisam sobre tentativas de acesso não autorizadas, confirmam backups bem-sucedidos e mantêm você informado sobre a saúde do sistema. O Forward Email garante que essas notificações críticas realmente cheguem até você.


## O Problema do TLS (E Como Nós Resolvemos) {#the-tls-problem-and-how-we-fix-it}

Aqui está o problema: se seu NAS foi fabricado antes de 2020, provavelmente só suporta TLS 1.0. Gmail, Outlook e a maioria dos provedores abandonaram o suporte para isso há anos. Seu dispositivo tenta enviar email, é rejeitado, e você fica no escuro.

O Forward Email resolve isso com suporte a portas duplas. Dispositivos modernos usam nossas portas padrão (`465` e `587`), enquanto dispositivos mais antigos podem usar nossas portas legadas (`2455` e `2555`) que ainda suportam TLS 1.0.

> \[!IMPORTANT]
> O Forward Email suporta dispositivos NAS modernos e legados através da nossa estratégia de portas duplas. Use as portas 465/587 para dispositivos modernos com suporte a TLS 1.2+, e as portas 2455/2555 para dispositivos legados que suportam apenas TLS 1.0.


## Configurações SMTP do Forward Email {#forward-email-smtp-settings}
Aqui está o que você precisa saber sobre nossa configuração SMTP:

**Para dispositivos NAS modernos (2020+):** Use `smtp.forwardemail.net` com a porta `465` (SSL/TLS) ou porta `587` (STARTTLS). Estes funcionam com firmware atual que suporta TLS 1.2+.

**Para dispositivos NAS mais antigos:** Use `smtp.forwardemail.net` com a porta `2455` (SSL/TLS) ou porta `2555` (STARTTLS). Estes suportam TLS 1.0 para dispositivos legados.

**Autenticação:** Use seu alias do Forward Email como nome de usuário e a senha gerada em [Minha Conta -> Domínios -> Aliases](https://forwardemail.net/my-account/domains) (não sua senha de conta).

> \[!CAUTION]
> Nunca use sua senha de login da conta para autenticação SMTP. Sempre use a senha gerada em [Minha Conta -> Domínios -> Aliases](https://forwardemail.net/my-account/domains) para configuração do NAS.

> \[!TIP]
> Verifique a versão do firmware do seu dispositivo NAS e o suporte a TLS antes da configuração. A maioria dos dispositivos fabricados após 2020 suporta protocolos TLS modernos, enquanto dispositivos mais antigos normalmente requerem portas de compatibilidade legada.


## Matriz Abrangente de Compatibilidade de Provedores NAS {#comprehensive-nas-provider-compatibility-matrix}

A matriz a seguir fornece informações detalhadas de compatibilidade para os principais provedores NAS, incluindo níveis de suporte TLS, status do firmware e configurações recomendadas para o Forward Email.

| Provedor NAS    | Modelos Atuais | Suporte TLS | Status do Firmware | Portas Recomendadas | Problemas Comuns                                                                                                                                       | Guia de Configuração/Capturas de Tela                                                                                                           |
| --------------- | -------------- | ----------- | ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology        | DSM 7.x        | TLS 1.2+    | Ativo             | `465`, `587`        | [Configuração STARTTLS](https://community.synology.com/enu/forum/2/post/124584)                                                                       | [Configuração de Notificação por Email DSM](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                  |
| QNAP            | QTS 5.x        | TLS 1.2+    | Ativo             | `465`, `587`        | [Falhas no Centro de Notificações](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525) | [Configuração do Servidor de Email QTS](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi    | Raspberry Pi OS| TLS 1.2+    | Ativo             | `465`, `587`        | [Problemas de resolução DNS](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                               | [Guia de Configuração de Email Raspberry Pi](#raspberry-pi-nas-configuration)                                                                  |
| ASUSTOR         | ADM 4.x        | TLS 1.2+    | Ativo             | `465`, `587`        | [Validação de certificado](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                     | [Configuração de Notificações ASUSTOR](https://www.asustor.com/en/online/online_help?id=8)                                                      |
| TerraMaster     | TOS 6.x        | TLS 1.2     | Ativo             | `465`, `587`        | [Autenticação SMTP](https://www.terra-master.com/global/forum/)                                                                                       | [Configuração de Email TerraMaster](https://www.terra-master.com/global/support/download.php)                                                   |
| TrueNAS         | SCALE/CORE     | TLS 1.2+    | Ativo             | `465`, `587`        | [Configuração de certificado SSL](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                  | [Guia de Configuração de Email TrueNAS](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)         |
| Buffalo         | TeraStation    | TLS 1.2     | Limitado          | `465`, `587`        | [Compatibilidade de firmware](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)    | [Configuração de Email TeraStation](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital | My Cloud OS 5  | TLS 1.2     | Limitado          | `465`, `587`        | [Compatibilidade com OS legado](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                          | [Configuração de Email My Cloud](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                    |
| OpenMediaVault  | OMV 7.x        | TLS 1.2+    | Ativo             | `465`, `587`        | [Dependências de plugins](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                  | [Configuração de Notificações OMV](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                         |
| Netgear ReadyNAS| OS 6.x         | TLS 1.0 apenas | Descontinuado    | `2455`, `2555`      | [Suporte TLS legado](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                         | [Configuração de Alertas de Email ReadyNAS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) |
| Drobo           | Dashboard      | TLS 1.2     | Descontinuado     | `465`, `587`        | [Suporte limitado](https://myprojects.drobo.com/support/)                                                                                             | [Notificações de Email Drobo](https://www.drobo.com/support/)                                                                                   |
Esta matriz demonstra a clara divisão entre sistemas NAS modernos, ativamente mantidos, e dispositivos legados que requerem considerações especiais de compatibilidade. A maioria dos dispositivos NAS atuais suporta padrões modernos de TLS e pode usar as portas SMTP principais do Forward Email sem qualquer configuração especial.


## Configuração de Email do Synology NAS {#synology-nas-email-configuration}

Dispositivos Synology com DSM são bastante simples de configurar. Eles suportam TLS moderno, então você pode usar nossas portas padrão sem problemas.

> \[!NOTE]
> O Synology DSM 7.x oferece os recursos de notificação por email mais abrangentes. Versões antigas do DSM podem ter opções de configuração limitadas.

### Passos de Configuração {#configuration-steps}

1. **Acesse a interface web do DSM** digitando o endereço IP do seu dispositivo NAS ou o ID QuickConnect em um navegador web.

2. **Navegue até o Painel de Controle** e selecione a seção "Notificação", depois clique na aba "Email" para acessar as opções de configuração de email.

3. **Ative as notificações por email** marcando a caixa "Ativar notificações por email".

4. **Configure o servidor SMTP** inserindo `smtp.forwardemail.net` como o endereço do servidor.

5. **Defina a configuração da porta** para a porta 465 para conexões SSL/TLS (recomendado). A porta 587 com STARTTLS também é suportada como alternativa.

6. **Configure a autenticação** selecionando "Autenticação SMTP necessária" e inserindo seu alias do Forward Email no campo de nome de usuário.

7. **Digite sua senha** usando a senha gerada em [Minha Conta -> Domínios -> Aliases](https://forwardemail.net/my-account/domains).

8. **Configure os endereços dos destinatários** inserindo até cinco endereços de email que devem receber as notificações.

9. **Configure o filtro de notificações** para controlar quais eventos disparam alertas por email, evitando sobrecarga de notificações enquanto garante que eventos críticos sejam reportados.

10. **Teste a configuração** usando a função de teste integrada do DSM para verificar se todas as configurações estão corretas e a comunicação com os servidores do Forward Email está funcionando adequadamente.

> \[!TIP]
> O Synology permite diferentes tipos de notificação para diferentes destinatários, oferecendo flexibilidade na forma como os alertas são distribuídos pela sua equipe.


## Configuração de Email do QNAP NAS {#qnap-nas-email-configuration}

Dispositivos QNAP com QTS funcionam muito bem com o Forward Email. Eles suportam TLS moderno e possuem uma interface web agradável para configuração.

> \[!IMPORTANT]
> O QNAP QTS 5.2.4 teve um problema conhecido com notificações por email que foi [corrigido no QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Certifique-se de que seu firmware está atualizado para evitar falhas nas notificações.

### Passos de Configuração {#configuration-steps-1}

1. **Acesse a interface web do seu dispositivo QNAP** digitando seu endereço IP em um navegador web.

2. **Navegue até o Painel de Controle** e selecione "Conta de Serviço e Emparelhamento de Dispositivo", depois clique na seção "E-mail" para iniciar a configuração do email.

3. **Clique em "Adicionar Serviço SMTP"** para criar uma nova configuração de email.

4. **Configure o servidor SMTP** inserindo `smtp.forwardemail.net` como o endereço do servidor SMTP.

5. **Selecione o protocolo de segurança apropriado** - escolha "SSL/TLS" com a porta `465` (recomendado). A porta `587` com STARTTLS também é suportada.

6. **Configure o número da porta** - a porta `465` com SSL/TLS é recomendada. A porta `587` com STARTTLS também está disponível, se necessário.

7. **Digite suas credenciais de autenticação** usando seu alias do Forward Email como nome de usuário e sua senha gerada em [Minha Conta -> Domínios -> Aliases](https://forwardemail.net/my-account/domains).

8. **Configure as informações do remetente** inserindo um nome descritivo para o campo "De", como "Sistema NAS QNAP" ou o nome do host do seu dispositivo.

9. **Configure os endereços dos destinatários** para diferentes tipos de notificação. O QNAP permite configurar múltiplos grupos de destinatários para diferentes tipos de alerta.

10. **Teste a configuração** usando a função de teste de email integrada do QNAP para verificar se todas as configurações estão funcionando corretamente.

> \[!TIP]
> Se você encontrar [problemas de configuração SMTP do Gmail](https://forum.qnap.com/viewtopic.php?t=152466), os mesmos passos de solução de problemas se aplicam ao Forward Email. Certifique-se de que a autenticação está devidamente habilitada e as credenciais estão corretas.
> \[!NOTE]
> Dispositivos QNAP suportam agendamento avançado de notificações, permitindo configurar horários silenciosos quando notificações não críticas são suprimidas. Isso é particularmente útil em ambientes empresariais.

### Problemas Comuns de Solução de Problemas QNAP {#common-qnap-troubleshooting-issues}

Se seu dispositivo QNAP [falhar ao enviar e-mails de notificação](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), verifique o seguinte:

* Verifique se suas credenciais do Forward Email estão corretas
* Certifique-se de que o endereço do servidor SMTP é exatamente `smtp.forwardemail.net`
* Confirme se a porta corresponde ao seu método de criptografia (`465` para SSL/TLS é recomendado; `587` para STARTTLS também é suportado)
* Verifique se sua [configuração do servidor SMTP](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) permite a conexão


## Configuração Legada ReadyNAS {#readynas-legacy-configuration}

Dispositivos Netgear ReadyNAS apresentam desafios únicos devido ao suporte descontinuado do firmware e à dependência dos protocolos legados TLS 1.0. No entanto, o suporte a portas legadas do Forward Email garante que esses dispositivos possam continuar a enviar notificações por e-mail de forma confiável.

> \[!CAUTION]
> ReadyNAS OS 6.x suporta apenas TLS 1.0, o que requer as portas de compatibilidade legada do Forward Email `2455` e `2555`. As portas modernas `465` e `587` não funcionarão com esses dispositivos.

### Passos para Configuração Legada {#legacy-configuration-steps}

1. **Acesse a interface web do ReadyNAS** inserindo o endereço IP do dispositivo em um navegador.

2. **Navegue até Sistema > Configurações > Alertas** para acessar a seção de configuração de e-mail.

3. **Configure o servidor SMTP** inserindo `smtp.forwardemail.net` como endereço do servidor.

4. **Defina a configuração da porta** para `2455` para conexões SSL/TLS ou `2555` para conexões STARTTLS - estas são as portas de compatibilidade legada do Forward Email.

5. **Habilite a autenticação** e insira seu alias do Forward Email como nome de usuário e sua senha gerada em [Minha Conta -> Domínios -> Aliases](https://forwardemail.net/my-account/domains).

6. **Configure as informações do remetente** com um endereço "De" descritivo para identificar o dispositivo ReadyNAS.

7. **Adicione endereços de e-mail dos destinatários** usando o botão + na seção de contatos de e-mail.

8. **Teste a configuração** para garantir que a conexão TLS legada está funcionando corretamente.

> \[!IMPORTANT]
> Dispositivos ReadyNAS requerem as portas legadas porque não conseguem estabelecer conexões seguras usando protocolos TLS modernos. Esta é uma [limitação conhecida](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) do firmware descontinuado.

### Solução de Problemas ReadyNAS {#readynas-troubleshooting}

Problemas comuns na configuração de e-mail ReadyNAS incluem:

* **Incompatibilidade da versão TLS**: Certifique-se de usar as portas `2455` ou `2555`, não as portas modernas
* **Falhas de autenticação**: Verifique se suas credenciais do Forward Email estão corretas
* **Conectividade de rede**: Verifique se o ReadyNAS consegue acessar `smtp.forwardemail.net`
* **Limitações do firmware**: Alguns modelos ReadyNAS mais antigos podem ter requisitos adicionais de [configuração HTTPS](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

Dispositivos ReadyNAS rodando OS 6.x e versões anteriores suportam apenas conexões TLS 1.0, que a maioria dos provedores de e-mail modernos não aceita mais. As portas legadas dedicadas do Forward Email (2455 e 2555) suportam especificamente esses protocolos antigos, garantindo funcionalidade contínua para usuários ReadyNAS.

Para configurar o e-mail em dispositivos ReadyNAS, acesse a interface web do dispositivo pelo seu endereço IP. Navegue até a seção Sistema e selecione "Notificações" para acessar as opções de configuração de e-mail.

Na seção de configuração de e-mail, habilite as notificações por e-mail e insira smtp.forwardemail.net como servidor SMTP. Isso é crucial - use as portas compatíveis legadas do Forward Email em vez das portas SMTP padrão.

Para conexões SSL/TLS, configure a porta 2455 em vez da porta padrão 465 (recomendada). Para conexões STARTTLS, use a porta 2555 em vez da porta 587. Essas portas especiais mantêm a compatibilidade com TLS 1.0 enquanto fornecem a melhor segurança disponível para dispositivos legados.
Digite seu alias do Forward Email como nome de usuário e sua senha gerada para autenticação. Dispositivos ReadyNAS suportam autenticação SMTP, que é necessária para conexões Forward Email.

Configure o endereço de e-mail do remetente e os endereços dos destinatários conforme suas necessidades de notificação. ReadyNAS permite múltiplos endereços de destinatários, possibilitando distribuir alertas para diferentes membros da equipe ou contas de e-mail.

Teste a configuração cuidadosamente, pois dispositivos ReadyNAS podem não fornecer mensagens de erro detalhadas se a configuração falhar. Se o teste padrão não funcionar, verifique se você está usando as portas legadas corretas (2455 ou 2555) em vez das portas SMTP modernas.

Considere as implicações de segurança ao usar protocolos TLS legados. Embora as portas legadas do Forward Email ofereçam a melhor segurança disponível para dispositivos mais antigos, recomenda-se atualizar para um sistema NAS moderno com suporte TLS atual sempre que possível.


## Configuração TerraMaster NAS {#terramaster-nas-configuration}

Dispositivos TerraMaster rodando TOS 6.x suportam TLS moderno e funcionam bem com as portas padrão do Forward Email.

> \[!NOTE]
> TerraMaster TOS 6.x oferece recursos abrangentes de notificação por e-mail. Certifique-se de que seu firmware está atualizado para a melhor compatibilidade.

1. **Acesse Configurações do Sistema**
   * Faça login na interface web do TerraMaster
   * Navegue até **Painel de Controle** > **Notificação**

2. **Configure as Configurações SMTP**
   * Servidor: `smtp.forwardemail.net`
   * Porta: `465` (SSL/TLS, recomendado) ou `587` (STARTTLS)
   * Nome de usuário: Seu alias do Forward Email
   * Senha: Senha gerada em [Minha Conta -> Domínios -> Aliases](https://forwardemail.net/my-account/domains)

3. **Ative as Notificações**
   * Marque os tipos de notificação que deseja receber
   * Teste a configuração com a função de teste integrada

> \[!TIP]
> Dispositivos TerraMaster funcionam melhor com a porta `465` para conexões SSL/TLS (recomendado). Se você tiver problemas, a porta `587` com STARTTLS também é suportada.


## Configuração ASUSTOR NAS {#asustor-nas-configuration}

Dispositivos ASUSTOR com ADM 4.x têm suporte sólido para notificações por e-mail e funcionam perfeitamente com o Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x inclui opções avançadas de filtragem de notificações. Você pode personalizar quais eventos disparam alertas por e-mail.

1. **Abra as Configurações de Notificação**
   * Acesse a interface web do ADM
   * Vá para **Configurações** > **Notificação**

2. **Configure o SMTP**
   * Servidor SMTP: `smtp.forwardemail.net`
   * Porta: `465` (SSL/TLS, recomendado) ou `587` (STARTTLS)
   * Autenticação: Ativar
   * Nome de usuário: Seu alias do Forward Email
   * Senha: Senha gerada em [Minha Conta -> Domínios -> Aliases](https://forwardemail.net/my-account/domains)

3. **Configure os Tipos de Alerta**
   * Selecione quais eventos do sistema devem disparar e-mails
   * Configure os endereços dos destinatários
   * Teste a configuração

> \[!IMPORTANT]
> Dispositivos ASUSTOR exigem que a autenticação seja explicitamente ativada nas configurações SMTP. Não esqueça de marcar essa opção.


## Configuração Buffalo TeraStation {#buffalo-terastation-configuration}

Dispositivos Buffalo TeraStation têm capacidades limitadas, mas funcionais, de notificação por e-mail. A configuração é simples quando você sabe onde procurar.

> \[!CAUTION]
> Atualizações de firmware para Buffalo TeraStation são infrequentes. Certifique-se de usar o firmware mais recente disponível para seu modelo antes de configurar o e-mail.

1. **Acesse a Configuração Web**
   * Conecte-se à interface web do seu TeraStation
   * Navegue até **Sistema** > **Notificação**

2. **Configure as Configurações de E-mail**
   * Servidor SMTP: `smtp.forwardemail.net`
   * Porta: `465` (SSL/TLS, recomendado) ou `587` (STARTTLS)
   * Nome de usuário: Seu alias do Forward Email
   * Senha: Senha gerada em [Minha Conta -> Domínios -> Aliases](https://forwardemail.net/my-account/domains)
   * Ative a criptografia SSL/TLS

3. **Defina as Preferências de Notificação**
   * Escolha quais eventos disparam e-mails (erros de disco, alertas de temperatura, etc.)
   * Insira os endereços de e-mail dos destinatários
   * Salve e teste a configuração

> \[!NOTE]
> Alguns modelos mais antigos do TeraStation podem ter opções limitadas de configuração SMTP. Verifique a documentação do seu modelo para capacidades específicas.
## Configuração do Western Digital My Cloud {#western-digital-my-cloud-configuration}

Dispositivos Western Digital My Cloud rodando OS 5 suportam notificações por email, embora a interface possa estar um pouco escondida nas configurações.

> \[!WARNING]
> A Western Digital descontinuou o suporte para muitos modelos My Cloud. Verifique se seu dispositivo ainda recebe atualizações de firmware antes de depender das notificações por email para alertas críticos.

1. **Navegue até Configurações**
   * Abra o painel web do My Cloud
   * Vá para **Configurações** > **Geral** > **Notificações**

2. **Configure os Detalhes SMTP**
   * Servidor de Email: `smtp.forwardemail.net`
   * Porta: `465` (SSL/TLS, recomendado) ou `587` (STARTTLS)
   * Nome de usuário: Seu alias do Forward Email
   * Senha: Senha gerada em [Minha Conta -> Domínios -> Aliases](https://forwardemail.net/my-account/domains)
   * Ative a criptografia

3. **Configure os Tipos de Alerta**
   * Selecione categorias de notificação (alertas do sistema, saúde do disco, etc.)
   * Adicione endereços de email dos destinatários
   * Teste a configuração do email

> \[!TIP]
> Recomendamos usar a porta `465` com SSL/TLS. Se você encontrar problemas, a porta `587` com STARTTLS também é suportada.


## Configuração de Email do TrueNAS {#truenas-email-configuration}

TrueNAS (tanto SCALE quanto CORE) possui excelente suporte a notificações por email com opções detalhadas de configuração.

> \[!NOTE]
> O TrueNAS oferece alguns dos recursos mais completos de notificações por email entre sistemas NAS. Você pode configurar regras detalhadas de alerta e múltiplos destinatários.

1. **Acesse as Configurações do Sistema**
   * Faça login na interface web do TrueNAS
   * Navegue até **Sistema** > **Email**

2. **Configure as Configurações SMTP**
   * Servidor de Email de Saída: `smtp.forwardemail.net`
   * Porta do Servidor de Email: `465` (recomendado) ou `587`
   * Segurança: SSL/TLS (para 465, recomendado) ou STARTTLS (para 587)
   * Nome de usuário: Seu alias do Forward Email
   * Senha: Senha gerada em [Minha Conta -> Domínios -> Aliases](https://forwardemail.net/my-account/domains)

3. **Configure os Alertas**
   * Vá para **Sistema** > **Serviços de Alerta**
   * Configure quais alertas devem ser enviados por email
   * Defina endereços dos destinatários e níveis de alerta
   * Teste a configuração com a função de teste integrada

> \[!IMPORTANT]
> O TrueNAS permite configurar diferentes níveis de alerta (INFO, NOTICE, WARNING, ERROR, CRITICAL). Escolha níveis apropriados para evitar spam de email enquanto garante que problemas críticos sejam reportados.


## Configuração do OpenMediaVault {#openmediavault-configuration}

O OpenMediaVault oferece capacidades sólidas de notificações por email através de sua interface web. O processo de configuração é limpo e direto.

> \[!NOTE]
> O sistema de notificações do OpenMediaVault é baseado em plugins. Certifique-se de que o plugin de notificações por email está instalado e ativado.

1. **Acesse as Configurações de Notificação**
   * Abra a interface web do OpenMediaVault
   * Vá para **Sistema** > **Notificação** > **Email**

2. **Configure os Parâmetros SMTP**
   * Servidor SMTP: `smtp.forwardemail.net`
   * Porta: `465` (SSL/TLS, recomendado) ou `587` (STARTTLS)
   * Nome de usuário: Seu alias do Forward Email
   * Senha: Senha gerada em [Minha Conta -> Domínios -> Aliases](https://forwardemail.net/my-account/domains)
   * Ative SSL/TLS

3. **Configure as Regras de Notificação**
   * Navegue até **Sistema** > **Notificação** > **Notificações**
   * Configure quais eventos do sistema devem disparar emails
   * Defina endereços dos destinatários
   * Teste a funcionalidade de email

> \[!TIP]
> O OpenMediaVault permite configurar horários de notificação. Você pode definir horários silenciosos ou limitar a frequência das notificações para evitar ser sobrecarregado por alertas.


## Configuração do NAS Raspberry Pi {#raspberry-pi-nas-configuration}

O Raspberry Pi representa um excelente ponto de entrada para funcionalidades NAS, oferecendo uma solução econômica para ambientes domésticos e pequenos escritórios. Configurar um Raspberry Pi como dispositivo NAS envolve configurar protocolos de compartilhamento de arquivos, notificações por email e serviços essenciais de rede.

> \[!TIP]
> Para entusiastas do Raspberry Pi, recomendamos fortemente complementar sua configuração NAS com [PiKVM](https://pikvm.org/) para gerenciamento remoto do servidor e [Pi-hole](https://pi-hole.net/) para bloqueio de anúncios em toda a rede e gerenciamento de DNS. Essas ferramentas criam um ambiente completo de laboratório doméstico.
### Configuração Inicial do Raspberry Pi {#initial-raspberry-pi-setup}

Antes de configurar os serviços NAS, certifique-se de que seu Raspberry Pi está executando o Raspberry Pi OS mais recente e possui armazenamento adequado. Um cartão microSD de alta qualidade (Classe 10 ou superior) ou SSD USB 3.0 oferece melhor desempenho e confiabilidade para operações NAS.

1. **Atualize o sistema** executando `sudo apt update && sudo apt upgrade -y` para garantir que todos os pacotes estejam atualizados.

2. **Habilite o acesso SSH** usando `sudo systemctl enable ssh && sudo systemctl start ssh` para administração remota.

3. **Configure o endereçamento IP estático** editando `/etc/dhcpcd.conf` para garantir acesso consistente à rede.

4. **Configure o armazenamento externo** conectando e montando unidades USB ou configurando arrays RAID para redundância de dados.

### Configuração de Compartilhamento de Arquivos Samba {#samba-file-sharing-configuration}

O Samba fornece compartilhamento de arquivos compatível com Windows, tornando seu Raspberry Pi acessível de qualquer dispositivo na sua rede. O processo de configuração envolve instalar o Samba, criar compartilhamentos e configurar autenticação de usuários.

Instale o Samba usando `sudo apt install samba samba-common-bin` e configure o arquivo principal em `/etc/samba/smb.conf`. Crie diretórios compartilhados e defina permissões apropriadas usando `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Configure os compartilhamentos Samba adicionando seções ao arquivo de configuração para cada diretório compartilhado. Configure a autenticação de usuários usando `sudo smbpasswd -a username` para criar senhas específicas do Samba para acesso à rede.

> \[!IMPORTANT]
> Sempre use senhas fortes para usuários Samba e considere habilitar o acesso de convidados apenas para pastas compartilhadas não sensíveis. Revise a [documentação oficial do Samba](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) para configurações avançadas de segurança.

### Configuração do Servidor FTP {#ftp-server-setup}

O FTP fornece outro método para acesso a arquivos, particularmente útil para backups automatizados e gerenciamento remoto de arquivos. Instale e configure o vsftpd (Very Secure FTP Daemon) para serviços FTP confiáveis.

Instale o vsftpd usando `sudo apt install vsftpd` e configure o serviço editando `/etc/vsftpd.conf`. Habilite o acesso de usuários locais, configure as definições de modo passivo e defina restrições de segurança apropriadas.

Crie usuários FTP e configure permissões de acesso a diretórios. Considere usar SFTP (SSH File Transfer Protocol) em vez do FTP tradicional para maior segurança, pois ele criptografa toda a transmissão de dados.

> \[!CAUTION]
> O FTP tradicional transmite senhas em texto claro. Sempre use SFTP ou configure o FTP com criptografia TLS para transferências de arquivos seguras. Revise as [melhores práticas de segurança do vsftpd](https://security.appspot.com/vsftpd.html) antes da implantação.

### Configuração de Notificações por Email {#email-notification-configuration}

Configure seu NAS Raspberry Pi para enviar notificações por email sobre eventos do sistema, alertas de armazenamento e status de conclusão de backups. Isso envolve instalar e configurar um agente de transferência de email e configurar a integração Forward Email.

Instale `msmtp` como um cliente SMTP leve usando `sudo apt install msmtp msmtp-mta`. Crie o arquivo de configuração em `/etc/msmtprc` com as seguintes configurações:

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

Configure notificações do sistema configurando tarefas cron e scripts de monitoramento que usam `msmtp` para enviar alertas. Crie scripts para monitoramento de espaço em disco, alertas de temperatura e notificações de conclusão de backup.

### Recursos Avançados do NAS Raspberry Pi {#advanced-raspberry-pi-nas-features}

Melhore seu NAS Raspberry Pi com serviços adicionais e capacidades de monitoramento. Instale e configure ferramentas de monitoramento de rede, soluções de backup automatizadas e serviços de acesso remoto.

Configure o [Nextcloud](https://nextcloud.com/) para funcionalidade semelhante à nuvem com acesso a arquivos via web, sincronização de calendário e recursos colaborativos. Instale usando Docker ou o guia oficial de instalação do Nextcloud para Raspberry Pi.
Configure backups automáticos usando `rsync` e `cron` para criar backups agendados de dados críticos. Configure notificações por email para conclusão de backup e alertas de falha usando sua configuração do Forward Email.

Implemente monitoramento de rede usando ferramentas como [Nagios](https://www.nagios.org/) ou [Zabbix](https://www.zabbix.com/) para monitorar a saúde do sistema, conectividade de rede e disponibilidade de serviços.

> \[!NOTE]
> Para usuários que gerenciam infraestrutura de rede, considere integrar [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) com sua configuração PiKVM para controle remoto de interruptores físicos. Este [guia de integração Python](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) fornece instruções detalhadas para automatizar o gerenciamento de dispositivos físicos.

### Solução de Problemas de Email no Raspberry Pi {#raspberry-pi-email-troubleshooting}

Problemas comuns com a configuração de email no Raspberry Pi incluem problemas de resolução DNS, restrições de firewall e falhas de autenticação. A natureza leve dos sistemas Raspberry Pi pode às vezes causar problemas de sincronização com conexões SMTP.

Se as notificações por email falharem, verifique o arquivo de log do `msmtp` em `/var/log/msmtp.log` para mensagens de erro detalhadas. Confirme que suas credenciais do Forward Email estão corretas e que o Raspberry Pi consegue resolver `smtp.forwardemail.net`.

Teste a funcionalidade do email usando a linha de comando: `echo "Test message" | msmtp recipient@example.com`. Isso ajuda a isolar problemas de configuração de problemas específicos do aplicativo.

Configure as definições DNS adequadas em `/etc/resolv.conf` se encontrar problemas de resolução DNS. Considere usar servidores DNS públicos como `8.8.8.8` ou `1.1.1.1` se o DNS local for instável.

### Otimização de Desempenho {#performance-optimization}

Otimize o desempenho do seu NAS Raspberry Pi por meio da configuração adequada de armazenamento, configurações de rede e recursos do sistema. Use dispositivos de armazenamento de alta qualidade e configure opções apropriadas do sistema de arquivos para seu caso de uso.

Habilite boot via USB 3.0 para melhor desempenho de armazenamento se estiver usando drives externos. Configure a divisão de memória da GPU usando `sudo raspi-config` para alocar mais RAM para operações do sistema em vez de processamento gráfico.

Monitore o desempenho do sistema usando ferramentas como `htop`, `iotop` e `nethogs` para identificar gargalos e otimizar o uso de recursos. Considere atualizar para um Raspberry Pi 4 com 8GB de RAM para aplicações NAS exigentes.

Implemente soluções adequadas de resfriamento para evitar throttling térmico durante operações intensivas. Monitore a temperatura da CPU usando `/opt/vc/bin/vcgencmd measure_temp` e garanta ventilação adequada.

### Considerações de Segurança {#security-considerations}

Proteja seu NAS Raspberry Pi implementando controles de acesso adequados, medidas de segurança de rede e atualizações regulares de segurança. Altere senhas padrão, desative serviços desnecessários e configure regras de firewall.

Instale e configure o `fail2ban` para proteger contra ataques de força bruta no SSH e outros serviços. Configure atualizações automáticas de segurança usando `unattended-upgrades` para garantir que patches críticos sejam aplicados rapidamente.

Configure segmentação de rede para isolar seu NAS de outros dispositivos da rede quando possível. Use acesso via VPN para conexões remotas em vez de expor serviços diretamente à internet.

Faça backup regular da configuração e dos dados do seu Raspberry Pi para evitar perda de dados por falhas de hardware ou incidentes de segurança. Teste os procedimentos de restauração de backup para garantir a capacidade de recuperação dos dados.

A configuração do NAS Raspberry Pi oferece uma excelente base para aprender conceitos de armazenamento em rede enquanto entrega funcionalidade prática para ambientes domésticos e pequenos escritórios. A combinação com o Forward Email garante entrega confiável de notificações para monitoramento do sistema e alertas de manutenção.
