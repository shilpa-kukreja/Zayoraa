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

const resolveMailFrom = (from) =>
  from || process.env.EMAIL_FROM || process.env.EMAIL_USER || null;

const sendViaResend = async ({ from, to, subject, html }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resolveMailFrom(from),
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
  const mailFrom = resolveMailFrom(from);
  if (!mailFrom) {
    console.warn("EMAIL_FROM / EMAIL_USER is not set; skipping email to", to);
    return;
  }
  if (!to) {
    console.warn("No recipient email; skipping order notification");
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



// for abandoned cart email notification 
export const sendAbandonedCartEmail = (toEmail, restoreLink, items) => {
  const itemsHtml = items
    .map((item) => {
      const productUrl = `${process.env.FRONTEND_URL}/frontend/ProductDetail/${item.slug}`;
      return `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eee;">
            <img src="${item.image}" alt="${item.name}" width="80" height="80" style="border-radius:4px;object-fit:cover;" />
          </td>
          <td style="padding:12px;border-bottom:1px solid #eee;vertical-align:top;">
            <a href="${productUrl}" style="color:#333;text-decoration:none;font-weight:600;">
              ${item.name}
            </a>
            <br />
            <span style="font-size:13px;color:#888;">Qty: ${item.quantity}</span>
            ${item.variant?.color ? `<br /><span style="font-size:13px;color:#888;">Color: ${item.variant.color}</span>` : ""}
          </td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;vertical-align:top;">
            <span style="font-size:16px;font-weight:600;">₹${(item.priceSnapshot * item.quantity).toFixed(2)}</span>
            ${item.originalPrice && item.originalPrice > item.priceSnapshot
              ? `<br /><span style="font-size:13px;color:#999;text-decoration:line-through;">₹${(item.originalPrice * item.quantity).toFixed(2)}</span>`
              : ""}
          </td>
        </tr>`;
    })
    .join("");

  const total = items.reduce((sum, i) => sum + i.priceSnapshot * i.quantity, 0);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
      <div style="background:#000;padding:20px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">Don’t forget your cart! 🛒</h1>
      </div>
      <div style="padding:20px;">
        <p style="font-size:16px;color:#333;">We saved these items for you:</p>
        <table style="width:100%;border-collapse:collapse;">
          ${itemsHtml}
          <tr>
            <td colspan="3" style="padding:16px 12px;text-align:right;border-top:2px solid #000;">
              <strong style="font-size:18px;">Total: ₹${total.toFixed(2)}</strong>
            </td>
          </tr>
        </table>
        <div style="text-align:center;margin:30px 0;">
          <a href="${restoreLink}"
             style="background:#000;color:#fff;padding:14px 40px;text-decoration:none;border-radius:6px;font-size:16px;display:inline-block;">
            Restore My Cart
          </a>
        </div>
        <p style="font-size:13px;color:#888;text-align:center;">
          This link expires in 24 hours. If you have any questions, contact our support team.
        </p>
      </div>
    </div>
  `;

  // Use your existing sendEmailInBackground
  sendEmailInBackground({
    to: toEmail,
    subject: "You left items in your cart 🛒",
    html,
  });
};




// ============================
// Review / Repeat Purchase Email (sent 7 days after delivery)
// ============================
export const sendReviewEmail = (order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background: #10b981; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">We’d Love Your Feedback! ⭐</h1>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px; color: #333;">Hi ${order.address.fullName},</p>
        <p>We hope you're enjoying your recent purchase from <strong>Zayoraa</strong>! It’s been 7 days since your order was delivered.</p>
        <p>Your opinion matters to us and to other customers. Please take a moment to leave a review for the products you bought.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/review/${order.orderid}"
             style="background: #10b981; color: #fff; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;">
            Leave a Review
          </a>
        </div>

        <p style="font-size: 13px; color: #888; text-align: center; margin-top: 30px;">
          Thank you for choosing Zayoraa. If you have any questions, reply to this email.
        </p>
      </div>
    </div>
  `;

  sendEmailInBackground({
    to: order.address.email,
    subject: `How's your new purchase? We'd love your feedback!`,
    html,
  });
};