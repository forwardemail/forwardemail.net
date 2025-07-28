# Self-Hosted Releases {#self-hosted-releases}

סעיף זה מתעד את זרימת העבודה של CI/CD עבור הפתרון המתארח בעצמו של ForwardEmail, ומסביר כיצד נבנות, מפורסמות ופורסים תמונות Docker.

## Table of Contents {#table-of-contents}

* [סקירה כללית](#overview)
* [זרימת עבודה של CI/CD](#cicd-workflow)
  * [זרימת עבודה של פעולות GitHub](#github-actions-workflow)
  * [מבנה תמונה של Docker](#docker-image-structure)
* [תהליך פריסה](#deployment-process)
  * [הַתקָנָה](#installation)
  * [תצורת Docker Compose](#docker-compose-configuration)
* [תכונות תחזוקה](#maintenance-features)
  * [עדכונים אוטומטיים](#automatic-updates)
  * [גיבוי ושחזור](#backup-and-restore)
  * [חידוש תעודה](#certificate-renewal)
* [גירסאות](#versioning)
* [גישה לתמונות](#accessing-images)
* [תורם](#contributing)

## Overview {#overview}

הפתרון המתארח בעצמו של ForwardEmail משתמש ב-GitHub Actions כדי לבנות ולפרסם תמונות Docker באופן אוטומטי בכל פעם שנוצרת מהדורה חדשה. תמונות אלה זמינות לאחר מכן למשתמשים לפריסה בשרתים שלהם באמצעות סקריפט ההתקנה שסופק.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

תהליך הבנייה והפרסום של תמונת Docker המתארחת בעצמה מוגדר ב-`.github/workflows/docker-image-build-publish.yml`. תהליך עבודה זה:

1. **טריגרים**: פועל אוטומטית כאשר מתפרסמת גרסת GitHub חדשה
2. **סביבה**: פועל על אובונטו עם Node.js 18.20.4
3. **תהליך בנייה**:
* בודק את קוד המאגר
* מגדיר את Docker Buildx עבור בניות מרובות פלטפורמות
* מתחבר לרישום המכולות של GitHub (GHCR)
* מעדכן את הסכימה לפריסה עצמאית
* בונה את תמונת Docker באמצעות `self-hosting/Dockerfile-selfhosted`
* מתייג את התמונה הן עם גרסת הגרסה והן עם `latest`
* דוחף את התמונות לרישום המכולות של GitHub

```yaml
# Key workflow steps
name: Build and Publish Self-Hosted Docker Image

on:
  release:
    types: [published]  # Trigger on new releases

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      # Setup steps...

      # Build and publish Docker image
      - name: Build / Publish Docker image to GitHub Container Registry
        run: |
          IMAGE_NAME=ghcr.io/${{ github.repository }}-selfhosted:${{ github.ref_name }}
          docker build -f self-hosting/Dockerfile-selfhosted -t $IMAGE_NAME .
          docker tag $IMAGE_NAME ghcr.io/${{ github.repository }}-selfhosted:latest
          docker push $IMAGE_NAME
          docker push ghcr.io/${{ github.repository }}-selfhosted:latest
```

### מבנה תמונת Docker {#docker-image-structure}

תמונת ה-Docker נבנית באמצעות גישה רב-שלבית המוגדרת ב-`self-hosting/Dockerfile-selfhosted`:

1. **שלב בונה**:
* משתמש ב-Node.js 20 כתמונת הבסיס
* מגדיר את משתנה הסביבה `SELF_HOSTED=true`
* מתקין תלויות עם pnpm
* בונה את האפליקציה במצב ייצור

2. **שלב סופי**:
* שימוש בתמונת Node.js 20 דקה יותר
* התקנת תלויות המערכת הדרושות בלבד
* יצירת ספריות נדרשות לאחסון נתונים
* העתקת האפליקציה שנבנתה משלב הבונה

גישה זו מבטיחה שהתמונה הסופית מותאמת לגודל ואבטחה.

## תהליך פריסה {#deployment-process}

### התקנה {#installation}

משתמשים יכולים לפרוס את הפתרון המתארח בעצמו באמצעות סקריפט ההתקנה שסופק:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

התסריט הזה:

1. משכפל את המאגר
2. מגדיר את הסביבה
3. מגדיר הגדרות DNS וחומת אש
4. יוצר אישורי SSL
5. שולף את תמונות Docker העדכניות ביותר
6. מפעיל את השירותים באמצעות Docker Compose

### תצורת Docker Compose {#docker-compose-configuration}

הקובץ `docker-compose-self-hosted.yml` מגדיר את כל השירותים הנדרשים עבור הפתרון המתארח בעצמו:

* **Web**: ממשק אינטרנט ראשי
* **API**: שרת API לגישה תכנותית
* **SMTP**: שירות שליחת דוא"ל
* **IMAP/POP3**: שירותי אחזור דוא"ל
* **MX**: שירות חילופי דואר
* **CalDAV**: שירות לוח שנה
* **CardDAV**: שירות אנשי קשר
* **MongoDB**: מסד נתונים לאחסון נתוני משתמש
* **Redis**: מאגר נתונים בזיכרון
* **SQLite**: מסד נתונים לאחסון דוא"ל

כל שירות משתמש באותה תמונת Docker אך עם נקודות כניסה שונות, מה שמאפשר ארכיטקטורה מודולרית תוך פישוט התחזוקה.

## תכונות תחזוקה {#maintenance-features}

הפתרון המתארח בעצמו כולל מספר תכונות תחזוקה:

### עדכונים אוטומטיים {#automatic-updates}

משתמשים יכולים להפעיל עדכונים אוטומטיים שיעשו:

* משיכת תמונת Docker העדכנית ביותר מדי לילה
* הפעלת שירותים מחדש עם התמונה המעודכנת
* רישום תהליך העדכון

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### גיבוי ושחזור {#backup-and-restore}

ההגדרה מספקת אפשרויות עבור:

* הגדרת גיבויים קבועים לאחסון תואם S3
* גיבוי נתוני MongoDB, Redis ו-SQLite
* שחזור מגיבויים במקרה של תקלה

### חידוש תעודה {#certificate-renewal}

תעודות SSL מנוהלות אוטומטית עם אפשרויות:

* יצירת אישורים חדשים במהלך ההתקנה
* חידוש אישורים בעת הצורך
* הגדרת DKIM לאימות דוא"ל

## ניהול גרסאות {#versioning}

כל מהדורת GitHub יוצרת תמונת Docker חדשה המתויגת עם:

1. גרסת הגרסה הספציפית (לדוגמה, `v1.0.0`)
2. התג `latest` עבור הגרסה האחרונה

משתמשים יכולים לבחור להשתמש בגרסה ספציפית לצורך יציבות או בתג `latest` כדי לקבל תמיד את התכונות החדשות ביותר.

## גישה לתמונות {#accessing-images}

תמונות Docker זמינות לציבור בכתובת:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (דוגמה לתג גרסה)

אין צורך באימות כדי למשוך את התמונות הללו.

## תורם {#contributing}

כדי לתרום לפתרון המארח בעצמך:

1. בצע שינויים בקבצים הרלוונטיים בספריית `self-hosting`
2. בדוק באופן מקומי או על VPS מבוסס אובונטו באמצעות הסקריפט `setup.sh` שסופק
3. שלח בקשת משיכה
4. לאחר המיזוג ויצירת גרסה חדשה, זרימת העבודה של CI תבנה ותפרסם באופן אוטומטי את תמונת ה-Docker המעודכנת