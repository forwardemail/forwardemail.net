# ISP 해결 방법 {#port-25-blocked-by-isp-workaround}에 의해 포트 25가 차단되었습니다.

## 목차 {#table-of-contents}

* [ISP가 포트 25에서 인바운드 SMTP를 차단하는 문제를 해결하는 방법](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [ISP가 포트 25에서 아웃바운드 SMTP를 차단하는 문제를 해결하는 방법](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [ISP가 포트를 차단하는지 어떻게 확인할 수 있나요?](#how-can-i-check-if-my-isp-blocks-ports)

## ISP가 포트 25에서 인바운드 SMTP를 차단하는 문제를 해결하는 방법 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

메일 서버의 IP 주소에 포트 25가 열려 있지 않은 경우 이 가이드가 도움이 될 것입니다.

예를 들어, 집에서 맞춤형 메일 서버를 운영하고 있는데 인터넷 서비스 제공업체(ISP)가 아웃바운드 포트 25를 차단했다고 가정해 보겠습니다.

포트 25에서 아웃바운드 트래픽이 발생할 수 없으므로 이 차단으로 인해 포트 25에서 인바운드 트래픽도 발생할 가능성이 낮습니다.

귀하가 당사 서비스를 이용해 이메일을 전달한다고 가정하면, [여기 FAQ 답변을 통해 이 문제를 해결할 수 있습니다.](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## ISP가 포트 25에서 아웃바운드 SMTP를 차단하는 문제를 해결하는 방법 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

ISP가 아웃바운드 포트 25를 차단하는 경우 대체 솔루션을 찾거나 해당 ISP에 문의해야 합니다.

## ISP가 포트 {#how-can-i-check-if-my-isp-blocks-ports}}를 차단하는지 어떻게 확인할 수 있나요?

명령줄이나 터미널에서 `telnet smtp.forwardemail.net 25`을 실행하면 아웃바운드 포트 25 연결이 차단되었는지 확인할 수 있습니다.