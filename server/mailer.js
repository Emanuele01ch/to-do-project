import nodemailer from 'nodemailer';

let transporterPromise;

async function createTransporter() {
  // Real provider: used when SMTP_HOST is set in .env
  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Development: Ethereal creates a throwaway test account
  const account = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });
}

function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = createTransporter();
  }
  return transporterPromise;
}

export async function sendVerificationEmail(to, link) {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || '"To-Do App" <no-reply@todo-app.local>',
    to,
    subject: 'Verify your email',
    text: `Welcome! Open this link to verify your email (valid for 24 hours):\n\n${link}`,
    html: `<p>Welcome!</p><p><a href="${link}">Verify my email</a></p><p>This link is valid for 24 hours.</p>`,
  });

  // Only exists when using Ethereal
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`Email preview: ${previewUrl}`);
  }
}