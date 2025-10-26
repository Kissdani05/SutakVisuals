import nodemailer from "nodemailer";

type Payload = {
  name?: string;
  email?: string;
  instagram?: string;
  subject?: string;
  message?: string;
  _hp?: string; // honeypot
};

// Simple in-memory rate limiter (production: use Redis/DB)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3; // max 3 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Túl sok kérés. Kérlek próbáld újra később." }),
        { status: 429 }
      );
    }

    const data = (await req.json()) as Payload;
    const { name, email, instagram, subject, message, _hp } = data || {};

    // Simple honeypot
    if (_hp) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // Enhanced validation
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "Minden mező kötelező." }), { status: 400 });
    }

    // Length validation
    if (name.length > 100 || email.length > 100 || subject.length > 200 || message.length > 2000) {
      return new Response(JSON.stringify({ error: "Valamelyik mező túl hosszú." }), { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Érvénytelen email formátum." }), { status: 400 });
    }

    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const MAIL_TO = process.env.MAIL_TO || SMTP_USER;
    const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER || "no-reply@sutakvisuals.local";

    const missingSmtp = !SMTP_HOST || !SMTP_USER || !SMTP_PASS;
    const isDev = process.env.NODE_ENV !== "production";

    if (missingSmtp && !isDev) {
      return new Response(
        JSON.stringify({ error: "Email küldés nincs konfigurálva a szerveren (SMTP env hiányzik)." }),
        { status: 500 }
      );
    }

    const transporter = missingSmtp && isDev
      ? nodemailer.createTransport({ jsonTransport: true }) // dev fallback: does not send, but succeeds
      : nodemailer.createTransport({
          host: SMTP_HOST as string,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465, // true for 465, false for other ports
          auth: { user: SMTP_USER as string, pass: SMTP_PASS as string },
        });

    const html = `
      <h2>Új üzenet érkezett a weboldalról</h2>
      <p><strong>Név:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${instagram ? `<p><strong>Instagram:</strong> ${escapeHtml(instagram)}</p>` : ""}
      <p><strong>Autó márka / típus:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Üzenet:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `;

    const info = await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: `Üzenet a weboldalról: ${subject}`,
      text: `Név: ${name}\nEmail: ${email}${instagram ? `\nInstagram: ${instagram}` : ""}\nAutó márka / típus: ${subject}\n\nÜzenet:\n${message}`,
      html,
    });

    // In dev fallback, include a hint that no real email was sent
    if (missingSmtp && isDev) {
      return new Response(
        JSON.stringify({ ok: true, dev: true, note: "Fejlesztői mód: SMTP nincs konfigurálva, e-mail NEM lett elküldve.", messageId: (info as any)?.messageId }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("/api/contact error", err);
    const msg = err instanceof Error ? err.message : "Ismeretlen hiba";
    return new Response(JSON.stringify({ error: `Nem sikerült elküldeni az üzenetet: ${msg}` }), { status: 500 });
  }
}

function escapeHtml(str?: string) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
