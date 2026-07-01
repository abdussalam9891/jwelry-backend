import { emailLayout } from "./layout/emailLayout.js";

import { button } from "./layout/components.js";

export function getResetPasswordTemplate({
  resetLink,
}) {
  return emailLayout({
    title: "Reset Password",

    preheader:
      "Reset your Gemora account password.",

    content: `

<h2 style="
margin-top:0;
color:#6B1A2A;
">

Reset Your Password

</h2>

<p>

We received a request to reset your Gemora account password.

</p>

<p>

Click the button below to create a new password.

</p>

<div style="
text-align:center;
margin:36px 0;
">

${button(
  "Reset Password",
  resetLink
)}

</div>

<p>

If the button doesn't work, copy and paste the following link into your browser:

</p>

<div class="card">

<p style="
margin:0;
font-size:13px;
word-break:break-word;
">

${resetLink}

</p>

</div>

<div class="notice">

<strong>

Security Reminder

</strong>

<ul style="
padding-left:20px;
line-height:1.8;
margin-top:14px;
">

<li>This reset link expires in <strong>10 minutes</strong>.</li>

<li>For your security, the link can only be used once.</li>

<li>If you didn't request this password reset, simply ignore this email.</li>

</ul>

</div>

`,
  });
}
