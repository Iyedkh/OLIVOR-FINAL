import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const emailPort = process.env.EMAIL_PORT || 587;
  const emailService = process.env.EMAIL_SERVICE; // optional, e.g. 'gmail'

  // Beautiful console logging for debugging/development
  console.log('\n' + '='.repeat(60));
  console.log(`✉️  EMAIL DISPATCHED TO: ${options.to}`);
  console.log(`📌 SUBJECT: ${options.subject}`);
  console.log(`📝 CONTENT:\n${options.text}`);
  console.log('='.repeat(60) + '\n');

  if (emailUser && emailPass) {
    try {
      const transporterOpts = emailService 
        ? {
            service: emailService,
            auth: {
              user: emailUser,
              pass: emailPass,
            },
          }
        : {
            host: emailHost,
            port: Number(emailPort),
            secure: Number(emailPort) === 465, // true for 465, false for other ports
            auth: {
              user: emailUser,
              pass: emailPass,
            },
          };

      const transporter = nodemailer.createTransport(transporterOpts);

      const mailOptions = {
        from: `"OLIV'OR" <${emailUser}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html || `<div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1e3a1e;">OLIV'OR Luxury</h2>
          <p style="white-space: pre-line; line-height: 1.6; color: #333;">${options.text}</p>
        </div>`,
      };

      await transporter.sendMail(mailOptions);
      console.log('✨ Real email delivered successfully.');
    } catch (err) {
      console.error('❌ Failed to send real email through SMTP:', err.message);
    }
  } else {
    console.log('⚠️  SMTP credentials not set in backend/.env. Real email not sent. Copy links from console printout above.');
  }
};

export default sendEmail;
