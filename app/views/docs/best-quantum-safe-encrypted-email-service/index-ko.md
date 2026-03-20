# 양자 내성 이메일: 암호화된 SQLite 메일박스를 사용하여 이메일을 안전하게 보호하는 방법 {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="양자 안전 암호화 이메일 서비스 일러스트" class="rounded-lg" />


## 목차 {#table-of-contents}

* [서문](#foreword)
* [이메일 서비스 제공자 비교](#email-service-provider-comparison)
* [작동 원리](#how-does-it-work)
* [기술](#technologies)
  * [데이터베이스](#databases)
  * [보안](#security)
  * [메일박스](#mailboxes)
  * [동시성](#concurrency)
  * [백업](#backups)
  * [검색](#search)
  * [프로젝트](#projects)
  * [제공자](#providers)
* [생각](#thoughts)
  * [원칙](#principles)
  * [실험](#experiments)
  * [대안 부족](#lack-of-alternatives)
  * [Forward Email 사용해보기](#try-out-forward-email)


## 서문 {#foreword}

> \[!IMPORTANT]
> 저희 이메일 서비스는 [100% 오픈소스](https://github.com/forwardemail)이며 안전하고 암호화된 SQLite 메일박스를 통해 프라이버시를 중시합니다.

[IMAP 지원](/faq#do-you-support-receiving-email-with-imap)을 출시하기 전까지는 MongoDB를 영구 데이터 저장소로 사용했습니다.

이 기술은 훌륭하며 지금도 사용 중이지만, MongoDB에서 암호화된 저장(Encryption-at-rest)을 사용하려면 Digital Ocean이나 Mongo Atlas 같은 MongoDB Enterprise를 제공하는 공급자를 이용하거나 엔터프라이즈 라이선스를 구매해야 합니다(그리고 이후에는 영업팀과의 지연 문제도 겪게 됩니다).

[Forward Email](https://forwardemail.net) 팀은 개발자 친화적이고 확장 가능하며 신뢰할 수 있고 암호화된 IMAP 메일박스 저장 솔루션이 필요했습니다. 오픈소스 개발자로서 암호화된 저장 기능을 위해 라이선스 비용을 지불해야 하는 기술을 사용하는 것은 [저희 원칙](#principles)에 반했기에, 직접 실험하고 연구하며 이 요구를 해결할 새로운 솔루션을 처음부터 개발했습니다.

공유 데이터베이스를 사용해 메일박스를 저장하는 대신, 각 메일박스를 개별적으로 암호화하여 사용자의 비밀번호(사용자만 알고 있음)로 보호합니다. **저희 이메일 서비스는 비밀번호를 잊으면 메일박스를 잃게 될 정도로 매우 안전합니다** (오프라인 백업으로 복구하거나 처음부터 다시 시작해야 합니다).

아래에서 [이메일 서비스 제공자 비교](#email-service-provider-comparison), [서비스 작동 방식](#how-does-it-work), [기술 스택](#technologies) 등을 자세히 살펴보세요.


## 이메일 서비스 제공자 비교 {#email-service-provider-comparison}

저희는 개별 암호화된 SQLite 메일박스를 저장하고 무제한 도메인, 별칭, 사용자를 제공하며 아웃바운드 SMTP, IMAP, POP3를 지원하는 유일한 100% 오픈소스 및 프라이버시 중심 이메일 서비스 제공자입니다:

**다른 이메일 제공자와 달리 Forward Email에서는 도메인 또는 별칭별로 저장 공간 비용을 지불할 필요가 없습니다.** 저장 공간은 전체 계정에 걸쳐 공유되므로 여러 맞춤 도메인과 각 도메인별 여러 별칭이 있어도 완벽한 솔루션입니다. 원한다면 도메인 또는 별칭별 저장 공간 제한을 설정할 수도 있습니다.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">이메일 서비스 비교 읽기 <i class="fa fa-search-plus"></i></a>


## 작동 원리 {#how-does-it-work}

1. Apple Mail, Thunderbird, Gmail, Outlook 같은 이메일 클라이언트를 사용하여 사용자 이름과 비밀번호로 저희 안전한 [IMAP](/faq#do-you-support-receiving-email-with-imap) 서버에 연결합니다:

   * 사용자 이름은 `hello@example.com` 같은 도메인이 포함된 전체 별칭입니다.
   * 비밀번호는 무작위로 생성되며 <strong class="text-success"><i class="fa fa-key"></i> 비밀번호 생성</strong>을 클릭할 때만 30초 동안 표시됩니다. 이 버튼은 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 찾을 수 있습니다.
2. 연결되면, 이메일 클라이언트는 [IMAP 프로토콜 명령어](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)를 우리 IMAP 서버에 보내서 메일함을 동기화 상태로 유지합니다. 여기에는 임시 저장된 이메일 작성 및 저장과 사용자가 할 수 있는 기타 작업(예: 이메일을 중요 표시하거나 스팸/정크 메일로 플래그 지정)이 포함됩니다.

3. 메일 교환 서버(일반적으로 "MX" 서버라고 함)는 새로 들어오는 이메일을 받아서 메일함에 저장합니다. 이때 이메일 클라이언트가 알림을 받고 메일함을 동기화합니다. 우리 메일 교환 서버는 이메일을 한 명 이상의 수신자(포함 [웹훅](/faq#do-you-support-webhooks))에게 전달하거나, 암호화된 IMAP 저장소에 이메일을 저장하거나, **둘 다** 할 수 있습니다!

   > \[!TIP]
   > 더 알고 싶으신가요? [이메일 전달 설정 방법](/faq#how-do-i-get-started-and-set-up-email-forwarding), [메일 교환 서비스 작동 방식](/faq#how-does-your-email-forwarding-system-work), 또는 [가이드](/guides)를 읽어보세요.

4. 내부적으로, 우리의 안전한 이메일 저장 설계는 두 가지 방식으로 메일함을 암호화하고 오직 사용자만 접근할 수 있도록 합니다:

   * 발신자로부터 새 메일이 수신되면, 메일 교환 서버는 개별적이고 임시이며 암호화된 메일함에 메일을 기록합니다.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: 별칭(예: you@yourdomain.com)으로 수신된 메시지.
         MX->>SQLite: 메시지가 임시 메일함에 저장됨.
         Note over MX,SQLite: 구성된 다른 수신자 및 웹훅으로 전달.
         MX->>Sender: 성공!
     ```

   * 이메일 클라이언트로 IMAP 서버에 연결하면, 비밀번호가 메모리 내에서 암호화되어 메일함을 읽고 쓰는 데 사용됩니다. 이 비밀번호로만 메일함을 읽고 쓸 수 있습니다. 이 비밀번호는 사용자만 알고 있으므로, **사용자만** 메일함에 접근하여 읽고 쓸 수 있습니다. 다음에 이메일 클라이언트가 메일을 폴링하거나 동기화할 때, 새 메시지는 이 임시 메일함에서 전송되어 제공된 비밀번호를 사용해 실제 메일함 파일에 저장됩니다. 이 임시 메일함은 이후 삭제되어 비밀번호로 보호된 메일함에만 메시지가 남게 됩니다.

   * **IMAP에 연결된 경우(예: Apple Mail 또는 Thunderbird 같은 이메일 클라이언트를 사용하는 경우), 임시 디스크 저장소에 쓸 필요가 없습니다. 대신 메모리 내 암호화된 IMAP 비밀번호를 가져와 사용합니다. 실시간으로 메시지가 전달될 때, 모든 IMAP 서버에 활성 세션이 있는지 묻는 WebSocket 요청을 보내고(이것이 가져오기 부분), 이어서 암호화된 메모리 내 비밀번호를 전달합니다 – 따라서 임시 메일함에 쓸 필요 없이 암호화된 비밀번호를 사용해 실제 암호화된 메일함에 쓸 수 있습니다.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: 이메일 클라이언트를 사용해 IMAP 서버에 연결.
         IMAP->>SQLite: 임시 메일함에서 별칭 메일함으로 메시지 전송.
         Note over IMAP,SQLite: 별칭 메일함은 IMAP 비밀번호를 사용해 메모리 내에서만 접근 가능.
         SQLite->>IMAP: 이메일 클라이언트 요청에 따라 메시지 검색.
         IMAP->>You: 성공!
     ```

5. [암호화된 메일함의 백업](#backups)은 매일 생성됩니다. 언제든 새 백업을 요청하거나 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 최신 백업을 다운로드할 수 있습니다. 다른 이메일 서비스로 전환할 경우, 언제든 메일함과 백업을 쉽게 마이그레이션, 다운로드, 내보내기 및 삭제할 수 있습니다.


## 기술 {#technologies}

### 데이터베이스 {#databases}

다른 데이터베이스 저장 계층도 검토했지만, SQLite만큼 우리의 요구사항을 만족시키는 것은 없었습니다:
| Database                                               |                                                                    Encryption-at-rest                                                                   |  [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Mailboxes  |                           License                           | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)와 함께 사용 가능                          |                                  :white_check_mark:                                  |               :white_check_mark: 퍼블릭 도메인              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["MongoDB Enterprise에서만 사용 가능"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: 관계형 데이터베이스                               |                   :x: AGPL 및 `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [네트워크 전용](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: 관계형 데이터베이스                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [테스트되지 않았거나 아직 지원되지 않음?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [테스트되지 않았거나 아직 지원되지 않음?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [예](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: 관계형 데이터베이스                               | :white_check_mark: `PostgreSQL` (`BSD` 또는 `MIT`와 유사) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [InnoDB 전용](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: 관계형 데이터베이스                               |          :white_check_mark: `GPLv2` 및 `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [엔터프라이즈 전용 기능](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: 관계형 데이터베이스                               |                  :x: `BUSL-1.1` 등                          |                             :x:                             |

> 위 표에서 여러 SQLite 데이터베이스 저장 옵션을 비교한 [블로그 게시물](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/)이 있습니다.

### Security {#security}

항상 우리는 [encryption-at-rest](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [encryption-in-transit](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), :tangerine: [Tangerine](https://tangeri.ne)를 사용하는 [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)("DoH"), 그리고 메일박스에 대한 [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) 암호화를 사용합니다. 추가로, 우리는 토큰 기반 2단계 인증(SMS는 [중간자 공격](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)에 취약하므로 사용하지 않음), 루트 접근이 비활성화된 회전 SSH 키, 제한된 IP 주소를 통한 서버 독점 접근 등 다양한 보안 조치를 사용합니다.
[악의적인 메이드 공격](https://en.wikipedia.org/wiki/Evil_maid_attack) 또는 제3자 벤더의 악성 직원이 발생하더라도, **귀하의 메일박스는 오직 귀하가 생성한 비밀번호로만 열 수 있습니다**. 안심하세요, 우리는 Cloudflare, DataPacket, Digital Ocean, GitHub, Vultr의 SOC Type 2 준수 서버 제공업체 외에는 어떤 제3자 벤더에도 의존하지 않습니다.

우리의 목표는 가능한 한 [단일 실패 지점](https://en.wikipedia.org/wiki/Single_point_of_failure)을 최소화하는 것입니다.

### 메일박스 {#mailboxes}

> **요약;** 우리의 IMAP 서버는 각 메일박스마다 개별적으로 암호화된 SQLite 데이터베이스를 사용합니다.

[SQLite는 매우 인기 있는](https://www.sqlite.org/mostdeployed.html) 임베디드 데이터베이스로, 현재 귀하의 휴대폰과 컴퓨터에서 실행 중이며 – [거의 모든 주요 기술에서 사용됩니다](https://www.sqlite.org/famous.html).

예를 들어, 우리의 암호화된 서버에는 `linux@example.com`, `info@example.com`, `hello@example.com` 등의 메일박스마다 하나씩 `.sqlite` 데이터베이스 파일로 된 SQLite 데이터베이스가 있습니다. 데이터베이스 파일 이름을 이메일 주소로 짓지 않고, 대신 BSON ObjectID와 고유 UUID를 생성하여 메일박스 소유자나 이메일 주소를 알 수 없도록 합니다(예: `353a03f21e534321f5d6e267.sqlite`).

각 데이터베이스는 귀하만 알고 있는 비밀번호를 사용하여 [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/))로 자체 암호화됩니다. 이는 귀하의 메일박스가 개별적으로 암호화되고, 독립적이며, [샌드박스](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) 처리되고, 휴대 가능함을 의미합니다.

우리는 다음 [PRAGMA](https://www.sqlite.org/pragma.html)를 사용하여 SQLite를 미세 조정했습니다:

| `PRAGMA`                 | 목적                                                                                                                                                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLite 데이터베이스 암호화](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). 자세한 내용은 [프로젝트](#projects) 아래의 `better-sqlite3-multiple-ciphers`를 참조하세요.                                 |
| `key="****************"` | 이것은 귀하의 이메일 클라이언트 IMAP 연결을 통해 서버로 전달되는 메모리 내에서만 복호화된 비밀번호입니다. 읽기 및 쓰기 세션마다 새 데이터베이스 인스턴스가 생성되고 닫혀 샌드박싱과 격리를 보장합니다.                                               |
| `journal_mode=WAL`       | 쓰기 앞서 로그("[WAL](https://www.sqlite.org/wal.html)") [성능 향상 및 동시 읽기 접근 허용](https://litestream.io/tips/#wal-journal-mode).                                                                                                           |
| `busy_timeout=5000`      | 다른 쓰기 작업이 진행 중일 때 쓰기 잠금 오류를 방지합니다. [관련 정보](https://litestream.io/tips/#busy-timeout).                                                                                                                                      |
| `synchronous=NORMAL`     | 데이터 손상 위험 없이 트랜잭션 내구성을 높입니다. [관련 정보](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                         |
| `foreign_keys=ON`        | 외래 키 참조(예: 한 테이블에서 다른 테이블로의 관계)를 강제합니다. [기본적으로 SQLite에서는 활성화되어 있지 않지만](https://www.sqlite.org/foreignkeys.html), 검증과 데이터 무결성을 위해 활성화해야 합니다.                                         |
| `encoding='UTF-8'`       | 개발자의 편의를 위한 [기본 인코딩](https://www.sqlite.org/pragma.html#pragma_encoding)입니다.                                                                                                                                                |
> 모든 다른 기본값은 [공식 PRAGMA 문서](https://www.sqlite.org/pragma.html#pragma_auto_vacuum)에 명시된 SQLite에서 가져옵니다.

### 동시성 {#concurrency}

> **요약;** 암호화된 SQLite 메일박스에 대한 동시 읽기 및 쓰기를 위해 `WebSocket`을 사용합니다.

#### 읽기 {#reads}

휴대폰의 이메일 클라이언트는 `imap.forwardemail.net`을 당사의 Digital Ocean IP 주소 중 하나로 해석할 수 있으며, 데스크톱 클라이언트는 전혀 다른 [제공자](#providers)의 별도 IP를 해석할 수 있습니다.

어떤 IMAP 서버에 이메일 클라이언트가 연결되든, 데이터베이스에서 실시간으로 100% 정확하게 읽기를 원합니다. 이는 WebSocket을 통해 이루어집니다.

#### 쓰기 {#writes}

데이터베이스에 쓰기는 약간 다릅니다 – SQLite는 임베디드 데이터베이스이고 기본적으로 메일박스가 단일 파일에 저장되기 때문입니다.

아래에 `litestream`, `rqlite`, `dqlite`와 같은 옵션을 탐색했으나, 어느 것도 우리의 요구사항을 충족하지 못했습니다.

쓰기 전 로그 기록("[WAL](https://www.sqlite.org/wal.html)")이 활성화된 상태에서 쓰기를 수행하려면, 단 하나의 서버("Primary")만이 이를 담당하도록 해야 합니다. [WAL](https://www.sqlite.org/wal.html)은 동시성을 크게 향상시키며 한 명의 작성자와 다수의 읽기자를 허용합니다.

Primary 서버는 암호화된 메일박스를 포함하는 마운트된 볼륨이 있는 데이터 서버에서 실행됩니다. 배포 관점에서 보면, `imap.forwardemail.net` 뒤에 있는 모든 개별 IMAP 서버를 보조 서버("Secondary")로 간주할 수 있습니다.

양방향 통신은 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)를 통해 이루어집니다:

* Primary 서버는 [ws](https://github.com/websockets/ws)의 `WebSocketServer` 서버 인스턴스를 사용합니다.
* Secondary 서버는 [ws](https://github.com/websockets/ws)의 `WebSocket` 클라이언트 인스턴스를 사용하며, 이는 [websocket-as-promised](https://github.com/vitalets/websocket-as-promised)와 [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket)으로 래핑되어 있습니다. 이 두 래퍼는 `WebSocket`이 재연결되고 특정 데이터베이스 쓰기를 위해 데이터를 송수신할 수 있도록 보장합니다.

### 백업 {#backups}

> **요약;** 암호화된 메일박스의 백업은 매일 생성됩니다. 또한 언제든지 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 즉시 새 백업을 요청하거나 최신 백업을 다운로드할 수 있습니다.

백업을 위해, IMAP 명령 처리 중 매일 SQLite `VACUUM INTO` 명령을 실행하며, 이는 메모리 내 IMAP 연결에서 암호화된 비밀번호를 활용합니다. 기존 백업이 없거나 파일의 [SHA-256](https://en.wikipedia.org/wiki/SHA-2) 해시가 가장 최근 백업과 비교해 변경된 경우 백업이 저장됩니다.

`backup` 내장 명령 대신 `VACUUM INTO` 명령을 사용하는 이유는, `backup` 명령 실행 중 페이지가 수정되면 다시 시작해야 하기 때문입니다. `VACUUM INTO` 명령은 스냅샷을 찍습니다. 자세한 내용은 [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) 및 [Hacker News](https://news.ycombinator.com/item?id=31387556)의 댓글을 참조하세요.

또한 `backup` 명령은 `rekey`가 호출될 때까지 데이터베이스가 잠시 암호화되지 않은 상태로 남기 때문에 `VACUUM INTO`를 사용합니다(자세한 내용은 이 GitHub [댓글](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) 참조).

Secondary는 `WebSocket` 연결을 통해 Primary에 백업 실행을 지시하며, Primary는 명령을 수신한 후 다음을 수행합니다:

1. 암호화된 메일박스에 연결합니다.
2. 쓰기 잠금을 획득합니다.
3. `wal_checkpoint(PASSIVE)`를 통해 WAL 체크포인트를 실행합니다.
4. SQLite `VACUUM INTO` 명령을 실행합니다.
5. 복사된 파일이 암호화된 비밀번호로 열리는지 확인합니다(안전장치/더미 방지).
6. 이를 Cloudflare R2에 업로드하여 저장하거나 지정된 경우 자체 제공자에게 업로드합니다.
<!--
7. 결과 백업 파일을 `gzip`으로 압축합니다.
8. Cloudflare R2에 업로드하여 저장합니다(또는 지정된 경우 자체 제공업체에).
-->

메일박스는 암호화되어 있다는 점을 기억하세요 – WebSocket 통신에 대해 IP 제한 및 기타 인증 조치를 적용하고 있지만 – 악의적인 행위자가 있더라도 WebSocket 페이로드에 IMAP 비밀번호가 포함되어 있지 않으면 데이터베이스를 열 수 없습니다.

현재는 메일박스당 백업이 하나만 저장되지만, 앞으로는 시점 복구("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)")를 제공할 수도 있습니다.

### 검색 {#search}

우리의 IMAP 서버는 복잡한 쿼리, 정규 표현식 등을 지원하는 `SEARCH` 명령을 지원합니다.

빠른 검색 성능은 [FTS5](https://www.sqlite.org/fts5.html)와 [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex) 덕분입니다.

우리는 SQLite 메일박스에 `Date` 값을 [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) 문자열로 저장하며, 이는 [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (UTC 타임존 사용) 을 통해 동등성 비교가 제대로 작동하도록 합니다.

검색 쿼리에 포함된 모든 속성에 대해 인덱스도 저장됩니다.

### 프로젝트 {#projects}

다음은 소스 코드 및 개발 프로세스에서 사용하는 프로젝트를 알파벳순으로 정리한 표입니다:

| 프로젝트                                                                                     | 목적                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | 전체 서버 군을 쉽게 유지, 확장 및 관리하기 위한 DevOps 자동화 플랫폼입니다.                                                                                                                                                                                                                                                                                         |
| [Bree](https://github.com/breejs/bree)                                                        | cron, 날짜, ms, later, 그리고 사람이 이해하기 쉬운 지원을 제공하는 Node.js 및 JavaScript용 작업 스케줄러입니다.                                                                                                                                                                                                                                                     |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | 보안과 개인정보 보호를 고려한 개발자 친화적인 JavaScript 및 Node.js 로깅 라이브러리입니다.                                                                                                                                                                                                                                                                           |
| [Lad](https://github.com/ladjs/lad)                                                           | MVC 등으로 전체 아키텍처와 엔지니어링 설계를 지원하는 Node.js 프레임워크입니다.                                                                                                                                                                                                                                                                                     |
| [MongoDB](https://www.mongodb.com/)                                                           | 메일박스 외의 모든 데이터를 저장하는 데 사용하는 NoSQL 데이터베이스 솔루션입니다(예: 계정, 설정, 도메인, 별칭 구성).                                                                                                                                                                                                                                                  |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | 전체 스택에서 사용하는 MongoDB 객체 문서 모델링("ODM")입니다. 우리는 **SQLite와 함께 Mongoose를 계속 사용할 수 있도록** 특별한 헬퍼를 작성했습니다 :tada:                                                                                                                                                                                                       |
| [Node.js](https://nodejs.org/en)                                                              | 모든 서버 프로세스를 실행하는 오픈 소스 크로스 플랫폼 JavaScript 런타임 환경입니다.                                                                                                                                                                                                                                                                                 |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | 이메일 전송, 연결 생성 등을 위한 Node.js 패키지입니다. 우리는 이 프로젝트의 공식 후원자입니다.                                                                                                                                                                                                                                                                       |
| [Redis](https://redis.io/)                                                                    | 캐싱, 발행/구독 채널, DNS over HTTPS 요청을 위한 인메모리 데이터베이스입니다.                                                                                                                                                                                                                                                                                       |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | 전체 데이터베이스 파일(쓰기 앞서 기록("WAL"), 저널, 롤백 등 포함)을 암호화할 수 있는 SQLite 암호화 확장입니다.                                                                                                                                                                                                                                                     |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | 개발용 메일박스를 테스트, 다운로드, 조회할 수 있는 시각적 SQLite 편집기(사용할 수도 있습니다).                                                                                                                                                                                                                                                                       |
| [SQLite](https://www.sqlite.org/about.html)                                                   | 확장 가능하고 독립적이며 빠르고 견고한 IMAP 저장을 위한 임베디드 데이터베이스 계층입니다.                                                                                                                                                                                                                                                                           |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Node.js 기반 스팸 방지, 이메일 필터링 및 피싱 방지 도구입니다 ([Spam Assassin](https://spamassassin.apache.org/) 및 [rspamd](https://github.com/rspamd/rspamd) 대체품).                                                                                                                                                                                              |
| [Tangerine](https://tangeri.ne)                                                               | Node.js와 Redis 캐싱을 사용한 DNS over HTTPS 요청으로 전 세계 일관성과 그 이상을 보장합니다.                                                                                                                                                                                                                                                                       |
| [Thunderbird](https://www.thunderbird.net/)                                                   | 우리 개발팀이 사용하며 Forward Email과 함께 사용할 것을 권장하는 **선호 이메일 클라이언트**입니다.                                                                                                                                                                                                                                                                  |
| [UTM](https://github.com/utmapp/UTM)                                                          | iOS 및 macOS용 가상 머신을 생성하여 IMAP 및 SMTP 서버와 함께 다양한 이메일 클라이언트를 병렬로 테스트하는 데 사용하는 개발팀 도구입니다.                                                                                                                                                                                                                         |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | 모든 인프라를 구동하는 현대적인 오픈 소스 Linux 기반 서버 운영 체제입니다.                                                                                                                                                                                                                                                                                         |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | IMAP 서버 라이브러리입니다 – [첨부 파일 중복 제거](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) 및 [IMAP 프로토콜 지원](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md) 참고하세요.                                                                                              |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | SQLite3와 프로그래밍 방식으로 상호작용하기 위한 빠르고 간단한 Node.js API 라이브러리입니다.                                                                                                                                                                                                                                                                         |
| [email-templates](https://github.com/forwardemail/email-templates)                            | 맞춤 이메일(예: 계정 알림 등)을 생성, 미리보기, 전송할 수 있는 개발자 친화적인 이메일 프레임워크입니다.                                                                                                                                                                                                                                                             |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | Mongo 스타일 구문을 사용하는 SQL 쿼리 빌더입니다. 전체 스택에서 Mongo 스타일로 계속 작성할 수 있어 개발팀의 시간을 절약하며, 쿼리 매개변수를 사용해 SQL 인젝션 공격도 방지합니다.                                                                                                                                                                               |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | 기존 데이터베이스 스키마 정보를 추출하는 SQL 유틸리티입니다. 모든 인덱스, 테이블, 컬럼, 제약 조건 등이 올바르고 `1:1`로 일치하는지 쉽게 검증할 수 있습니다. 데이터베이스 스키마 변경 시 새 컬럼과 인덱스를 추가하는 자동화 헬퍼도 작성했으며, 매우 상세한 오류 알림도 제공합니다.                                                                                   |
| [knex](https://github.com/knex/knex)                                                          | 데이터베이스 마이그레이션과 `knex-schema-inspector`를 통한 스키마 검증에만 사용하는 SQL 쿼리 빌더입니다.                                                                                                                                                                                                                                                             |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest)를 사용하여 Markdown 지원과 함께 자동 [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) 구문 번역을 제공합니다.                                                                                                                                   |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | MX 서버와의 연결을 해결하고 오류를 처리하는 Node.js 패키지입니다.                                                                                                                                                                                                                                                                                                  |
| [pm2](https://github.com/Unitech/pm2)                                                         | 내장 로드 밸런서가 포함된 Node.js 프로덕션 프로세스 관리자입니다 ([성능을 위해 미세 조정됨](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214)).                                                                                                                                                                                                     |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | SMTP 서버 라이브러리로, 메일 교환("MX") 및 아웃바운드 SMTP 서버에 사용합니다.                                                                                                                                                                                                                                                                                       |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | IMAP 서버를 벤치마크 및 RFC 명세 IMAP 프로토콜 호환성에 대해 테스트하는 유용한 도구입니다. 이 프로젝트는 [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) 팀이 만들었으며(2002년 7월부터 활발한 오픈 소스 IMAP 및 POP3 서버), 우리는 이 도구로 IMAP 서버를 광범위하게 테스트했습니다.                                                                                      |
> [우리의 GitHub 소스 코드](https://github.com/forwardemail)에서 사용하는 다른 프로젝트들을 찾을 수 있습니다.

### Providers {#providers}

| Provider                                        | Purpose                                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNS 제공자, 상태 검사, 로드 밸런서, 그리고 [Cloudflare R2](https://developers.cloudflare.com/r2)를 이용한 백업 스토리지.       |
| [GitHub](https://github.com/)                   | 소스 코드 호스팅, CI/CD, 그리고 프로젝트 관리.                                                                              |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | 전용 서버 호스팅 및 관리형 데이터베이스.                                                                                     |
| [Vultr](https://www.vultr.com/?ref=7429848)     | 전용 서버 호스팅.                                                                                                            |
| [DataPacket](https://www.datapacket.com)        | 전용 서버 호스팅.                                                                                                            |


## Thoughts {#thoughts}

### Principles {#principles}

Forward Email은 다음 원칙에 따라 설계되었습니다:

1. 항상 개발자 친화적이고, 보안 및 개인정보 보호에 중점을 두며, 투명해야 합니다.
2. [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [오컴의 면도날](https://en.wikipedia.org/wiki/Occam%27s_razor), 그리고 [도그푸딩](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)을 준수합니다.
3. 자금이 부족한, 부트스트랩 방식으로 운영되는, 그리고 [라면 수익성](http://www.paulgraham.com/ramenprofitable.html)이 있는 개발자를 대상으로 합니다.

### Experiments {#experiments}

> **요약;** 궁극적으로 S3 호환 객체 스토리지 및/또는 Virtual Tables 사용은 성능 문제로 기술적으로 실현 가능하지 않으며 메모리 제한으로 인해 오류가 발생하기 쉽습니다.

우리는 위에서 논의한 최종 SQLite 솔루션에 도달하기까지 몇 가지 실험을 했습니다.

그 중 하나는 [rclone]()과 SQLite를 S3 호환 스토리지 계층과 함께 사용하는 시도였습니다.

이 실험을 통해 rclone, SQLite, 그리고 [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) 사용과 관련된 엣지 케이스를 더 잘 이해하고 발견했습니다:

* rclone에서 `--vfs-cache-mode writes` 플래그를 활성화하면 읽기는 괜찮지만 쓰기는 캐시됩니다.
  * 전 세계에 분산된 여러 IMAP 서버가 있다면, 단일 작성자와 다수의 청취자(예: pub/sub 방식)가 아닌 이상 캐시는 서버 간에 동기화되지 않습니다.
  * 이는 매우 복잡하며, 이런 복잡성을 추가하면 단일 실패 지점이 더 많이 생깁니다.
  * S3 호환 스토리지 제공자는 부분 파일 변경을 지원하지 않으므로 `.sqlite` 파일의 어떤 변경도 데이터베이스 전체 변경 및 재업로드를 의미합니다.
  * `rsync` 같은 다른 솔루션도 있지만, 쓰기 앞서 로그("[WAL](https://www.sqlite.org/wal.html)") 지원에 초점이 맞춰져 있지 않습니다. 그래서 우리는 Litestream을 검토했습니다. 다행히도 우리의 암호화 사용은 이미 [WAL](https://www.sqlite.org/wal.html) 파일을 암호화하므로 Litestream에 의존할 필요는 없습니다. 하지만 아직 Litestream을 프로덕션에 자신 있게 사용하기에는 부족하며 아래에 몇 가지 메모가 있습니다.
  * `--vfs-cache-mode writes` 옵션(쓰기용으로 rclone 위에서 SQLite를 사용하는 *유일한* 방법)을 사용하면 전체 데이터베이스를 메모리에서 처음부터 복사하려 시도합니다. 10GB짜리 메일박스 하나는 괜찮지만, 매우 큰 여러 메일박스를 처리하면 IMAP 서버가 메모리 제한과 `ENOMEM` 오류, 세그멘테이션 오류, 데이터 손상에 직면합니다.
* SQLite [Virtual Tables](https://www.sqlite.org/vtab.html)(예: [s3db](https://github.com/jrhy/s3db) 사용)를 사용해 데이터를 S3 호환 스토리지 계층에 두려 하면 여러 문제가 발생합니다:
  * 읽기 및 쓰기가 매우 느립니다. S3 API 엔드포인트에 HTTP `GET`, `PUT`, `HEAD`, `POST` 요청을 계속 보내야 하기 때문입니다.
  * 개발 테스트에서 500K-1M+ 레코드를 초과하면 광섬유 인터넷에서도 S3 호환 제공자에 쓰기 및 읽기 처리량에 의해 제한됩니다. 예를 들어, 개발자들이 순차적 SQL `INSERT` 문과 대량 데이터 쓰기를 `for` 루프로 실행했는데, 두 경우 모두 성능이 매우 느렸습니다.
  * 가상 테이블은 **인덱스**, `ALTER TABLE` 문, 그리고 [기타](https://stackoverflow.com/a/12507650) [제한사항](https://sqlite.org/lang_createvtab.html)이 있어 데이터 양에 따라 1-2분 이상 지연될 수 있습니다.
  * 객체는 암호화되지 않은 상태로 저장되며, 기본 암호화 지원이 없습니다.
* [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs)도 비슷한 개념과 기술적 문제를 가지고 있어 같은 문제를 겪습니다. 가능성으로는 [wxSQLite3](https://github.com/utelle/wxsqlite3) 같은 암호화가 포함된 커스텀 `sqlite3` 빌드를 사용하는 방법이 있는데, 이는 [설정 파일 편집](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276)을 통해 가능합니다(우리가 위 솔루션에서 현재 사용 중).
* 또 다른 접근법은 [multiplex 확장](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c)을 사용하는 것이지만, 32GB 제한이 있고 복잡한 빌드 및 개발 문제를 야기합니다.
* `ALTER TABLE` 문이 필요하므로(가상 테이블 사용 불가) `knex-schema-inspector`와의 훅이 제대로 작동하도록 해야 합니다. 이는 데이터 손상을 방지하고, `mongoose` 스키마 정의에 따른 유효한 문서로 변환 가능한 행을 보장합니다(제약조건, 변수 타입, 임의 데이터 검증 포함).
* 오픈소스 커뮤니티에서 SQLite 관련 S3 호환 프로젝트는 거의 Python 기반이며, 우리가 사용하는 100% JavaScript 스택과는 다릅니다.
* [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) 같은 압축 라이브러리는 유망해 보이나, [아직 프로덕션 사용 준비가 안 된 듯합니다](https://github.com/phiresky/sqlite-zstd#usage). 대신 `String`, `Object`, `Map`, `Array`, `Set`, `Buffer` 같은 데이터 타입에 대한 애플리케이션 측 압축이 더 깔끔하고 쉬운 접근법이며, 마이그레이션도 쉽습니다(예: `Boolean` 플래그나 컬럼 저장, 또는 데이터베이스 메타데이터로 `PRAGMA user_version=1` 압축, `user_version=0` 비압축 사용).
  * 다행히 IMAP 서버 스토리지에 첨부파일 중복 제거가 구현되어 있어, 동일 첨부파일이 여러 메시지에 중복 저장되지 않고, 하나의 첨부파일이 여러 메시지와 스레드에서 참조됩니다.
* SQLite 복제 및 백업 솔루션인 Litestream 프로젝트는 매우 유망하며, 앞으로 사용할 가능성이 큽니다.
  * 저자들을 폄하하려는 것은 아니며, 10년 넘게 오픈소스에 기여한 그들의 작업을 존경하지만, 실제 사용에서는 [많은 문제](https://github.com/benbjohnson/litestream/issues)와 [데이터 손실 가능성](https://github.com/benbjohnson/litestream/issues/218)이 있는 것으로 보입니다.
* 백업 복원은 마찰 없이 간단해야 합니다. MongoDB의 `mongodump`와 `mongoexport` 같은 솔루션은 번거롭고 시간이 많이 걸리며 설정이 복잡합니다.
  * SQLite 데이터베이스는 단일 파일이라 간단합니다.
  * 사용자가 언제든지 메일박스를 가져가고 떠날 수 있는 솔루션을 설계하고자 했습니다.
    * 간단한 Node.js 명령어 `fs.unlink('mailbox.sqlite')`로 디스크 저장소에서 영구 삭제가 가능합니다.
    * S3 호환 API의 HTTP `DELETE`를 사용해 스냅샷과 백업을 쉽게 제거할 수도 있습니다.
  * SQLite가 가장 간단하고 빠르며 비용 효율적인 솔루션이었습니다.
### 대안의 부재 {#lack-of-alternatives}

저희가 아는 한, 다른 이메일 서비스들은 이와 같은 방식으로 설계되지 않았으며 오픈 소스도 아닙니다.

이것은 기존 이메일 서비스들이 [스파게티 코드](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti: 가 포함된 레거시 기술을 운영 중이기 때문일 수 있다고 *생각합니다*.

기존 이메일 서비스 제공업체 대부분은 폐쇄 소스이거나 오픈 소스라고 광고하지만, **실제로는 프론트엔드만 오픈 소스입니다.**

**이메일에서 가장 민감한 부분**(실제 저장/IMAP/SMTP 상호작용)은 **모두 백엔드(서버)에서 처리되며, 프론트엔드(클라이언트)에서는 *처리되지 않습니다*.**

### Forward Email 사용해보기 {#try-out-forward-email}

오늘 <https://forwardemail.net> 에서 가입하세요! :rocket:
