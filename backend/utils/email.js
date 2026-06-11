import nodemailer from 'nodemailer';

let testAccount = null;

const getTransporter = async () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: parseInt(port) === 465,
      auth: { user, pass }
    });
  }

  // Fallback to Ethereal test account
  if (!testAccount) {
    console.log('✉️ No SMTP credentials configured. Creating transient Ethereal Mail test account...');
    testAccount = await nodemailer.createTestAccount();
    console.log('✅ Temporary Ethereal Mail Account Created:');
    console.log(`   User: ${testAccount.user}`);
    console.log(`   Pass: ${testAccount.pass}`);
  }

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await getTransporter();
    const from = process.env.SMTP_FROM || (testAccount ? `ShopEZ <${testAccount.user}>` : 'ShopEZ <noreply@shopez.com>');
    
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    console.log(`\n📧 Email sent successfully to: ${to}`);
    console.log(`   Message ID: ${info.messageId}`);
    
    // If using Ethereal, log a link to see the sent email in browser
    if (!process.env.SMTP_USER && !process.env.SMTP_PASS) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`🔗 [Ethereal Preview URL]: ${previewUrl}`);
      console.log(`-----------------------------------------------\n`);
      return { success: true, previewUrl };
    }
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending email via SMTP:', error);
    throw error;
  }
};
