
import Contact from "../../models/contactModel.js";

/*
   GET CONTACTS
  */

export const getContacts =
  async (req, res) => {

    try {

      const {
        status = "All",
        search = "",
        page = 1,
        limit = 10,
      } = req.query;

      const query = {};

      if (
        status !== "All"
      ) {

        query.status =
          status;

      }

      if (search) {

        query.$or = [

          {
            name: {
              $regex: search,
              $options: "i",
            },
          },

          {
            email: {
              $regex: search,
              $options: "i",
            },
          },

          {
            subject: {
              $regex: search,
              $options: "i",
            },
          },

          {
            orderNumber: {
              $regex: search,
              $options: "i",
            },
          },

        ];

      }

      const skip =
        (Number(page) - 1) *
        Number(limit);

      const contacts =
        await Contact.find(
          query
        )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(
            Number(limit)
          );

      const total =
        await Contact.countDocuments(
          query
        );

      res.json({

        success: true,

        contacts,

        pagination: {

          total,

          page:
            Number(page),

          pages:
            Math.ceil(
              total /
              Number(limit)
            ),

        },

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/*
   GET CONTACT DETAILS
  */

export const getContactDetails =
  async (req, res) => {

    try {

      const contact =
        await Contact.findById(
          req.params.id
        );

      if (!contact) {

        return res
          .status(404)
          .json({

            success: false,

            message:
              "Inquiry not found",

          });

      }

      // Auto mark as opened

      if (
        contact.status ===
        "Unread"
      ) {

        contact.status =
          "In Progress";

        await contact.save();

      }

      res.json({

        success: true,

        contact,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/*
   UPDATE CONTACT STATUS
  */

export const updateContactStatus =
  async (req, res) => {

    try {

      const {
        status,
        adminNote,
      } = req.body;

      const allowedStatuses = [

        "Unread",

        "In Progress",

        "Resolved",

      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Invalid status",

          });

      }

      const contact =
        await Contact.findById(
          req.params.id
        );

      if (!contact) {

        return res
          .status(404)
          .json({

            success: false,

            message:
              "Inquiry not found",

          });

      }

      contact.status =
        status;

      if (
        adminNote !==
        undefined
      ) {

        contact.adminNote =
          adminNote;

      }

      if (
        status ===
        "Resolved"
      ) {

        contact.resolvedAt =
          new Date();

      }

      await contact.save();

      res.json({

        success: true,

        message:
          "Inquiry updated successfully",

        contact,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

