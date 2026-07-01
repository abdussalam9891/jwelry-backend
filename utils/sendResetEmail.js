import { sendEmail } from "../service/email/sendEmail.js";
import { getResetPasswordTemplate } from "../templates/resetPasswordTemplate.js";

export async function sendResetEmail(
  email,
  resetLink
) {
  return sendEmail({
    to: email,
    subject: "Reset your Gemora password",
    html: getResetPasswordTemplate({
      resetLink,
    }),
  });
}
