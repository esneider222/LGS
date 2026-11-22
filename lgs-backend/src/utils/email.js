const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.resend.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false', // true por defecto
  auth: {
    user: process.env.SMTP_USER || 'resend',
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, html, text }) {
  if (!process.env.SMTP_PASS) {
    console.warn('[email] SMTP_PASS no configurado. No se envió el correo.');
    return { skipped: true };
  }

  const from = process.env.EMAIL_FROM || 'LGS <noreply@tu-dominio.com>';

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ''),
  });

  return info;
}

module.exports = { sendEmail };
