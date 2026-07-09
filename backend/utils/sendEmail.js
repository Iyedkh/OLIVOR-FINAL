import nodemailer from "nodemailer";

// Dynamic Luxury HTML Email Template Generator
const generateLuxuryEmailTemplate = (subject, text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);
  const actionUrl = urls ? urls[0] : null;

  // Clean the text by removing the URL block to prevent duplicates
  let cleanText = text;
  if (actionUrl) {
    cleanText = text.replace(actionUrl, '').replace(/\n\n+/g, '\n\n').trim();
  }

  // Set action button labels
  let btnLabel = 'Explore Collection';
  if (subject.toLowerCase().includes('password')) {
    btnLabel = 'Reset Password';
  } else if (subject.toLowerCase().includes('verify')) {
    btnLabel = 'Verify Account';
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@300;400;500&display=swap');
    body {
      background-color: #fbf9f3;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      background-color: #fbf9f3;
      padding: 40px 20px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #eae8e2;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(62, 82, 25, 0.05);
    }
    .header {
      background-color: #1e3d2f;
      padding: 40px 20px;
      text-align: center;
    }
    .header-logo {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 26px;
      font-weight: 500;
      color: #d4af37;
      letter-spacing: 0.1em;
      margin: 0;
      text-transform: uppercase;
    }
    .header-sub {
      font-size: 9px;
      font-weight: 600;
      color: #ffffff;
      opacity: 0.6;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .title {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 20px;
      font-weight: 600;
      color: #1e3d2f;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .body-text {
      font-size: 14px;
      line-height: 1.6;
      color: #45483c;
      margin-bottom: 30px;
      white-space: pre-line;
      text-align: center;
    }
    .btn-container {
      margin: 30px 0;
    }
    .btn {
      display: inline-block;
      padding: 14px 36px;
      background: linear-gradient(135deg, #d4af37 0%, #1e3d2f 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border-radius: 50px;
      box-shadow: 0 4px 12px rgba(30, 61, 47, 0.2);
    }
    .footer {
      background-color: #f7f5ef;
      border-top: 1px solid #eae8e2;
      padding: 30px 20px;
      text-align: center;
    }
    .footer-text {
      font-size: 10px;
      color: #75796b;
      line-height: 1.5;
      margin: 4px 0;
    }
    .footer-divider {
      width: 40px;
      height: 1px;
      background-color: #d4af37;
      margin: 15px auto;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="header-logo">OLIV'OR</h1>
        <div class="header-sub">Tunisian Reserve</div>
      </div>
      <div class="content">
        <h2 class="title">${subject}</h2>
        <p class="body-text">${cleanText}</p>
        
        ${actionUrl ? `
        <div class="btn-container">
          <a href="${actionUrl}" class="btn" target="_blank">${btnLabel}</a>
        </div>
        <p style="font-size: 10px; color: #75796b; margin-top: 25px; word-break: break-all;">
          If the button above does not work, copy and paste this URL into your browser: <br>
          <a href="${actionUrl}" style="color: #1e3d2f; text-decoration: underline;">${actionUrl}</a>
        </p>
        ` : ''}
      </div>
      <div class="footer">
        <p class="footer-text"><strong>OLIV'OR Reserve Collection</strong></p>
        <p class="footer-text">Pure Single-Estate Olive Oil &bull; Hand-Harvested in Sahel, Tunisia</p>
        <div class="footer-divider"></div>
        <p class="footer-text" style="font-size: 9px; opacity: 0.7;">This is an automated message. Please do not reply directly to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

const sendEmail = async (options) => {
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  // Auto-detect Brevo host if Brevo user is supplied
  let defaultHost = "smtp.gmail.com";
  if (emailUser && emailUser.includes("brevo.com")) {
    defaultHost = "smtp-relay.brevo.com";
  }

  const emailHost =
    process.env.SMTP_HOST || process.env.EMAIL_HOST || defaultHost;
  const emailPort = process.env.SMTP_PORT || process.env.EMAIL_PORT || 587;
  const emailService = process.env.EMAIL_SERVICE; // optional
  const emailFrom =
    process.env.SMTP_FROM || process.env.EMAIL_FROM || emailUser;

  // Beautiful console logging for debugging/development
  console.log("\n" + "=".repeat(60));
  console.log(`✉️  EMAIL DISPATCHED TO: ${options.to}`);
  console.log(`📌 SUBJECT: ${options.subject}`);
  console.log(`📝 CONTENT:\n${options.text}`);
  console.log("=".repeat(60) + "\n");

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
        from: `"OLIV'OR" <${emailFrom}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html || generateLuxuryEmailTemplate(options.subject, options.text),
      };

      await transporter.sendMail(mailOptions);
      console.log("✨ Real email delivered successfully.");
    } catch (err) {
      console.error("❌ Failed to send real email through SMTP:", err.message);
    }
  } else {
    console.log(
      "⚠️  SMTP credentials not set in backend/.env. Real email not sent. Copy links from console printout above.",
    );
  }
};

export default sendEmail;
