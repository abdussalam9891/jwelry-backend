import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendEmail({
  to,
  subject,
  html,
  attachments = [],
}) {
  if (!to) {
    throw new Error("Email recipient is required.");
  }

  if (!subject) {
    throw new Error("Email subject is required.");
  }

  if (!html) {
    throw new Error("Email HTML is required.");
  }

  try {
    return await resend.emails.send({
      from: process.env.EMAIL_FROM,

      to,

      subject,

      html,

      attachments,
    });
  } catch (err) {
    console.error(
      "Failed to send email:",
      err
    );

    throw err;
  }
}
