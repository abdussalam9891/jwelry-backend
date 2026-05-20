import nodemailer from "nodemailer";

const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendResetEmail =
  async (email, resetLink) => {
    try {
      await transporter.sendMail({
        from: `"Gemora" <${process.env.EMAIL_USER}>`,
        to: email,
        subject:
          "Reset your Gemora password",
        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: auto;
            padding: 24px;
            border: 1px solid #eee;
            border-radius: 12px;
          ">
            <h2 style="color:#6B1A2A;">
              Reset Password
            </h2>

            <p>
              Click below to reset your password:
            </p>

            <a
              href="${resetLink}"
              style="
                display:inline-block;
                margin-top:20px;
                background:#6B1A2A;
                color:white;
                padding:12px 20px;
                border-radius:8px;
                text-decoration:none;
              "
            >
              Reset Password
            </a>

            <p style="
              margin-top:20px;
              color:#777;
            ">
              If you didn’t request this,
              ignore this email.
            </p>
          </div>
        `,
      });
    } catch (err) {
      console.error(
        "Reset email failed:",
        err
      );
      throw err;
    }
  };
