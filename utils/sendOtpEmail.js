import { sendEmail } from "../service/email/sendEmail.js";
import { getOtpTemplate } from "../templates/otpTemplate.js";

export async function sendOtpEmail(email, otp) {
  return sendEmail({
    to: email,
    subject: "Verify your email • Gemora",
    html: getOtpTemplate({ otp }),
  });
}
