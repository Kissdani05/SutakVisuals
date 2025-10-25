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

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return new Response(JSON.stringify({ error: "Email küldés nincs konfigurálva (SMTP env hiányzik)." }), { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const html = `
      <h2>Új üzenet érkezett a weboldalról</h2>
      <p><strong>Név:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Autó márka / típus:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Üzenet:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `;

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: `Üzenet a weboldalról: ${subject}`,
      text: `Név: ${name}\nEmail: ${email}\nAutó márka / típus: ${subject}\n\nÜzenet:\n${message}`,
      html,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("/api/contact error", err);
    return new Response(JSON.stringify({ error: "Nem sikerült elküldeni az üzenetet." }), { status: 500 });
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
