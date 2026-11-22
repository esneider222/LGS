const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.resend.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER || 'resend',
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, html, text }) {
  if (!process.env.SMTP_PASS) {
    console.warn('[email] SMTP_PASS no configurado. Correo no enviado.');
    return { skipped: true };
  }

  const from = process.env.EMAIL_FROM || 'LGS <noreply@tu-dominio.com>';

  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ''),
  });
}

module.exports = { sendEmail };
