export function verificationTemplate(email: string, name: string, verificationURL: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f6f7f9; font-family: Arial, sans-serif; color:#333;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f6f7f9; padding:20px 0;">
          <tr>
              <td align="center">
                  <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                      
                      <!-- HEADER -->
                      <tr>
                          <td align="center" style="background:linear-gradient(135deg,#6b5bff 0%,#4a3aff 100%); padding:40px 30px;">
                              <h1 style="color:#ffffff; font-size:26px; font-weight:600; margin:0;">Verify Your Email</h1>
                              <p style="color:#e5e5ff; font-size:14px; margin:8px 0 0;">Join the Nexcare Community</p>
                          </td>
                      </tr>

                      <!-- CONTENT -->
                      <tr>
                          <td style="padding:40px 30px;">
                              <p style="font-size:18px; font-weight:600; margin:0 0 20px;">Hello, ${name}!</p>
                              
                              <p style="font-size:15px; color:#555; line-height:1.6; margin:0 0 30px;">
                                  Thank you for joining Nexcare! We're excited to connect you with quality care services.
                                  To complete your registration and start accessing caregivers or managing your profile,
                                  please verify your email address by clicking the button below.
                              </p>

                              <!-- BUTTON -->
                              <div align="center" style="margin:35px 0;">
                                  <a href="${verificationURL}" target="_blank"
                                      style="display:inline-block; background-color:#6b5bff; color:#ffffff;
                                      text-decoration:none; padding:14px 36px; border-radius:6px;
                                      font-size:16px; font-weight:bold;">
                                      Verify Email Address
                                  </a>
                              </div>

                              <!-- SECURITY NOTICE -->
                              <div style="background-color:#f1f3ff; border-left:4px solid #6b5bff; padding:15px 20px; border-radius:6px; margin:25px 0;">
                                  <p style="font-size:13px; color:#333; margin:0;">
                                      <strong>Security Notice:</strong> This verification link will expire in 24 hours.
                                      If you didn’t create an account, please ignore this email.
                                  </p>
                              </div>

                              <!-- DIVIDER -->
                              <div style="text-align:center; margin:30px 0; position:relative;">
                                  <div style="height:1px; background-color:#ddd; width:100%; position:absolute; top:50%; left:0;"></div>
                                  <span style="background-color:#fff; position:relative; padding:0 12px; color:#888; font-size:13px;">OR</span>
                              </div>

                              <!-- ALTERNATIVE LINK -->
                              <div style="background-color:#f9fafb; padding:15px; border-radius:6px; margin:20px 0; border:1px solid #e5e7eb;">
                                  <p style="font-size:13px; color:#666; margin-bottom:8px;">If the button doesn’t work, copy and paste this link into your browser:</p>
                                  <a href="${verificationURL}" style="font-size:13px; color:#6b5bff; word-break:break-all; text-decoration:none;">${verificationURL}</a>
                              </div>

                              <p style="font-size:14px; color:#555; margin-top:30px;">
                                  If you have any questions or need assistance, feel free to reach out to our care support team.
                              </p>
                          </td>
                      </tr>

                      <!-- FOOTER -->
                      <tr>
                          <td align="center" style="background-color:#f3f4f6; padding:25px 20px; border-top:1px solid #e5e7eb;">
                              <p style="font-size:13px; color:#666; margin:0 0 8px;">This email was sent to <strong>${email}</strong></p>
                              <p style="font-size:13px; color:#999; margin:0;">&copy; 2025 Nexcare. All rights reserved.</p>
                          </td>
                      </tr>

                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>
  `;
}