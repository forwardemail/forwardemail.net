# ISP가 포트 25를 차단했을 때 우회 방법 {#port-25-blocked-by-isp-workaround}


## 목차 {#table-of-contents}

* [ISP가 포트 25에서 수신 SMTP를 차단했을 때 우회하는 방법](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [ISP가 포트 25에서 발신 SMTP를 차단했을 때 우회하는 방법](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [내 ISP가 포트를 차단하는지 어떻게 확인할 수 있나요](#how-can-i-check-if-my-isp-blocks-ports)


## ISP가 포트 25에서 수신 SMTP를 차단했을 때 우회하는 방법 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

메일 서버의 IP 주소에서 포트 25가 열려 있지 않다면, 이 가이드가 도움이 될 것입니다.

예를 들어, 집에서 커스텀 메일 서버를 운영 중인데, 인터넷 서비스 제공자("ISP")가 발신 포트 25를 차단한 경우입니다.

포트 25에서 발신 트래픽이 불가능하므로, 이 차단으로 인해 포트 25에서 수신 트래픽도 대부분 불가능할 것입니다.

당신이 당사 서비스를 사용하여 이메일을 전달하는 경우, [여기 FAQ 답변을 통해 이 문제를 우회할 수 있습니다](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## ISP가 포트 25에서 발신 SMTP를 차단했을 때 우회하는 방법 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

ISP가 발신 포트 25를 차단한다면, 대체 솔루션을 찾거나 ISP에 문의해야 합니다.


## 내 ISP가 포트를 차단하는지 어떻게 확인할 수 있나요 {#how-can-i-check-if-my-isp-blocks-ports}

명령줄이나 터미널에서 `telnet smtp.forwardemail.net 25` 명령을 실행하여 발신 포트 25 연결이 차단되었는지 확인할 수 있습니다.
