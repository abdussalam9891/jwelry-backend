import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export const sendResetEmail =
  async (email, resetLink) => {
    try {
      await resend.emails.send({
        from:
          "Gemora <onboarding@resend.dev>",
        to: email,
        subject:
          "Reset your Gemora password",
       html: `
  <div style="
    margin:0;
    padding:40px 20px;
    background:#F8F6F7;
    font-family:Arial, sans-serif;
  ">
    <div style="
      max-width:560px;
      margin:auto;
      background:#FFFFFF;
      border:1px solid #EEE7EA;
      border-radius:24px;
      overflow:hidden;
      box-shadow:0 12px 40px rgba(0,0,0,0.08);
    ">

      <!-- TOP BAR -->
      <div style="
        background:linear-gradient(
          135deg,
          #6B1A2A 0%,
          #8E243A 100%
        );
        padding:32px;
        text-align:center;
      ">
        <h1 style="
          margin:0;
          color:#fff;
          font-size:28px;
          font-weight:700;
          letter-spacing:1px;
        ">
          Gemora
        </h1>

        <p style="
          margin:10px 0 0;
          color:#F8DDE3;
          font-size:14px;
        ">
          Luxury Jewelry Management
        </p>
      </div>

      <!-- BODY -->
      <div style="
        padding:40px 36px;
        color:#1A1A1A;
      ">
        <h2 style="
          margin:0;
          font-size:26px;
          font-weight:700;
          color:#111;
        ">
          Reset Your Password
        </h2>

        <p style="
          margin:18px 0 0;
          font-size:15px;
          line-height:1.7;
          color:#5F6368;
        ">
          We received a request to reset your
          Gemora account password.
          Click the secure button below to continue.
        </p>

        <!-- BUTTON -->
        <div style="
          text-align:center;
          margin:34px 0;
        ">
          <a
            href="${resetLink}"
            style="
              display:inline-block;
              background:#6B1A2A;
              color:#fff;
              text-decoration:none;
              padding:14px 30px;
              border-radius:14px;
              font-size:15px;
              font-weight:600;
              box-shadow:
                0 10px 24px
                rgba(107,26,42,0.25);
            "
          >
            Reset Password
          </a>
        </div>

        <p style="
          margin:0;
          font-size:14px;
          line-height:1.7;
          color:#777;
        ">
          This reset link will expire in
          <strong>10 minutes</strong>
          for security reasons.
        </p>

        <p style="
          margin-top:18px;
          font-size:14px;
          line-height:1.7;
          color:#777;
        ">
          If you didn’t request this,
          you can safely ignore this email.
        </p>
      </div>

      <!-- FOOTER -->
      <div style="
        border-top:1px solid #F0ECEE;
        padding:20px;
        text-align:center;
        background:#FCFAFB;
      ">
        <p style="
          margin:0;
          font-size:12px;
          color:#999;
          letter-spacing:0.3px;
        ">
          © Gemora • Secure Account Access
        </p>
      </div>
    </div>
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
