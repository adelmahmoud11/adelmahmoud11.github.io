# IndexNow

Key file: `/4e854a55c95608f12f406477166decf9.txt` — its content is the same 32-character key. Host verified: `adelmah.com`.

## Send after every content update (curl)

```bash
curl -s -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"host": "adelmah.com", "key": "4e854a55c95608f12f406477166decf9", "urlList": ["https://adelmah.com/", "https://adelmah.com/blog/", "https://adelmah.com/blog/digital-marketing-saudi-guide.html", "https://adelmah.com/blog/digital-marketing-plan-saudi.html", "https://adelmah.com/blog/seo-guide-arabic.html", "https://adelmah.com/blog/google-ads-vs-meta-ads.html", "https://adelmah.com/blog/ecommerce-marketing-mistakes.html", "https://adelmah.com/blog/conversion-rate-guide.html", "https://adelmah.com/blog/snapchat-ads-saudi.html", "https://adelmah.com/blog/google-analytics-4-basics.html", "https://adelmah.com/blog/local-seo-saudi.html", "https://adelmah.com/blog/content-marketing-ecommerce.html"]}'
```

Yandex mirror (works once Bing/Yandex knows the site):

```bash
curl -s -X POST "https://yandex.com/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"host": "adelmah.com", "key": "4e854a55c95608f12f406477166decf9", "urlList": ["https://adelmah.com/", "https://adelmah.com/blog/", "https://adelmah.com/blog/digital-marketing-saudi-guide.html", "https://adelmah.com/blog/digital-marketing-plan-saudi.html", "https://adelmah.com/blog/seo-guide-arabic.html", "https://adelmah.com/blog/google-ads-vs-meta-ads.html", "https://adelmah.com/blog/ecommerce-marketing-mistakes.html", "https://adelmah.com/blog/conversion-rate-guide.html", "https://adelmah.com/blog/snapchat-ads-saudi.html", "https://adelmah.com/blog/google-analytics-4-basics.html", "https://adelmah.com/blog/local-seo-saudi.html", "https://adelmah.com/blog/content-marketing-ecommerce.html"]}'
```

## PowerShell version

```powershell
$payload = '{"host": "adelmah.com", "key": "4e854a55c95608f12f406477166decf9", "urlList": ["https://adelmah.com/", "https://adelmah.com/blog/", "https://adelmah.com/blog/digital-marketing-saudi-guide.html", "https://adelmah.com/blog/digital-marketing-plan-saudi.html", "https://adelmah.com/blog/seo-guide-arabic.html", "https://adelmah.com/blog/google-ads-vs-meta-ads.html", "https://adelmah.com/blog/ecommerce-marketing-mistakes.html", "https://adelmah.com/blog/conversion-rate-guide.html", "https://adelmah.com/blog/snapchat-ads-saudi.html", "https://adelmah.com/blog/google-analytics-4-basics.html", "https://adelmah.com/blog/local-seo-saudi.html", "https://adelmah.com/blog/content-marketing-ecommerce.html"]}'
Invoke-RestMethod -Method Post -Uri "https://api.indexnow.org/indexnow" `
  -ContentType "application/json; charset=utf-8" -Body $payload
```

Expected answer: `200 OK` (received) or `202` (accepted). A `400` almost always means the key file is not reachable at `https://adelmah.com/4e854a55c95608f12f406477166decf9.txt`.
