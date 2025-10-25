import nodemailer from "nodemailer";

type Payload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  _hp?: string; // honeypot
};

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Payload;
    const { name, email, subject, message, _hp } = data || {};

    // Simple honeypot
    if (_hp) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "Minden mező kötelező." }), { status: 400 });
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
      <p><strong>Autó márka / típus:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Üzenet:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `;

    const info = await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: `Üzenet a weboldalról: ${subject}`,
      text: `Név: ${name}\nEmail: ${email}\nAutó márka / típus: ${subject}\n\nÜzenet:\n${message}`,
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
