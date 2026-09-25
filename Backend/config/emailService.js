import nodemailer from "nodemailer";

/**
 * Creates a fresh transporter using environment variables.
 * Called lazily so we are guaranteed dotenv has already loaded the credentials.
 */
const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });

/**
 * Send OTP verification email with a clean, professional, enterprise-grade template
 */
export const sendOTPEmail = async (toEmail, otp, fullName = "there") => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS environment variable is missing.");
  }

  const mailOptions = {
    from: `"Ping." <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${otp} — Your Ping verification code`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your Ping account</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 0;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#111827;letter-spacing:-0.5px;">
                Ping<span style="color:#7c3aed;">.</span>
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:24px 32px 32px;">
              <h2 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#111827;">Verify your email address</h2>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4b5563;">
                Hi ${fullName},<br/><br/>
                Welcome to Ping! To complete your registration, please use the verification code below. This code will expire in 10 minutes.
              </p>
              
              <!-- OTP Box -->
              <div style="background:#f3f4f6;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;border:1px solid #e5e7eb;">
                <span style="font-family:'Courier New',monospace;font-size:32px;font-weight:700;color:#111827;letter-spacing:6px;">${otp}</span>
              </div>
              
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">
                <strong>Security Tip:</strong> Never share this code with anyone. Ping will never ask you for your password or OTP.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 32px;">
              <p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#9ca3af;">
                If you didn't attempt to create a Ping account, you can safely ignore this email.
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; ${new Date().getFullYear()} Ping App. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  await createTransporter().sendMail(mailOptions);
};
