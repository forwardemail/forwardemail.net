# ポート25はISPの回避策によってブロックされています {#port-25-blocked-by-isp-workaround}

## 目次 {#table-of-contents}

* [ISPがポート25の受信SMTPをブロックするのを回避する方法](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [ISPがポート25の送信SMTPをブロックするのを回避する方法](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [ISPがポートをブロックしているかどうかを確認するにはどうすればいいですか？](#how-can-i-check-if-my-isp-blocks-ports)

## ISPがポート25の受信SMTPをブロックするのを回避する方法 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

メール サーバーの IP アドレスでポート 25 が開いていない場合は、このガイドが役立ちます。

たとえば、自宅でカスタム メール サーバーを実行しており、インターネット サービス プロバイダー (ISP) が送信ポート 25 をブロックしているとします。

ポート 25 では送信トラフィックが不可能なので、このブロックによりポート 25 では受信トラフィックも不可能になる可能性が高くなります。

メールを転送するために弊社のサービスをご利用の場合、[この問題を回避するには、こちらのFAQをご覧ください。](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)。

## ISPがポート25の送信SMTPをブロックするのを回避する方法 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

ISP が送信ポート 25 をブロックしている場合は、別の解決策を見つけるか、ISP に連絡する必要があります。

## ISPがポート {#how-can-i-check-if-my-isp-blocks-ports} をブロックしているかどうかを確認するにはどうすればよいですか？

コマンドラインまたはターミナルから `telnet smtp.forwardemail.net 25` を実行して、送信ポート 25 接続がブロックされているかどうかを確認できます。