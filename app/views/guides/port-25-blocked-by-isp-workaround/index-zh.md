# 端口 25 被 ISP 解决方法阻止 {#port-25-blocked-by-isp-workaround}

## 目录 {#table-of-contents}

* [如何解决 ISP 阻止端口 25 上的入站 SMTP](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [如何解决 ISP 阻止端口 25 上的出站 SMTP](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [如何检查我的 ISP 是否阻止了端口](#how-can-i-check-if-my-isp-blocks-ports)

## 如何解决 ISP 阻止端口 25 上的入站 SMTP {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

如果您的邮件服务器的 IP 地址上没有打开端口 25，那么本指南适合您。

例如，您在家中运行自定义邮件服务器，并且您的 Internet 服务提供商（“ISP”）已阻止出站端口 25。

由于您无法在端口 25 上进行出站流量，因此由于此阻止，您很可能也不会在端口 25 上进行入站流量。

假设您正在使用我们的服务转发电子邮件，[您可以通过此处的常见问题解答解决此问题](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)。

## 如何解决 ISP 阻止端口 25 上的出站 SMTP {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

如果您的 ISP 阻止了出站端口 25，那么您将必须寻找替代解决方案或联系他们。

## 我如何检查我的 ISP 是否阻止了端口 {#how-can-i-check-if-my-isp-blocks-ports}

您可以从命令行或终端运行`telnet smtp.forwardemail.net 25`来查看您的出站端口 25 连接是否被阻止。