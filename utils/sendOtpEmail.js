import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export const sendOtpEmail = async (
  email,
  otp
) => {
  try {
    await resend.emails.send({
      from:
        "Gemora <onboarding@resend.dev>",
      to: email,
      subject:
        "Verify your email - Gemora",
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
          Secure Account Verification
        </p>
      </div>

      <!-- BODY -->
      <div style="
        padding:40px 36px;
        color:#1A1A1A;
        text-align:center;
      ">
        <h2 style="
          margin:0;
          font-size:26px;
          font-weight:700;
          color:#111;
        ">
          Verify Your Email
        </h2>

        <p style="
          margin:18px 0 0;
          font-size:15px;
          line-height:1.7;
          color:#5F6368;
        ">
          Use the secure OTP below to
          verify your Gemora account.
        </p>

        <!-- OTP BOX -->
        <div style="
          margin:30px auto;
          display:inline-block;
          padding:18px 30px;
          border-radius:18px;
          background:#F9EFF2;
          border:1px solid #E7D7DC;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.7);
        ">
          <span style="
            font-size:34px;
            font-weight:700;
            letter-spacing:8px;
            color:#6B1A2A;
          ">
            ${otp}
          </span>
        </div>

        <p style="
          margin:0;
          font-size:14px;
          line-height:1.7;
          color:#777;
        ">
          This OTP will expire in
          <strong>10 minutes</strong>.
        </p>

        <p style="
          margin-top:18px;
          font-size:14px;
          line-height:1.7;
          color:#777;
        ">
          Never share this code with anyone.
          Gemora will never ask for it.
        </p>

        <p style="
          margin-top:14px;
          font-size:14px;
          line-height:1.7;
          color:#999;
        ">
          If you didn’t request this,
          safely ignore this email.
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
          © Gemora • Protected Authentication
        </p>
      </div>
    </div>
  </div>
`,
    });

    console.log(
      "OTP email sent successfully"
    );
  } catch (err) {
    console.error(
      "OTP email failed:",
      err
    );
    throw err;
  }
};
