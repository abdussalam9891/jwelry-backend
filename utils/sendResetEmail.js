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
            font-family: Arial;
            max-width:500px;
            margin:auto;
            padding:24px;
          ">
            <h2>Reset Password</h2>

            <a href="${resetLink}">
              Reset Password
            </a>
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
