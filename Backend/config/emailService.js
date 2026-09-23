import nodemailer from "nodemailer";

/**
 * Creates a fresh transporter using environment variables.
 * Called lazily so we are guaranteed dotenv has already loaded the credentials.
 */
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

/**
 * Send OTP verification email with a premium branded template
 */
export const sendOTPEmail = async (toEmail, otp, fullName = "there") => {
  // Split OTP into individual digits for the digit-box design
  const digits = otp.toString().split("");

  const digitBoxes = digits
    .map(
      (d) => `
    <td style="padding:0 5px;">
      <div style="
        width:48px;
        height:60px;
        background:#1e1035;
        border:2px solid #7c3aed;
        border-radius:12px;
        display:inline-block;
        text-align:center;
        line-height:60px;
        font-size:28px;
        font-weight:800;
        color:#ffffff;
        font-family:'Courier New',monospace;
        box-shadow:0 0 18px rgba(124,58,237,0.45);
        letter-spacing:0;
      ">${d}</div>
    </td>
  `
    )
    .join("");

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
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0f;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;border-radius:20px;overflow:hidden;background:#111118;border:1px solid #1f1f2e;">

          <!-- ── GRADIENT HEADER ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b0764 0%,#6d28d9 50%,#7c3aed 100%);padding:0;">

              <!-- Logo row -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:32px 36px 20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <div style="width:46px;height:46px;background:rgba(255,255,255,0.15);border-radius:14px;border:1.5px solid rgba(255,255,255,0.25);display:inline-block;text-align:center;line-height:46px;font-size:22px;">💬</div>
                        </td>
                        <td style="vertical-align:middle;padding-left:12px;">
                          <span style="color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;line-height:1;">Ping<span style="color:#c4b5fd;">.</span></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding:20px 30px 0 0;text-align:right;vertical-align:top;">
                    <div style="display:inline-block;width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);"></div>
                  </td>
                </tr>
              </table>

              <!-- Headline -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:4px 36px 36px;">
                    <p style="margin:0 0 8px;color:rgba(196,181,253,0.85);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">Email Verification</p>
                    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;line-height:1.3;letter-spacing:-0.5px;">
                      Hey ${fullName},<br/>verify your email ✦
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="padding:36px 36px 28px;">

              <p style="margin:0 0 28px;color:#8888aa;font-size:15px;line-height:1.7;">
                Welcome to <strong style="color:#c4b5fd;">Ping</strong> — your new go-to chat app.
                Use the 6-digit code below to complete your registration.
                This code expires in <strong style="color:#e2e0f0;">10 minutes</strong>.
              </p>

              <!-- OTP digit boxes -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 32px;">
                <tr>
                  ${digitBoxes}
                </tr>
              </table>

              <!-- Gradient divider -->
              <div style="height:1px;background:linear-gradient(90deg,transparent,#2e2e45,transparent);margin-bottom:28px;"></div>

              <!-- Tips -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="40" style="vertical-align:top;padding-top:2px;">
                    <div style="width:32px;height:32px;background:#1a1a2e;border:1px solid #2e2e45;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">⏱</div>
                  </td>
                  <td style="padding-left:12px;color:#666688;font-size:13px;line-height:1.65;vertical-align:top;">
                    Code expires in <strong style="color:#a78bfa;">10 minutes</strong>. If it expires, you can request a new one from the app.
                  </td>
                </tr>
                <tr><td colspan="2" style="height:14px;"></td></tr>
                <tr>
                  <td width="40" style="vertical-align:top;padding-top:2px;">
                    <div style="width:32px;height:32px;background:#1a1a2e;border:1px solid #2e2e45;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">🔒</div>
                  </td>
                  <td style="padding-left:12px;color:#666688;font-size:13px;line-height:1.65;vertical-align:top;">
                    Never share this code with anyone. Ping will <strong style="color:#a78bfa;">never</strong> ask for your OTP.
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#0d0d14;border-top:1px solid #1a1a2e;padding:22px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;color:#555570;font-size:12px;line-height:1.6;">
                      If you didn't create a Ping account, you can safely ignore this email.
                    </p>
                    <p style="margin:0;color:#3d3d5c;font-size:11px;">
                      &copy; 2025 Ping App &mdash; All rights reserved.
                    </p>
                  </td>
                  <td style="text-align:right;vertical-align:middle;padding-left:16px;">
                    <span style="font-size:20px;font-weight:800;color:#3d3d5c;letter-spacing:-0.5px;white-space:nowrap;">Ping<span style="color:#4c1d95;">.</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- End card -->

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  };

  await createTransporter().sendMail(mailOptions);
};
