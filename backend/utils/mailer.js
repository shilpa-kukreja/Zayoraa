import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });

  return transporter;
};

const sendViaResend = async ({ from, to, subject, html }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from || process.env.EMAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }
};

/**
 * Send email. Prefer RESEND_API_KEY on Render (SMTP ports are often blocked).
 */
export const sendEmail = async ({ from, to, subject, html }) => {
  const mailFrom = from || process.env.EMAIL_FROM;
  if (!mailFrom) {
    console.warn("EMAIL_FROM is not set; skipping email to", to);
    return;
  }

  if (process.env.RESEND_API_KEY) {
    await sendViaResend({ from: mailFrom, to, subject, html });
    return;
  }

  const transport = getTransporter();
  if (!transport) {
    console.warn("Email credentials not configured; skipping email to", to);
    return;
  }

  await transport.sendMail({ from: mailFrom, to, subject, html });
};

/** Fire-and-forget — does not block API responses. */
export const sendEmailInBackground = (mailOptions) => {
  sendEmail(mailOptions).catch((err) => {
    console.error("Background email failed:", err.message);
  });
};
