import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export const sendAdminContactNotification =
  async ({
    name,
    email,
    phone,
    category,
    orderNumber,
    subject,
    message,
  }) => {

    try {

      await resend.emails.send({

        from:
          "Gemora <onboarding@resend.dev>",

        to:
          "gemora.auth@gmail.com",

        subject:
          `New Inquiry • ${category}`,

        html: `

<div style="
  font-family:Arial,sans-serif;
  max-width:700px;
  margin:auto;
  background:#fff;
">

  <div style="
    background:#6B1A2A;
    color:white;
    padding:24px;
  ">

    <h2 style="
      margin:0;
    ">
      New Customer Inquiry
    </h2>

  </div>

  <div style="
    padding:24px;
  ">

    <table
      width="100%"
      cellpadding="10"
      style="
        border-collapse:collapse;
      "
    >

      <tr>
        <td><strong>Name</strong></td>
        <td>${name}</td>
      </tr>

      <tr>
        <td><strong>Email</strong></td>
        <td>${email}</td>
      </tr>

      <tr>
        <td><strong>Phone</strong></td>
        <td>${phone || "-"}</td>
      </tr>

      <tr>
        <td><strong>Category</strong></td>
        <td>${category}</td>
      </tr>

      <tr>
        <td><strong>Order Number</strong></td>
        <td>${orderNumber || "-"}</td>
      </tr>

      <tr>
        <td><strong>Subject</strong></td>
        <td>${subject}</td>
      </tr>

    </table>

    <div style="
      margin-top:30px;
      padding:20px;
      background:#F8F6F7;
      border-radius:12px;
    ">

      <h3>
        Message
      </h3>

      <p style="
        white-space:pre-wrap;
        line-height:1.8;
      ">
        ${message}
      </p>

    </div>

  </div>

</div>

        `,
      });

    } catch (error) {

      console.error(
        "Admin notification failed:",
        error
      );

    }

  };
