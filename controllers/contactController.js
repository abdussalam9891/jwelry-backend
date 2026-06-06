
import Contact from "../models/contactModel.js";

import {
  sendContactConfirmationEmail,
} from "../service/contactEmailService.js";

import {
  sendAdminContactNotification,
} from "../service/adminNotificationEmailService.js";



export const createContact =
  async (req, res) => {

    try {

      const {
        name,
        email,
        phone,
        category,
        orderNumber,
        subject,
        message,
      } = req.body;

      const inquiry =
        await Contact.create({

          user:
            req.user?._id || null,

          name,
          email,
          phone,
          category,
          orderNumber,
          subject,
          message,

        });


        // Customer Email

sendContactConfirmationEmail(
  email,
  name,
  category
).catch(console.error);

// Admin Email

sendAdminContactNotification({
  name,
  email,
  phone,
  category,
  orderNumber,
  subject,
  message,
}).catch(console.error);







      res.status(201).json({

        success: true,

        message:
          "Inquiry submitted successfully",

        inquiry,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

