# ISP 阻止端口 25 的解决方法 {#port-25-blocked-by-isp-workaround}


## 目录 {#table-of-contents}

* [如何绕过 ISP 阻止入站 SMTP 端口 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [如何绕过 ISP 阻止出站 SMTP 端口 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [如何检查我的 ISP 是否阻止端口](#how-can-i-check-if-my-isp-blocks-ports)


## 如何绕过 ISP 阻止入站 SMTP 端口 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

如果您的邮件服务器 IP 地址上的端口 25 未开放，那么本指南适合您。

例如，您在家中运行自定义邮件服务器，而您的互联网服务提供商（“ISP”）阻止了出站端口 25。

由于您无法在端口 25 上进行出站流量，因此由于此阻止，您很可能也无法在端口 25 上进行入站流量。

假设您正在使用我们的服务转发电子邮件，[您可以通过我们的常见问题解答中的此答案绕过此问题](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)。


## 如何绕过 ISP 阻止出站 SMTP 端口 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

如果您的 ISP 阻止了出站端口 25，那么您将不得不寻找替代方案或联系他们。


## 如何检查我的 ISP 是否阻止端口 {#how-can-i-check-if-my-isp-blocks-ports}

您可以从命令行或终端运行 `telnet smtp.forwardemail.net 25` 来查看您的出站端口 25 连接是否被阻止。
