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
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 24px;
          border: 1px solid #eee;
          border-radius: 12px;
        ">
          <h2 style="color:#6B1A2A;">
            Verify your email
          </h2>

          <p>
            Use the OTP below to verify your Gemora account:
          </p>

          <div style="
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 4px;
            margin: 20px 0;
            color:#6B1A2A;
          ">
            ${otp}
          </div>

          <p>
            This OTP expires in
            <b>10 minutes</b>.
          </p>

          <p style="color:#777;">
            If you didn’t request this,
            ignore this email.
          </p>
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
