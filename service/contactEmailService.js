 
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export const sendContactConfirmationEmail =
  async (
    email,
    name,
    inquiryType
  ) => {

    try {

      await resend.emails.send({

        from:
          "Gemora <onboarding@resend.dev>",

        to: email,

        subject:
          "We've received your inquiry",

        html: `
<div style="
  margin:0;
  padding:40px 20px;
  background:#F8F6F7;
  font-family:Arial,sans-serif;
">

  <div style="
    max-width:560px;
    margin:auto;
    background:#fff;
    border-radius:24px;
    overflow:hidden;
    border:1px solid #EEE7EA;
    box-shadow:0 12px 40px rgba(0,0,0,.08);
  ">

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
        color:white;
        font-size:28px;
      ">
        Gemora
      </h1>

      <p style="
        color:#F8DDE3;
        margin-top:10px;
      ">
        Customer Support
      </p>

    </div>

    <div style="
      padding:40px 36px;
      color:#111;
    ">

      <h2 style="
        margin-top:0;
        font-size:26px;
      ">
        Thank You For Reaching Out
      </h2>

      <p style="
        color:#666;
        line-height:1.8;
      ">
        Hi ${name},
      </p>

      <p style="
        color:#666;
        line-height:1.8;
      ">
        We've successfully received your
        <strong>${inquiryType}</strong>
        inquiry.
      </p>

      <p style="
        color:#666;
        line-height:1.8;
      ">
        Our support team is reviewing
        your request and will get back
        to you within 24 business hours.
      </p>

      <div style="
        margin:30px 0;
        padding:18px;
        background:#F9EFF2;
        border-radius:16px;
      ">
        <strong>
          Status:
        </strong>
        Inquiry Received
      </div>

      <p style="
        color:#666;
        line-height:1.8;
      ">
        Thank you for choosing Gemora.
      </p>

    </div>

    <div style="
      border-top:1px solid #F0ECEE;
      padding:20px;
      text-align:center;
      background:#FCFAFB;
    ">

      <p style="
        margin:0;
        color:#999;
        font-size:12px;
      ">
        © Gemora • Luxury Jewellery
      </p>

    </div>

  </div>

</div>
        `,
      });

    } catch (error) {

      console.error(
        "Contact email failed:",
        error
      );

      throw error;

    }

  };

