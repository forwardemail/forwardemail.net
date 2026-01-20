# 개인정보 보호정책 {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" 클래스="둥근-lg" />

## 목차 {#table-of-contents}

* [부인 성명](#disclaimer)
* [수집되지 않은 정보](#information-not-collected)
* [수집된 정보](#information-collected)
* [정보 공유](#information-shared)
* [정보 제거](#information-removal)
* [추가 공개](#additional-disclosures)

## 면책 조항 {#disclaimer}

사이트 전체에 적용되므로 [자귀](/terms)을 따르세요.

## 정보가 수집되지 않았습니다. {#information-not-collected}

**[오류](/faq#do-you-store-error-logs), [아웃바운드 SMTP 이메일](/faq#do-you-support-sending-email-with-smtp)을 제외하고, 스팸이나 악성 활동이 감지되는 경우(예: 속도 제한)**

* 전달된 이메일은 디스크 저장소나 데이터베이스에 저장하지 않습니다.
* 이메일 관련 메타데이터는 디스크 저장소나 데이터베이스에 저장하지 않습니다.
* 로그나 IP 주소는 디스크 저장소나 데이터베이스에 저장하지 않습니다.

## 수집된 정보 {#information-collected}

투명성을 위해 언제든지 <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">소스 코드를 확인</a>하여 아래 정보가 어떻게 수집되고 사용되는지 확인하실 수 있습니다.

**기능성과 서비스 개선을 위해 다음 정보를 수집하고 안전하게 저장합니다.**

* 이메일 및 캘린더 정보는 IMAP/POP3/CalDAV/CardDAV 액세스 및 사서함 기능용으로만 [암호화된 SQLite 데이터베이스](/blog/docs/best-quantum-safe-encrypted-email-service)에 저장됩니다.
* 이메일 전달 서비스만 사용하는 경우, [수집되지 않은 정보](#information-not-collected)에 설명된 대로 이메일이 디스크 또는 데이터베이스 저장소에 저장되지 않습니다.
* 이메일 전달 서비스는 메모리 내에서만 작동하며 디스크 저장소나 데이터베이스에는 기록되지 않습니다.
* IMAP/POP3/CalDAV/CardDAV 저장소는 저장 시 암호화되고, 전송 시 암호화되어 LUKS 암호화 디스크에 저장됩니다.
* IMAP/POP3/CalDAV/CardDAV 저장소의 백업은 저장 시 암호화되고, 전송 시 암호화되어 [클라우드플레어 R2](https://www.cloudflare.com/developer-platform/r2/)에 저장됩니다.
* 웹사이트 트래픽을 위해 세션에 쿠키를 저장합니다.
* 귀하가 제공한 이메일 주소를 저장합니다.
* 귀하가 제공하신 도메인 이름, 별칭 및 구성은 저장됩니다.
* `4xx` 및 `5xx` SMTP 응답 코드 [오류 로그](/faq#do-you-store-error-logs)는 7일 동안 저장됩니다.
* [아웃바운드 SMTP 이메일](/faq#do-you-support-sending-email-with-smtp)은 약 30일 동안 저장됩니다.
* 이 기간은 "날짜" 헤더에 따라 달라집니다. 향후 "날짜" 헤더가 있는 경우 이메일을 나중에 전송할 수 있도록 허용하기 때문입니다.
* **이메일이 성공적으로 전송되거나 영구적으로 오류가 발생하면 메시지 본문이 삭제되고 삭제됩니다.**
* 발신 SMTP 이메일 본문을 기본값인 0일(전송 성공 또는 영구적 오류 발생 후)보다 더 오래 보관하려면 도메인의 고급 설정으로 이동하여 `0`에서 `30` 사이의 값을 입력하세요.
* 일부 사용자는 [내 계정 > 이메일](/my-account/emails) 미리보기 기능을 사용하여 이메일이 어떻게 표시되는지 확인하는 것을 선호하므로, 설정 가능한 보존 기간을 지원합니다.
* __PROTECTED_LINK_30__0도 지원합니다.
* 이메일 또는 <a href="/help">도움말</a> 페이지를 통해 제출된 의견이나 질문 등 사용자가 자발적으로 제공하는 추가 정보.

## 정보 공유됨 {#information-shared}

당사는 귀하의 정보를 제3자와 공유하지 않습니다. 또한 제3자 분석 또는 원격 분석 소프트웨어 서비스를 이용하지 않습니다.

법원 명령에 따른 법적 요청을 준수해야 할 수도 있으며, 준수할 것입니다(하지만 [우리는 "수집되지 않은 정보"에 언급된 정보를 수집하지 않습니다.](#information-not-collected)은 처음부터 제공할 수 없다는 점을 명심하세요).

## 정보 제거 {#information-removal}

언제든지 귀하가 제공한 정보를 삭제하고 싶으시면 <a href="/my-account/security">내 계정 > 보안</a>으로 가서 "계정 삭제"를 클릭하세요.

남용 방지 및 완화를 위해, 첫 번째 결제일로부터 5일 이내에 계정을 삭제하는 경우 관리자가 수동으로 삭제 검토를 해야 할 수도 있습니다.

이 프로세스는 일반적으로 24시간 이내에 완료되며, 사용자가 당사 서비스를 이용해 스팸 메시지를 보낸 후 재빨리 계정을 삭제하는 경우가 많아 Stripe에서 해당 사용자의 결제 방법 지문을 차단할 수 없었기 때문에 이러한 프로세스를 구현했습니다.

## 추가 공개 {#additional-disclosures}

이 사이트는 Cloudflare의 보호를 받으며 [개인정보 보호정책](https://www.cloudflare.com/privacypolicy/) 및 [서비스 약관](https://www.cloudflare.com/website-terms/)이 적용됩니다.