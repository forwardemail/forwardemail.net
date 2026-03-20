# ISPによるポート25ブロックの回避方法 {#port-25-blocked-by-isp-workaround}


## 目次 {#table-of-contents}

* [ISPがポート25の受信SMTPをブロックしている場合の回避方法](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [ISPがポート25の送信SMTPをブロックしている場合の回避方法](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [ISPがポートをブロックしているかどうかの確認方法](#how-can-i-check-if-my-isp-blocks-ports)


## ISPがポート25の受信SMTPをブロックしている場合の回避方法 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

メールサーバーのIPアドレスでポート25が開いていない場合は、このガイドが役立ちます。

例えば、自宅でカスタムメールサーバーを運用していて、インターネットサービスプロバイダー（「ISP」）が送信ポート25をブロックしている場合です。

送信ポート25のトラフィックが許可されていないため、このブロックにより受信ポート25のトラフィックもおそらく許可されていません。

当社のサービスを使ってメールを転送している場合は、[こちらのFAQの回答からこの問題を回避できます](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)。


## ISPがポート25の送信SMTPをブロックしている場合の回避方法 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

ISPが送信ポート25をブロックしている場合は、代替の解決策を見つけるか、ISPに連絡する必要があります。


## ISPがポートをブロックしているかどうかの確認方法 {#how-can-i-check-if-my-isp-blocks-ports}

コマンドラインやターミナルで `telnet smtp.forwardemail.net 25` を実行して、送信ポート25の接続がブロックされているか確認できます。
