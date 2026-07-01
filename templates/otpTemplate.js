import { emailLayout } from "./layout/emailLayout.js";

export function getOtpTemplate({ otp }) {
  return emailLayout({
    title: "Verify Your Email",

    preheader:
      "Use this OTP to verify your Gemora account.",

    content: `

<h2 style="
margin-top:0;
color:#6B1A2A;
">
Verify Your Email
</h2>

<p>

Welcome to <strong>Gemora</strong>.

</p>

<p>

Use the One-Time Password (OTP) below to verify your email address and complete your account registration.

</p>

<div style="
margin:35px 0;
text-align:center;
">

<div style="
display:inline-block;
padding:20px 36px;
background:#F9EFF2;
border:1px solid #E8D8DD;
border-radius:16px;
">

<span style="
font-size:34px;
font-weight:bold;
letter-spacing:10px;
color:#6B1A2A;
">

${otp}

</span>

</div>

</div>

<div class="notice">

<strong>

Security Notice

</strong>

<ul style="
padding-left:20px;
line-height:1.8;
margin-top:14px;
">

<li>This OTP expires in <strong>10 minutes</strong>.</li>

<li>Never share this code with anyone.</li>

<li>Gemora will never ask for your OTP.</li>

<li>If you didn't request this verification, you can safely ignore this email.</li>

</ul>

</div>

`,
  });
}
