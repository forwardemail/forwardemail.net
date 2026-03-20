# פורט 25 חסום על ידי ספק האינטרנט - פתרון {#port-25-blocked-by-isp-workaround}


## תוכן העניינים {#table-of-contents}

* [כיצד לעקוף חסימת SMTP נכנס בפורט 25 על ידי ספק האינטרנט](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [כיצד לעקוף חסימת SMTP יוצא בפורט 25 על ידי ספק האינטרנט](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [כיצד לבדוק אם ספק האינטרנט שלי חוסם פורטים](#how-can-i-check-if-my-isp-blocks-ports)


## כיצד לעקוף חסימת SMTP נכנס בפורט 25 על ידי ספק האינטרנט {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

אם פורט 25 אינו פתוח בכתובת ה-IP של שרת הדואר שלך, המדריך הזה מיועד לך.

לדוגמה, אתה מפעיל שרת דואר מותאם אישית בבית, וספק שירות האינטרנט שלך ("ISP") חסם את פורט 25 היוצא.

מכיוון שאינך יכול לקבל תעבורה יוצאת בפורט 25, סביר להניח שגם לא תהיה תעבורה נכנסת בפורט 25 בגלל החסימה הזו.

בהנחה שאתה משתמש בשירות שלנו להעברת מיילים, [אתה יכול לעקוף את הבעיה הזו דרך התשובה ב-FAQ שלנו כאן](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## כיצד לעקוף חסימת SMTP יוצא בפורט 25 על ידי ספק האינטרנט {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

אם ספק האינטרנט שלך חוסם את פורט 25 היוצא, תצטרך למצוא פתרון חלופי או ליצור איתם קשר.


## כיצד לבדוק אם ספק האינטרנט שלי חוסם פורטים {#how-can-i-check-if-my-isp-blocks-ports}

אתה יכול להריץ `telnet smtp.forwardemail.net 25` משורת הפקודה או מהטרמינל כדי לבדוק אם החיבור היוצא בפורט 25 חסום.
