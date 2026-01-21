# 양자 저항 이메일: 암호화된 SQLite 사서함을 사용하여 이메일을 안전하게 보호하는 방법 {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" 클래스="둥근-lg" />

## 목차 {#table-of-contents}

* [머리말](#foreword)
* [이메일 서비스 제공업체 비교](#email-service-provider-comparison)
* [어떻게 작동합니까?](#how-does-it-work)
* [기술](#technologies)
  * [데이터베이스](#databases)
  * [보안](#security)
  * [우편함](#mailboxes)
  * [동시성](#concurrency)
  * [백업](#backups)
  * [찾다](#search)
  * [프로젝트](#projects)
  * [제공자](#providers)
* [생각들](#thoughts)
  * [원칙](#principles)
  * [실험](#experiments)
  * [대안의 부족](#lack-of-alternatives)
  * [Forward Email을 사용해 보세요](#try-out-forward-email)

## 서문 {#foreword}

> \[!IMPORTANT]
> 저희 이메일 서비스는 [100% 오픈소스](https://github.com/forwardemail)이며, 안전하고 암호화된 SQLite 메일함을 통해 개인정보 보호에 중점을 두고 있습니다.

[IMAP 지원](/faq#do-you-support-receiving-email-with-imap)을 출시하기 전까지 우리는 지속적인 데이터 저장 요구 사항을 위해 MongoDB를 사용했습니다.

이 기술은 놀랍고 오늘날에도 여전히 사용되고 있습니다. 하지만 MongoDB에서 암호화를 사용하려면 Digital Ocean이나 Mongo Atlas와 같이 MongoDB Enterprise를 제공하는 공급업체를 이용하거나 엔터프라이즈 라이선스 비용을 지불해야 합니다(그러면 영업팀 지연 시간에 대처해야 합니다).

[이메일 전달](https://forwardemail.net) 팀은 IMAP 사서함을 위한 개발자 친화적이고 확장 가능하며 안정적이고 암호화된 저장 솔루션이 필요했습니다. 오픈 소스 개발자로서, 저장 데이터 암호화 기능을 사용하려면 라이선스 비용을 지불해야 하는 기술을 사용하는 것은 [우리의 원칙](#principles) 팀에 적합하지 않았습니다. 그래서 저희는 이러한 요구를 해결하기 위해 처음부터 새로운 솔루션을 실험하고, 연구하고, 개발했습니다.

저희는 여러분의 사서함을 저장하기 위해 공유 데이터베이스를 사용하는 대신, 여러분만의 비밀번호(여러분만 알고 계십니다)를 사용하여 사서함을 개별적으로 저장하고 암호화합니다. **저희 이메일 서비스는 매우 안전하기 때문에 비밀번호를 잊어버리면 사서함을 잃게 됩니다.** (그러면 오프라인 백업을 통해 복구하거나 다시 시작해야 합니다).

아래에서 [이메일 서비스 제공업체 비교](#email-service-provider-comparison), [우리 서비스가 어떻게 작동하는지](#how-does-it-work), [우리의 기술 스택](#technologies) 등을 자세히 살펴보겠습니다.

## 이메일 서비스 제공업체 비교 {#email-service-provider-comparison}

저희는 개별적으로 암호화된 SQLite 사서함을 저장하고, 무제한 도메인, 별칭 및 사용자를 제공하며, 아웃바운드 SMTP, IMAP 및 POP3를 지원하는 유일한 100% 오픈 소스 및 개인 정보 보호 중심 이메일 서비스 제공업체입니다.

**다른 이메일 제공업체와 달리 Forward Email을 사용하면 도메인이나 별칭별로 저장 공간을 따로 지불할 필요가 없습니다.** 저장 공간은 전체 계정에서 공유되므로 여러 개의 사용자 지정 도메인 이름과 각 도메인에 여러 개의 별칭이 있는 경우 Forward Email이 최적의 솔루션입니다. 원하는 경우 도메인 또는 별칭별로 저장 공간 한도를 적용할 수도 있습니다.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">이메일 서비스 비교 읽기 <i class="fa fa-search-plus"></i></a>

## 작동 원리 {#how-does-it-work}

1. Apple Mail, Thunderbird, Gmail 또는 Outlook과 같은 이메일 클라이언트를 사용하여 사용자 이름과 비밀번호를 사용하여 보안 [IMAP](/faq#do-you-support-receiving-email-with-imap) 서버에 연결합니다.

* 사용자 이름은 `hello@example.com`과 같은 도메인의 전체 별칭입니다.
* 비밀번호는 무작위로 생성되며, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 <strong class="text-success"><i class="fa fa-key"></i>비밀번호 생성</strong>을 클릭할 때만 30초 동안 표시됩니다.

2. 연결되면 이메일 클라이언트가 [IMAP 프로토콜 명령](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)을 IMAP 서버로 전송하여 사서함 동기화를 유지합니다. 여기에는 임시 이메일 작성 및 저장, 그리고 사용자가 수행하는 기타 작업(예: 이메일을 중요 메일로 표시하거나 이메일을 스팸/정크 메일로 표시)이 포함됩니다.

3. 메일 교환 서버(일반적으로 "MX" 서버라고 함)는 새로 수신되는 이메일을 수신하여 사용자의 사서함에 저장합니다. 이 경우 이메일 클라이언트가 알림을 받고 사서함을 동기화합니다. 당사의 메일 교환 서버는 한 명 이상의 수신자([웹훅](/faq#do-you-support-webhooks) 포함)에게 이메일을 전달하거나, 암호화된 IMAP 저장소에 이메일을 저장하거나, **또는 두 가지 모두**를 모두 수행할 수 있습니다!

> \[!TIP]
> 더 자세히 알고 싶으신가요? [이메일 전달 설정 방법](/faq#how-do-i-get-started-and-set-up-email-forwarding), [우리 우편 교환 서비스가 어떻게 작동하는지](/faq#how-does-your-email-forwarding-system-work)을 읽어보시거나 [우리 가이드들](/guides)를 확인해 보세요.

4. 내부적으로, 당사의 안전한 이메일 저장 설계는 두 가지 방식으로 작동하여 귀하의 사서함을 암호화하고 귀하만 접근할 수 있도록 합니다.

* 발신자로부터 새로운 메일이 수신되면 당사의 메일 교환 서버는 귀하를 대신하여 개별적이고 임시적이며 암호화된 사서함에 메일을 씁니다.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* 이메일 클라이언트를 사용하여 IMAP 서버에 연결하면 비밀번호가 메모리에 암호화되어 사서함을 읽고 쓰는 데 사용됩니다. 사서함은 이 비밀번호로만 읽고 쓸 수 있습니다. 이 비밀번호를 가진 사람은 본인뿐이므로, **본인**만 사서함에 액세스하는 동안 읽고 쓸 수 있습니다. 다음에 이메일 클라이언트가 메일을 폴링하거나 동기화를 시도할 때 새 메시지는 이 임시 사서함에서 전송되어 제공된 비밀번호를 사용하여 실제 사서함 파일에 저장됩니다. 이 임시 사서함은 이후 삭제되어 비밀번호로 보호된 사서함에만 메시지가 저장됩니다.

* **IMAP에 연결되어 있는 경우(예: Apple Mail 또는 Thunderbird와 같은 이메일 클라이언트 사용) 임시 디스크 저장소에 쓸 필요가 없습니다. 대신 메모리에 암호화된 IMAP 비밀번호를 가져와서 사용합니다. 실시간으로 메시지가 전달될 때 모든 IMAP 서버에 웹소켓 요청을 전송하여 활성 세션이 있는지 확인합니다(이 부분이 가져오기 단계입니다). 그런 다음 암호화된 메모리 내 비밀번호를 전달합니다. 따라서 임시 사서함에 쓸 필요가 없으며, 암호화된 비밀번호를 사용하여 실제 암호화된 사서함에 쓸 수 있습니다.**

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

5. [암호화된 사서함 백업](#backups)은 매일 생성됩니다. 언제든지 새 백업을 요청하거나 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 최신 백업을 다운로드할 수도 있습니다. 다른 이메일 서비스로 전환하기로 결정한 경우 언제든지 사서함과 백업을 쉽게 마이그레이션, 다운로드, 내보내기 및 삭제할 수 있습니다.

## 기술 {#technologies}

### 데이터베이스 {#databases}

우리는 다른 가능한 데이터베이스 저장 계층을 탐색했지만, SQLite만큼 우리의 요구 사항을 충족시킨 것은 없었습니다.

| 데이터 베이스 | 저장 중 암호화 | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) 사서함 | 특허 | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **__셀_링크_0__** :별: | :white_check_mark: 예, [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) 포함 | :흰색_체크_표시: | :white_check_mark: 퍼블릭 도메인 | :흰색_체크_표시: |
| [MongoDB](https://www.mongodb.com/) | :x: __셀_링크_0__ | :x: 관계형 데이터베이스 | :x: AGPL 및 `SSPL-1.0` | :엑스: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: __셀_링크_0__ | :x: 관계형 데이터베이스 | :white_check_mark: __셀_코드_0__ | :엑스: |
| [dqlite](https://dqlite.io/) | :x: __셀_링크_0__ | :x: __셀_링크_0__ | :white_check_mark: __셀_코드_0__ | :엑스: |
| [PostgreSQL](https://www.postgresql.org/) | :white_check_mark: __셀_링크_0__ | :x: 관계형 데이터베이스 | :white_check_mark: `PostgreSQL` (`BSD` 또는 `MIT`와 유사) | :엑스: |
| [MariaDB](https://mariadb.com/) | :white_check_mark: __셀_링크_0__ | :x: 관계형 데이터베이스 | :white_check_mark: `GPLv2` 및 `BUSL-1.1` | :엑스: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: __셀_링크_0__ | :x: 관계형 데이터베이스 | :x: `BUSL-1.1` 및 기타 | :엑스: |

> 위 표에는 [여러 SQLite 데이터베이스 저장 옵션을 비교하는 블로그 게시물](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/)이 있습니다.

### 보안 {#security}

저희는 항상 [저장 중 암호화](https://en.wikipedia.org/wiki/Data_at_rest)([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [전송 중 암호화](https://en.wikipedia.org/wiki/Data_in_transit)([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [HTTPS를 통한 DNS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)("DoH")를 사용하며, [귤](https://tangeri.ne)와 [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)([차차20-폴리1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) 암호화를 적용합니다. 또한, 토큰 기반 2단계 인증([중간자 공격](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)에서 의심되는 SMS와는 대조적), 루트 접근이 비활성화된 순환 SSH 키, 제한된 IP 주소를 통한 서버 단독 접근 등을 사용합니다.

[사악한 하녀의 공격](https://en.wikipedia.org/wiki/Evil_maid_attack) 또는 타사 공급업체의 악의적인 직원이 있는 경우, **생성된 비밀번호로만 메일함을 열 수 있습니다**. 저희는 SOC 유형 2 규정을 준수하는 Cloudflare, DataPacket, Digital Ocean, Vultr 서버 공급업체 외에는 다른 타사 공급업체에 의존하지 않으므로 안심하셔도 됩니다.

우리의 목표는 [단일 실패 지점](https://en.wikipedia.org/wiki/Single_point_of_failure)를 가능한 한 적게 만드는 것입니다.

### 사서함 {#mailboxes}

> **요약;** 당사의 IMAP 서버는 각 사서함에 대해 개별적으로 암호화된 SQLite 데이터베이스를 사용합니다.

[SQLite는 매우 인기가 있습니다](https://www.sqlite.org/mostdeployed.html) 내장 데이터베이스 – 현재 휴대폰과 컴퓨터에서 실행 중입니다 – [거의 모든 주요 기술에서 사용됨](https://www.sqlite.org/famous.html).

예를 들어, 암호화된 서버에는 `linux@example.com`, `info@example.com`, `hello@example.com` 등의 SQLite 데이터베이스 사서함이 있습니다. 각 사서함마다 `.sqlite` 데이터베이스 파일이 하나씩 있습니다. 데이터베이스 파일 이름도 이메일 주소로 지정하지 않습니다. 대신 BSON ObjectID와 고유한 UUID를 생성하여 사서함 소유자나 이메일 주소를 공유하지 않습니다(예: `353a03f21e534321f5d6e267.sqlite`).

각 데이터베이스는 [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)([차차20-폴리1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/))을 사용하여 사용자 본인만 아는 비밀번호를 사용하여 암호화됩니다. 즉, 사용자의 사서함은 개별적으로 암호화되고, 자체적으로 포함되며, [샌드박스](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) 이동 가능합니다.

우리는 다음의 [PRAGMA](https://www.sqlite.org/pragma.html)으로 SQLite를 미세 조정했습니다:

| `PRAGMA` | 목적 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). 자세한 내용은 [Projects](#projects) 아래의 `better-sqlite3-multiple-ciphers`을 참조하세요. |
| `key="****************"` | 이는 복호화된 메모리 내 비밀번호로, 이메일 클라이언트의 IMAP 연결을 통해 당사 서버로 전달됩니다. 샌드박싱 및 격리를 보장하기 위해 각 읽기 및 쓰기 세션마다 새로운 데이터베이스 인스턴스가 생성되고 닫힙니다. |
| `journal_model=WAL` | 미리 쓰기 로그("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | 쓰기 잠금 오류 [while other writes are taking place](https://litestream.io/tips/#busy-timeout)을 방지합니다. |
| `synchronous=NORMAL` | 거래 [without data corruption risk](https://litestream.io/tips/#synchronous-pragma)의 내구성을 높입니다. |
| `foreign_keys=ON` | 외래 키 참조(예: 한 테이블에서 다른 테이블로의 관계)가 강제로 적용됩니다. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html)이지만 유효성 검사 및 데이터 무결성을 위해 활성화해야 합니다. |
| `encoding='UTF-8'` | 개발자의 정신 건강을 보장하기 위해 [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding)을 사용합니다. |

> 다른 모든 기본값은 [공식 PRAGMA 문서](https://www.sqlite.org/pragma.html#pragma_auto_vacuum)에서 지정한 대로 SQLite에서 가져옵니다.

### 동시성 {#concurrency}

> **tldr;** 암호화된 SQLite 사서함에 대한 동시 읽기 및 쓰기를 위해 `WebSocket`을 사용합니다.

####은 {#reads}}을 읽습니다.

휴대전화의 이메일 클라이언트는 `imap.forwardemail.net`을 Digital Ocean IP 주소 중 하나로 확인할 수 있으며, 데스크톱 클라이언트는 다른 [공급자](#providers)의 별도 IP를 확인할 수도 있습니다.

이메일 클라이언트가 어떤 IMAP 서버에 연결하든, 데이터베이스에서 100% 정확한 실시간 데이터를 읽어오도록 해야 합니다. 이는 웹소켓을 통해 이루어집니다.

####이 {#writes}}을(를) 씁니다.

데이터베이스에 쓰는 것은 약간 다릅니다. SQLite는 내장형 데이터베이스이고 사서함은 기본적으로 단일 파일에 저장됩니다.

우리는 아래의 `litestream`, `rqlite`, `dqlite`와 같은 옵션을 살펴보았지만, 이 중 어떤 것도 우리의 요구 사항을 충족시키지 못했습니다.

미리 쓰기 로깅("[WAL](https://www.sqlite.org/wal.html)")을 활성화하여 쓰기 작업을 수행하려면 단 하나의 서버("Primary")만 해당 작업을 담당하도록 해야 합니다. [WAL](https://www.sqlite.org/wal.html)은 동시성 속도를 크게 높이고 하나의 작성자와 여러 개의 읽기 작업을 허용합니다.

주 서버는 암호화된 사서함이 포함된 볼륨이 마운트된 데이터 서버에서 실행됩니다. 배포 관점에서는 `imap.forwardemail.net` 뒤에 있는 모든 개별 IMAP 서버를 보조 서버("Secondary")로 간주할 수 있습니다.

[웹소켓](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)을 통해 양방향 통신을 수행합니다.

* 기본 서버는 [와스](https://github.com/websockets/ws)의 `WebSocketServer` 서버 인스턴스를 사용합니다.
* 보조 서버는 [와스](https://github.com/websockets/ws)의 `WebSocket` 클라이언트 인스턴스를 사용하며, 이 인스턴스는 [웹소켓-as-promised](https://github.com/vitalets/websocket-as-promised)와 [재연결-웹소켓](https://github.com/opensumi/reconnecting-websocket)로 래핑됩니다. 이 두 래퍼는 `WebSocket`이 다시 연결되고 특정 데이터베이스 쓰기 작업에 대한 데이터를 주고받을 수 있도록 보장합니다.

### 백업 {#backups}

> **요약** 암호화된 사서함은 매일 백업됩니다. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 언제든지 새 백업을 즉시 요청하거나 최신 백업을 다운로드할 수도 있습니다.

백업의 경우, IMAP 명령 처리 중에 매일 SQLite `VACUUM INTO` 명령을 실행합니다. 이 명령은 메모리 내 IMAP 연결에서 암호화된 비밀번호를 활용합니다. 기존 백업이 감지되지 않거나 파일의 [SHA-256](https://en.wikipedia.org/wiki/SHA-2) 해시가 최신 백업과 비교하여 변경된 경우 백업이 저장됩니다.

`VACUUM INTO` 명령은 내장된 `backup` 명령과 달리 사용됩니다. `backup` 명령 작업 중에 페이지가 수정되면 처음부터 다시 시작해야 하기 때문입니다. `VACUUM INTO` 명령은 스냅샷을 생성합니다. 자세한 내용은 [깃허브](https://github.com/benbjohnson/litestream.io/issues/56) 및 [해커 뉴스](https://news.ycombinator.com/item?id=31387556)에 대한 설명을 참조하세요.

또한 `backup` 대신 `VACUUM INTO`을 사용합니다. `backup` 명령은 `rekey`가 호출될 때까지 잠시 동안 데이터베이스를 암호화하지 않기 때문입니다(통찰력은 GitHub [논평](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927)를 참조하세요).

2차 서버는 `WebSocket` 연결을 통해 1차 서버에 백업을 실행하도록 지시합니다. 그러면 1차 서버는 해당 명령을 받고 다음과 같은 작업을 수행합니다.

1. 암호화된 사서함에 연결합니다.
2. 쓰기 잠금을 획득합니다.
3. `wal_checkpoint(PASSIVE)`을 통해 WAL 체크포인트를 실행합니다.
4. `VACUUM INTO` SQLite 명령을 실행합니다.
5. 암호화된 비밀번호로 복사된 파일을 열 수 있는지 확인합니다(보안/더미 검증).
6. Cloudflare R2(또는 지정된 경우 자체 제공업체)에 업로드하여 저장합니다.

<!--
7. 생성된 백업 파일을 `gzip`으로 압축합니다.
8. 저장을 위해 Cloudflare R2(또는 지정된 경우 자체 제공업체)에 업로드합니다.
-->

사서함이 암호화되어 있다는 사실을 기억하세요. WebSocket 통신을 위해 IP 제한 및 기타 인증 조치가 마련되어 있지만, 악의적인 행위자가 침입하는 경우 WebSocket 페이로드에 IMAP 비밀번호가 없으면 데이터베이스를 열 수 없습니다.

현재는 사서함당 하나의 백업만 저장되지만, 앞으로는 지정 시점 복구("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)") 기능을 제공할 수도 있습니다.

### 검색 {#search}

당사의 IMAP 서버는 복잡한 쿼리, 정규 표현식 등을 포함하는 `SEARCH` 명령을 지원합니다.

[FTS5](https://www.sqlite.org/fts5.html)과 [sqlite-정규식](https://github.com/asg017/sqlite-regex#sqlite-regex) 덕분에 검색 성능이 빨라졌습니다.

`Date` 값을 SQLite 사서함에 [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) 문자열로 저장하고, 이를 [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)를 통해 저장합니다(동등성 비교가 제대로 작동하도록 UTC 시간대를 사용합니다).

검색 쿼리에 포함된 모든 속성에 대한 인덱스도 저장됩니다.

### 프로젝트 {#projects}

다음은 소스 코드와 개발 프로세스에서 사용하는 프로젝트를 개략적으로 정리한 표입니다(알파벳 순으로 정렬):

| 프로젝트 | 목적 |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | 전체 서버를 손쉽게 유지 관리, 확장, 관리할 수 있는 DevOps 자동화 플랫폼입니다. |
| [Bree](https://github.com/breejs/bree) | Cron, Dates, ms, later 및 사용자 친화적인 지원을 갖춘 Node.js 및 JavaScript용 작업 스케줄러입니다. |
| [Cabin](https://github.com/cabinjs/cabin) | 보안과 개인정보 보호를 염두에 두고 개발된 개발자 친화적인 JavaScript 및 Node.js 로깅 라이브러리입니다. |
| [Lad](https://github.com/ladjs/lad) | MVC 등을 사용하여 전체 아키텍처와 엔지니어링 디자인을 강화하는 Node.js 프레임워크입니다. |
| [MongoDB](https://www.mongodb.com/) | 사서함 외부의 모든 데이터(예: 계정, 설정, 도메인, 별칭 구성)를 저장하는 데 사용하는 NoSQL 데이터베이스 솔루션입니다. |
| [Mongoose](https://github.com/Automattic/mongoose) | 전체 스택에서 사용하는 MongoDB 객체 문서 모델링("ODM")입니다. **SQLite와 함께 Mongoose**를 계속 사용할 수 있도록 특수 헬퍼를 개발했습니다. :tada: |
| [Node.js](https://nodejs.org/en) | Node.js는 모든 서버 프로세스를 실행하는 오픈 소스, 크로스 플랫폼 JavaScript 런타임 환경입니다. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | 이메일 전송, 연결 생성 등을 위한 Node.js 패키지입니다. 저희는 이 프로젝트의 공식 스폰서입니다. |
| [Redis](https://redis.io/) | 캐싱, 게시/구독 채널, HTTPS를 통한 DNS 요청을 위한 메모리 내 데이터베이스입니다. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | SQLite용 암호화 확장 프로그램으로 전체 데이터베이스 파일(write-ahead-log("[WAL](https://www.sqlite.org/wal.html)"), 저널, 롤백 등 포함)을 암호화할 수 있습니다. |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | 개발 사서함을 테스트, 다운로드, 확인할 수 있는 시각적 SQLite 편집기(사용 가능)입니다. |
| [SQLite](https://www.sqlite.org/about.html) | 확장 가능하고, 독립적이고, 빠르고, 탄력적인 IMAP 스토리지를 위한 내장형 데이터베이스 계층입니다. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Node.js 스팸 방지, 이메일 필터링 및 피싱 방지 도구([Spam Assassin](https://spamassassin.apache.org/) 및 [rspamd](https://github.com/rspamd/rspamd)에 대한 대안). |
| [Tangerine](https://tangeri.ne) | Node.js를 사용한 HTTPS 요청을 통한 DNS 및 Redis를 사용한 캐싱 - 이를 통해 글로벌 일관성을 보장하고 더 많은 기능을 제공합니다. |
| [Thunderbird](https://www.thunderbird.net/) | 저희 개발팀에서는 이 이메일을 **Forward Email과 함께 사용할 기본 이메일 클라이언트**로 사용하고 있습니다(또한 이 클라이언트를 권장합니다). |
| [UTM](https://github.com/utmapp/UTM) | 저희 개발팀은 iOS와 macOS용 가상 머신을 만들어서 다양한 이메일 클라이언트를 저희의 IMAP 및 SMTP 서버와 병렬로 테스트합니다. |
| [Ubuntu](https://ubuntu.com/download/server) | 모든 인프라를 구동하는 최신 오픈소스 Linux 기반 서버 운영 체제입니다. |
| [WildDuck](https://github.com/nodemailer/wildduck) | IMAP 서버 라이브러리 – [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) 및 [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md)에 대한 참고 사항을 참조하세요. |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Node.js와 SQLite3를 프로그래밍 방식으로 상호 작용할 수 있는 빠르고 간단한 API 라이브러리입니다. |
| [email-templates](https://github.com/forwardemail/email-templates) | 사용자 정의 이메일(예: 계정 알림 등)을 만들고, 미리 보고, 보낼 수 있는 개발자 친화적인 이메일 프레임워크입니다. |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Mongo 스타일 구문을 사용하는 SQL 쿼리 빌더입니다. 데이터베이스에 구애받지 않는 접근 방식으로 전체 스택에서 Mongo 스타일로 계속 작성할 수 있으므로 개발팀의 시간을 절약할 수 있습니다. **또한 쿼리 매개변수를 사용하여 SQL 삽입 공격을 방지하는 데 도움이 됩니다.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | 기존 데이터베이스 스키마에 대한 정보를 추출하는 SQL 유틸리티입니다. 이를 통해 모든 인덱스, 테이블, 열, 제약 조건 등이 유효하고 `1:1`이 제대로 설정되어 있는지 쉽게 검증할 수 있습니다. 데이터베이스 스키마가 변경되면 새로운 열과 인덱스를 추가하는 자동화된 도우미도 개발했으며, 매우 자세한 오류 알림 기능도 제공합니다. |
| [knex](https://github.com/knex/knex) | `knex-schema-inspector`을 통해 데이터베이스 마이그레이션과 스키마 검증에만 사용하는 SQL 쿼리 빌더입니다. |
| [mandarin](https://github.com/ladjs/mandarin) | [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest)을 사용하여 마크다운을 지원하고 [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) 구문을 자동으로 번역합니다. |
| [mx-connect](https://github.com/zone-eu/mx-connect) | MX 서버와의 연결을 해결하고 설정하며 오류를 처리하는 Node.js 패키지입니다. |
| [pm2](https://github.com/Unitech/pm2) | 로드 밸런서(성능을 위해 [fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214))가 내장된 Node.js 프로덕션 프로세스 관리자입니다. |
| [smtp-server](https://github.com/nodemailer/smtp-server) | SMTP 서버 라이브러리 – 메일 교환("MX") 및 아웃바운드 SMTP 서버에 사용합니다. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | IMAP 서버를 벤치마크 및 RFC 사양 IMAP 프로토콜 호환성과 비교하여 테스트하는 데 유용한 도구입니다. 이 프로젝트는 [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\) 팀(2002년 7월부터 활발하게 운영 중인 오픈 소스 IMAP 및 POP3 서버)에서 개발했습니다. 저희는 이 도구를 사용하여 IMAP 서버를 광범위하게 테스트했습니다. |

> [GitHub에 있는 소스 코드](https://github.com/forwardemail)에서 우리가 사용하는 다른 프로젝트를 찾아볼 수 있습니다.

### 제공자 {#providers}

| 공급자 | 목적 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | [Cloudflare R2](https://developers.cloudflare.com/r2)을 사용한 DNS 제공자, 상태 점검, 로드 밸런서 및 백업 스토리지. |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | 전용 서버 호스팅 및 관리형 데이터베이스. |
| [Vultr](https://www.vultr.com/?ref=7429848) | 전용 서버 호스팅. |
| [DataPacket](https://www.datapacket.com) | 전용 서버 호스팅. |

## 생각 {#thoughts}

### 원칙 {#principles}

전달 이메일은 다음 원칙에 따라 설계되었습니다.

1. 항상 개발자 친화적이고, 보안 및 개인정보 보호에 중점을 두고, 투명하게 운영하십시오.
2. [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [유닉스](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [열두 가지 요소](https://12factor.net/), [오컴의 면도날](https://en.wikipedia.org/wiki/Occam%27s_razor), [도그푸딩](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)을 준수하십시오.
3. 초보 개발자, 부트스트랩 개발자, [라면-수익성 있는](http://www.paulgraham.com/ramenprofitable.html) 개발자를 대상으로 합니다.

### 실험 {#experiments}

> **요약:** 궁극적으로 S3 호환 개체 스토리지 및/또는 가상 테이블을 사용하는 것은 성능상의 이유로 기술적으로 실행 가능하지 않으며 메모리 제한으로 인해 오류가 발생하기 쉽습니다.

우리는 위에서 논의한 대로 최종 SQLite 솔루션을 개발하기 위해 몇 가지 실험을 수행했습니다.

그 중 하나는 S3 호환 스토리지 계층과 함께 [rclone]() 및 SQLite를 함께 사용해 보는 것이었습니다.

그 실험을 통해 우리는 rclone, SQLite, [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) 사용과 관련된 극단적인 사례를 더욱 잘 이해하고 발견할 수 있었습니다.

* rclone으로 `--vfs-cache-mode writes` 플래그를 활성화하면 읽기는 정상이지만 쓰기는 캐시됩니다.
* 여러 IMAP 서버가 전역적으로 분산되어 있는 경우, 단일 작성자와 여러 리스너(예: pub/sub 방식)가 있는 경우가 아니면 캐시가 각 서버에 분산됩니다.
* 이는 매우 복잡하며, 이와 같은 복잡성이 더해지면 단일 장애 지점이 더 많아집니다.
* S3 호환 스토리지 공급자는 부분 파일 변경을 지원하지 않습니다. 즉, `.sqlite` 파일을 변경하면 데이터베이스가 완전히 변경되어 다시 업로드됩니다.
* `rsync`와 같은 다른 솔루션도 있지만, 미리 쓰기 로그("[WAL](https://www.sqlite.org/wal.html)") 지원에 중점을 두지 않습니다. 따라서 Litestream을 검토하게 되었습니다. 다행히 암호화 방식에서 [WAL](https://www.sqlite.org/wal.html) 파일을 이미 암호화하고 있으므로 Litestream에 의존할 필요가 없습니다. 하지만 Litestream을 프로덕션 환경에서 사용할 수 있을지 아직 확신이 서지 않아 아래에 몇 가지 참고 사항을 남겨둡니다.
* `--vfs-cache-mode writes` 옵션(쓰기 작업에 `rclone` 대신 SQLite를 사용하는 *유일한* 방법)을 사용하면 전체 데이터베이스를 처음부터 메모리에 복사하려고 시도합니다. 10GB 사서함 하나를 처리하는 것은 괜찮지만, 저장 용량이 매우 큰 사서함을 여러 개 처리하면 IMAP 서버에서 메모리 제한, `ENOMEM` 오류, 세그먼테이션 오류 및 데이터 손상이 발생할 수 있습니다.
* S3 호환 스토리지 계층에 데이터를 저장하기 위해 SQLite [가상 테이블](https://www.sqlite.org/vtab.html)(예: [s3db](https://github.com/jrhy/s3db) 사용)을 사용하려고 하면 다음과 같은 몇 가지 문제가 발생합니다.
* S3 API 엔드포인트에 HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2 및 `.sqlite`3 메서드를 사용해야 하므로 읽기 및 쓰기 속도가 매우 느립니다.
* 개발 테스트 결과, 파이버 인터넷에서 50만~100만 개 이상의 레코드를 초과하는 레코드는 S3 호환 공급자에 대한 쓰기 및 읽기 처리량에 의해 여전히 제한되는 것으로 나타났습니다. 예를 들어, 개발자는 순차적인 SQL `.sqlite`5 문과 대량의 데이터를 대량으로 쓰는 문을 모두 실행하기 위해 `.sqlite`4 루프를 실행했습니다. 두 경우 모두 성능이 엄청나게 느렸습니다.
* 가상 테이블은 **인덱스**, `.sqlite`6 문, `.sqlite`7, `.sqlite`8을 가질 수 없습니다. 이로 인해 데이터 양에 따라 1~2분 이상 지연이 발생할 수 있습니다.
* 객체는 암호화되지 않은 상태로 저장되었으며, 기본 암호화 지원은 즉시 제공되지 않습니다.
* 또한 개념적, 기술적 측면에서 이전 글머리 기호와 유사한 `.sqlite`9를 사용하는 방안도 검토했습니다(따라서 동일한 문제가 있습니다). `rsync`1(현재 위 솔루션에서 사용 중)부터 `rsync`2까지 암호화로 래핑된 사용자 지정 `rsync`0 빌드를 사용하는 방안도 검토할 수 있습니다.
* 또 다른 가능한 접근 방식은 `rsync`3을 사용하는 것이었지만, 이 방법은 32GB 제한이 있어 복잡한 빌드 및 개발 과정이 필요합니다.
* `rsync`4 문이 필요합니다(따라서 가상 테이블 사용이 완전히 배제됩니다). `rsync`6을 사용한 후크가 제대로 작동하려면 `rsync`5 문이 필요합니다. 이를 통해 데이터가 손상되지 않고 검색된 행이 `rsync`7 스키마 정의(제약 조건, 변수 유형 및 임의 데이터 유효성 검사 포함)에 따라 유효한 문서로 변환될 수 있습니다.
* 오픈 소스 커뮤니티에서 SQLite와 관련된 S3 호환 프로젝트는 거의 모두 Python으로 작성됩니다(스택의 100%에 JavaScript를 사용하는 것은 아닙니다).
* `rsync`8(`rsync`9 참조)과 같은 압축 라이브러리는 유망해 보이지만, __PROTECTED_LINK_189__0은 그렇지 않습니다. __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5, __PROTECTED_LINK_189__6과 같은 데이터 유형에 대한 애플리케이션 측 압축은 더 깔끔하고 간편한 접근 방식입니다(또한 __PROTECTED_LINK_189__7 플래그 또는 열을 저장할 수 있기 때문에 마이그레이션도 더 쉽습니다. 또는 데이터베이스 메타데이터로 __PROTECTED_LINK_189__8, __PROTECTED_LINK_189__9를 압축에 사용하거나 __PROTECTED_LINK_190__0을 비압축에 사용할 수도 있습니다).
* 다행히 IMAP 서버 저장소에 이미 첨부 파일 중복 제거 기능이 구현되어 있습니다. 따라서 동일한 첨부 파일이 있는 모든 메시지는 첨부 파일의 사본을 보관하지 않습니다. 대신, 사서함의 여러 메시지와 스레드에 대해 단일 첨부 파일이 저장되고, 이후에는 외부 참조가 사용됩니다.
* SQLite 복제 및 백업 솔루션인 Litestream 프로젝트는 매우 유망하며, 앞으로도 계속 사용할 가능성이 높습니다.
* 작성자의 업적과 오픈 소스 기여를 10년 넘게 사랑해 온 만큼, 작성자의 공로를 깎아내리는 것은 아닙니다. 하지만 실제 사용 환경에서는 __PROTECTED_LINK_190__1과 __PROTECTED_LINK_190__2가 존재하는 것으로 보입니다.
* 백업 복원은 원활하고 간단해야 합니다. __PROTECTED_LINK_190__3과 __PROTECTED_LINK_190__4를 사용하는 MongoDB와 같은 솔루션을 사용하는 것은 번거로울 뿐만 아니라 시간도 많이 소요되고 구성도 복잡합니다.
* SQLite 데이터베이스는 이를 간소화합니다(단일 파일).
* 사용자가 언제든지 사서함을 가져가서 떠날 수 있는 솔루션을 설계하고 싶었습니다.
* __PROTECTED_LINK_190__5에 대한 간단한 Node.js 명령을 실행하면 디스크 저장소에서 영구적으로 삭제됩니다.
* 마찬가지로 HTTP __PROTECTED_LINK_190__6을 사용하는 S3 호환 API를 사용하여 사용자의 스냅샷과 백업을 쉽게 제거할 수 있습니다.
* SQLite는 가장 간단하고 빠르며 비용 효율적인 솔루션이었습니다.

### 대안이 부족합니다. {#lack-of-alternatives}

우리가 아는 한, 이런 방식으로 설계된 다른 이메일 서비스는 없으며 오픈 소스도 아닙니다.

우리는 이것이 기존 이메일 서비스가 [스파게티 코드](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:와 같은 레거시 기술을 사용하고 있기 때문일 수 있다고 생각합니다.

기존 이메일 서비스 제공업체의 대부분, 아니면 전부는 폐쇄 소스이거나 오픈 소스로 광고하지만 **실제로는 프런트엔드만 오픈 소스입니다.**

**이메일의 가장 민감한 부분** (실제 저장/IMAP/SMTP 상호작용)은 모두 백엔드(서버)에서 이루어지며, 프런트엔드(클라이언트)에서는 이루어지지 않습니다.**

### 이메일 전달을 시도해 보세요. {#try-out-forward-email}

지금 <https://forwardemail.net>! :rocket:에 가입하세요