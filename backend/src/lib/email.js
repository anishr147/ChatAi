import nodemailer from 'nodemailer';

import 'dotenv/config'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (email, name) => {
  try {
   const mailOptions = {
  from: `"ChatAi" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Welcome to ChatAi 🚀",
  text: `Hi ${name}, welcome to ChatAi! Visit ${process.env.CLIENT_URL} to get started.`,
  html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to ChatAi</title>
  </head>

  <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;">

    <div style="display:none;max-height:0;overflow:hidden;">
      Welcome to ChatAi — smarter conversations start here.
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">

          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:16px;overflow:hidden;
            box-shadow:0 4px 20px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td align="center"
                style="padding:40px;
                background:linear-gradient(135deg,#4F46E5,#7C3AED);
                color:white;">

                <h1 style="margin:0;font-size:32px;">
                  ChatAi
                </h1>

                <p style="margin-top:10px;font-size:16px;opacity:0.9;">
                  Smarter conversations. Better connections.
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px;color:#333;">

                <h2 style="margin-top:0;">
                  Welcome, ${name} 👋
                </h2>

                <p style="font-size:16px;line-height:1.7;">
                  We're excited to have you join ChatAi.
                  Start messaging instantly, connect in realtime,
                  and experience seamless communication.
                </p>

                <div style="text-align:center;margin:40px 0;">

                  <a href="${process.env.CLIENT_URL}"
                    style="
                      background:#4F46E5;
                      color:white;
                      text-decoration:none;
                      padding:14px 28px;
                      border-radius:10px;
                      font-weight:bold;
                      display:inline-block;
                    ">
                    Open ChatAi
                  </a>

                </div>

                <p style="font-size:15px;line-height:1.7;color:#555;">
                  If you have questions, simply reply to this email.
                  We're always happy to help.
                </p>

                <p style="margin-top:30px;">
                  — The ChatAi Team
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                style="padding:24px;
                background:#f8fafc;
                color:#888;
                font-size:12px;">

                © ${new Date().getFullYear()} ChatAi. All rights reserved.

                <p style="margin-top:10px;">
                  If you did not create this account,
                  you can safely ignore this email.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `
};
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.response);
    return true;   // 
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;  // 
  }
};

export default sendWelcomeEmail;
