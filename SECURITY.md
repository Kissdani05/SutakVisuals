# Biztonsági beállítások – SutakVisuals

## Implementált biztonsági intézkedések

### 1. HTTP Security Headers (next.config.ts)
- **Strict-Transport-Security (HSTS)**: HTTPS kikényszerítés, preload
- **X-Frame-Options**: Clickjacking védelem (SAMEORIGIN)
- **X-Content-Type-Options**: MIME sniffing védelem
- **X-XSS-Protection**: Beépített XSS védelem
- **Referrer-Policy**: Referrer információ korlátozás
- **Permissions-Policy**: Kamera/mikrofon/geolocation letiltás
- **Content-Security-Policy (CSP)**: Script/style/image/font források korlátozása

### 2. API Rate Limiting (src/app/api/contact/route.ts)
- IP alapú rate limit: max 3 kérés/perc
- 429 státusz kód túl sok kérés esetén
- Memória alapú throttling (production: Redis ajánlott)

### 3. Input validáció és sanitizáció
#### Backend (API route):
- Kötelező mezők ellenőrzés
- Hossz limitek: név/email 100, subject 200, message 2000 karakter
- Email formátum validáció regex-szel
- HTML escape minden kimeneti tartalomhoz (XSS védelem)

#### Frontend (Contact.tsx):
- Client-side validáció (dupla védelem)
- Trimmelés és hossz ellenőrzés
- Email formátum ellenőrzés
- Felhasználóbarát hibakezelés

### 4. CSRF és Spam védelem
- Honeypot mező (_hp) bot detektálásra
- Rate limiting backend-en
- Origin ellenőrzés implicit Next.js által

### 5. Secure defaults
- HTTPS kikényszerítés productionben (HSTS header)
- Nodemailer secure SMTP (port 465)
- Környezeti változók secrets kezelésére (.env.local)

## Vercel deployment checklist
1. **Environment Variables**:
   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
   - NEXT_PUBLIC_SITE_URL (canonical URL-hez)
   
2. **HTTPS**: Vercel automatikusan biztosítja SSL-t minden domainen.

3. **Custom Domain**: A HSTS preload csak saját domain-en működik teljes erővel.

4. **Rate limiting**: Production környezetben Redis/Upstash ajánlott a memória alapú megoldás helyett.

## Tesztelés
- Biztonsági headerek ellenőrzése: `curl -I https://sutakvisuals.hu`
- CSP teszt: browser DevTools Console
- Rate limit: 3+ gyors form submit
- XSS teszt: `<script>alert('xss')</script>` a mezőkbe

## További javaslatok (opcionális)
- reCAPTCHA vagy hCaptcha a form elé
- CORS strict konfigurálás külső API-khoz
- Security.txt fájl (/.well-known/security.txt)
- Helmet.js vagy hasonló middleware (Next.js-ben a headers elég)
